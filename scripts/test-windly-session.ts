// Windly 세션 연결 테스트
// 저장된 세션으로 윈들리에 접속이 되는지 확인
// 실행: npx tsx scripts/test-windly-session.ts

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const SESSION_FILE = path.join(process.cwd(), 'windly-session.json');

async function main() {
    console.log('='.repeat(60));
    console.log('🔍 윈들리 세션 연결 테스트');
    console.log('='.repeat(60));
    console.log('');

    // 세션 파일 확인
    if (!fs.existsSync(SESSION_FILE)) {
        console.error('❌ 세션 파일이 없습니다. 먼저 windly-login.ts를 실행해 주세요.');
        return;
    }

    const sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
    console.log('세션 파일 발견!');
    console.log('- 저장 시간:', sessionData.savedAt);
    console.log('- 계정:', sessionData.account);
    console.log('- 쿠키 수:', sessionData.cookies.length);
    console.log('');

    // 브라우저 시작 (headless 모드)
    console.log('브라우저 시작 중 (headless 모드)...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    // 세션 쿠키 로드
    console.log('세션 쿠키 적용 중...');
    await context.addCookies(sessionData.cookies);

    const page = await context.newPage();

    try {
        // 윈들리 메인 페이지 접속
        console.log('윈들리 접속 중...');
        await page.goto('https://www.windly.cc', { waitUntil: 'networkidle' });

        // 로그인 상태 확인
        const currentUrl = page.url();
        console.log('현재 URL:', currentUrl);

        // 페이지 내용 확인
        const pageContent = await page.content();

        // 로그아웃 버튼이나 마이페이지 버튼 확인
        const isLoggedIn = pageContent.includes('로그아웃') ||
            pageContent.includes('마이페이지') ||
            pageContent.includes('heonylee') ||
            pageContent.includes('대시보드');

        if (isLoggedIn) {
            console.log('');
            console.log('='.repeat(60));
            console.log('✅ 세션 연결 성공! 로그인 상태가 유지되고 있습니다.');
            console.log('='.repeat(60));

            // 상품 관리 페이지 테스트
            console.log('');
            console.log('상품 관리 페이지 접속 테스트...');
            await page.goto('https://www.windly.cc/view3/main', { waitUntil: 'networkidle' });

            const productPageUrl = page.url();
            console.log('상품 관리 URL:', productPageUrl);

            // 스크린샷 저장
            await page.screenshot({ path: 'windly-session-test.png', fullPage: true });
            console.log('');
            console.log('스크린샷 저장: windly-session-test.png');

        } else {
            console.log('');
            console.log('='.repeat(60));
            console.log('❌ 세션이 만료되었거나 유효하지 않습니다.');
            console.log('   다시 로그인해 주세요: npx tsx scripts/windly-login.ts');
            console.log('='.repeat(60));

            await page.screenshot({ path: 'windly-session-failed.png', fullPage: true });
        }

    } catch (error) {
        console.error('오류 발생:', error);
        await page.screenshot({ path: 'windly-error.png', fullPage: true });
    } finally {
        await browser.close();
        console.log('');
        console.log('테스트 완료!');
    }
}

main().catch(console.error);
