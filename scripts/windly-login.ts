// Windly 세션 로그인 스크립트
// 브라우저를 열고 수동 로그인 후 세션을 저장합니다
// 실행: npx tsx scripts/windly-login.ts

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const SESSION_FILE = path.join(process.cwd(), 'windly-session.json');
const WINDLY_URL = 'https://www.windly.cc';

async function waitForEnter(message: string): Promise<void> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(message, () => {
            rl.close();
            resolve();
        });
    });
}

async function main() {
    console.log('='.repeat(60));
    console.log('🔑 윈들리 로그인 도우미');
    console.log('   네이버 계정: hunylee@naver.com');
    console.log('='.repeat(60));
    console.log('');

    // 브라우저 시작 (화면 표시)
    console.log('브라우저를 시작합니다...');
    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized'],
    });

    const context = await browser.newContext({
        viewport: null, // 전체 화면 사용
    });

    const page = await context.newPage();

    try {
        // 윈들리 접속
        console.log('윈들리에 접속 중...');
        await page.goto(WINDLY_URL, { waitUntil: 'networkidle' });

        console.log('');
        console.log('='.repeat(60));
        console.log('📌 브라우저에서 다음 작업을 수행해 주세요:');
        console.log('');
        console.log('   1. "로그인" 버튼 클릭');
        console.log('   2. "네이버로 로그인" 버튼 클릭');
        console.log('   3. 네이버 계정 (hunylee@naver.com)으로 로그인');
        console.log('   4. 윈들리 홈 화면이 보이면 로그인 완료!');
        console.log('');
        console.log('='.repeat(60));
        console.log('');

        // 사용자가 로그인 완료할 때까지 대기
        await waitForEnter('로그인 완료 후 Enter 키를 눌러주세요...');

        // 현재 URL 확인
        const currentUrl = page.url();
        console.log('현재 URL:', currentUrl);

        // 쿠키 저장
        const cookies = await context.cookies();

        if (cookies.length === 0) {
            console.log('❌ 쿠키를 가져올 수 없습니다.');
            return;
        }

        const sessionData = {
            cookies: cookies.map(c => ({
                name: c.name,
                value: c.value,
                domain: c.domain,
                path: c.path,
                expires: c.expires,
                httpOnly: c.httpOnly,
                secure: c.secure,
                sameSite: c.sameSite,
            })),
            savedAt: new Date().toISOString(),
            account: 'hunylee@naver.com',
        };

        fs.writeFileSync(SESSION_FILE, JSON.stringify(sessionData, null, 2));

        console.log('');
        console.log('='.repeat(60));
        console.log('✅ 세션이 저장되었습니다!');
        console.log('   파일: windly-session.json');
        console.log('   쿠키 수:', cookies.length);
        console.log('='.repeat(60));

        // 스크린샷 저장
        await page.screenshot({ path: 'windly-logged-in.png', fullPage: true });
        console.log('스크린샷 저장: windly-logged-in.png');

    } catch (error) {
        console.error('오류 발생:', error);
    } finally {
        await waitForEnter('\nEnter 키를 눌러 브라우저를 닫습니다...');
        await browser.close();
        console.log('완료!');
    }
}

main().catch(console.error);
