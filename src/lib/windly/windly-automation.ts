// Windly Browser Automation
// 윈들리 브라우저 자동화 (Playwright 기반)

import { chromium, Browser, Page, BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// 세션 파일 경로
const SESSION_FILE = path.join(process.cwd(), 'windly-session.json');

export interface WindlySession {
    cookies: Array<{
        name: string;
        value: string;
        domain: string;
        path: string;
        expires: number;
        httpOnly: boolean;
        secure: boolean;
        sameSite: 'Strict' | 'Lax' | 'None';
    }>;
    savedAt: string;
}

export interface UploadResult {
    success: boolean;
    message: string;
    productsUploaded?: number;
}

export class WindlyAutomation {
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;
    private page: Page | null = null;

    private readonly WINDLY_URL = 'https://www.windly.cc';
    private readonly WINDLY_LOGIN_URL = 'https://www.windly.cc/login';
    private readonly WINDLY_PRODUCT_URL = 'https://www.windly.cc/product';

    /**
     * 브라우저 초기화
     */
    async initialize(headless: boolean = true): Promise<void> {
        this.browser = await chromium.launch({
            headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        this.context = await this.browser.newContext({
            viewport: { width: 1280, height: 800 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        });

        this.page = await this.context.newPage();
    }

    /**
     * 저장된 세션 불러오기
     */
    async loadSession(): Promise<boolean> {
        try {
            if (!fs.existsSync(SESSION_FILE)) {
                console.log('세션 파일이 없습니다. 로그인이 필요합니다.');
                return false;
            }

            const sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8')) as WindlySession;

            // 세션 만료 체크 (24시간)
            const savedAt = new Date(sessionData.savedAt);
            const now = new Date();
            const hoursDiff = (now.getTime() - savedAt.getTime()) / (1000 * 60 * 60);

            if (hoursDiff > 24) {
                console.log('세션이 만료되었습니다. 다시 로그인해 주세요.');
                return false;
            }

            if (this.context) {
                await this.context.addCookies(sessionData.cookies);
                console.log('세션을 불러왔습니다.');
                return true;
            }

            return false;
        } catch (error) {
            console.error('세션 불러오기 실패:', error);
            return false;
        }
    }

    /**
     * 현재 세션 저장
     */
    async saveSession(): Promise<boolean> {
        try {
            if (!this.context) {
                throw new Error('브라우저 컨텍스트가 없습니다.');
            }

            const cookies = await this.context.cookies();

            const sessionData: WindlySession = {
                cookies: cookies.map(c => ({
                    name: c.name,
                    value: c.value,
                    domain: c.domain,
                    path: c.path,
                    expires: c.expires,
                    httpOnly: c.httpOnly,
                    secure: c.secure,
                    sameSite: c.sameSite as 'Strict' | 'Lax' | 'None',
                })),
                savedAt: new Date().toISOString(),
            };

            fs.writeFileSync(SESSION_FILE, JSON.stringify(sessionData, null, 2));
            console.log('세션이 저장되었습니다.');
            return true;
        } catch (error) {
            console.error('세션 저장 실패:', error);
            return false;
        }
    }

    /**
     * 로그인 상태 확인
     */
    async isLoggedIn(): Promise<boolean> {
        if (!this.page) return false;

        try {
            await this.page.goto(this.WINDLY_URL, { waitUntil: 'networkidle' });

            // 로그인된 상태 확인 (사용자 메뉴 또는 프로필 존재 여부)
            const isLoggedIn = await this.page.evaluate(() => {
                // 로그인 버튼이 없거나, 마이페이지/로그아웃 버튼이 있으면 로그인 상태
                const loginBtn = document.querySelector('a[href*="login"]');
                const logoutBtn = document.querySelector('a[href*="logout"]');
                const myPage = document.querySelector('a[href*="mypage"]');

                return !loginBtn || !!logoutBtn || !!myPage;
            });

            return isLoggedIn;
        } catch (error) {
            console.error('로그인 상태 확인 실패:', error);
            return false;
        }
    }

    /**
     * 로그인 페이지 열기 (수동 로그인용)
     * headless: false로 설정하여 사용자가 직접 로그인할 수 있도록 함
     */
    async openLoginPage(): Promise<void> {
        if (!this.page) {
            await this.initialize(false); // 화면 표시
        }

        await this.page!.goto(this.WINDLY_LOGIN_URL, { waitUntil: 'networkidle' });
        console.log('로그인 페이지가 열렸습니다. 네이버로 로그인해 주세요.');
    }

    /**
     * 수동 로그인 완료 대기 및 세션 저장
     */
    async waitForLoginAndSave(timeoutMs: number = 300000): Promise<boolean> {
        if (!this.page) return false;

        try {
            // 홈페이지로 리다이렉트될 때까지 대기 (최대 5분)
            await this.page.waitForURL(url => !url.href.includes('login'), {
                timeout: timeoutMs,
            });

            console.log('로그인 성공! 세션을 저장합니다...');
            await this.saveSession();
            return true;
        } catch (error) {
            console.error('로그인 대기 시간 초과:', error);
            return false;
        }
    }

    /**
     * CSV 파일 업로드
     */
    async uploadCSV(csvFilePath: string): Promise<UploadResult> {
        if (!this.page) {
            return { success: false, message: '브라우저가 초기화되지 않았습니다.' };
        }

        try {
            // 로그인 상태 확인
            const loggedIn = await this.isLoggedIn();
            if (!loggedIn) {
                return { success: false, message: '로그인이 필요합니다.' };
            }

            // 상품 관리 페이지로 이동
            await this.page.goto(this.WINDLY_PRODUCT_URL, { waitUntil: 'networkidle' });

            // 대량 등록 메뉴 찾기
            const bulkUploadBtn = await this.page.$('button:has-text("대량등록"), a:has-text("대량등록"), [class*="bulk"], [class*="upload"]');

            if (bulkUploadBtn) {
                await bulkUploadBtn.click();
                await this.page.waitForLoadState('networkidle');
            }

            // 파일 입력 요소 찾기
            const fileInput = await this.page.$('input[type="file"]');
            if (!fileInput) {
                return { success: false, message: '파일 업로드 입력을 찾을 수 없습니다.' };
            }

            // CSV 파일 업로드
            await fileInput.setInputFiles(csvFilePath);

            // 업로드 버튼 클릭
            const uploadBtn = await this.page.$('button:has-text("업로드"), button:has-text("등록")');
            if (uploadBtn) {
                await uploadBtn.click();
                await this.page.waitForLoadState('networkidle');
            }

            // 결과 확인 (성공 메시지 또는 에러)
            await this.page.waitForTimeout(3000);

            const successMsg = await this.page.$('[class*="success"], [class*="complete"]');
            if (successMsg) {
                const text = await successMsg.textContent();
                return {
                    success: true,
                    message: text || 'CSV 업로드 완료!',
                };
            }

            return { success: true, message: 'CSV 파일이 업로드되었습니다.' };
        } catch (error) {
            return {
                success: false,
                message: `업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
            };
        }
    }

    /**
     * 스크린샷 저장 (디버깅용)
     */
    async takeScreenshot(filename: string): Promise<void> {
        if (this.page) {
            await this.page.screenshot({ path: filename, fullPage: true });
        }
    }

    /**
     * 브라우저 닫기
     */
    async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.context = null;
            this.page = null;
        }
    }

    /**
     * 현재 페이지 가져오기 (디버깅용)
     */
    getPage(): Page | null {
        return this.page;
    }
}

// 싱글톤 인스턴스
let windlyInstance: WindlyAutomation | null = null;

export function getWindlyAutomation(): WindlyAutomation {
    if (!windlyInstance) {
        windlyInstance = new WindlyAutomation();
    }
    return windlyInstance;
}

export default WindlyAutomation;
