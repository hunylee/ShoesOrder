// Windly 실시간 업로드 스크립트
// 브라우저를 열어 로그인 후 CSV 업로드를 진행합니다
// 실행: npx tsx scripts/windly-upload.ts [csv파일경로]

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

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
    // CSV 파일 경로 확인
    const csvPath = process.argv[2];

    console.log('='.repeat(60));
    console.log('📤 윈들리 CSV 업로드');
    console.log('   계정: hunylee@naver.com');
    console.log('='.repeat(60));
    console.log('');

    if (!csvPath) {
        // CSV 파일이 지정되지 않은 경우, 먼저 생성
        console.log('CSV 파일 경로가 지정되지 않았습니다.');
        console.log('상품 데이터를 가져와서 CSV를 생성합니다...');
        console.log('');
    }

    // 브라우저 시작 (화면 표시)
    console.log('브라우저를 시작합니다...');
    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized'],
    });

    const context = await browser.newContext({
        viewport: null,
    });

    const page = await context.newPage();

    try {
        // 1. 윈들리 접속
        console.log('윈들리에 접속 중...');
        await page.goto(WINDLY_URL, { waitUntil: 'networkidle' });

        // 2. 로그인 상태 확인
        const isLoggedIn = await page.evaluate(() => {
            return document.body.innerText.includes('로그아웃') ||
                document.body.innerText.includes('마이페이지') ||
                document.body.innerText.includes('대시보드');
        });

        if (!isLoggedIn) {
            console.log('');
            console.log('='.repeat(60));
            console.log('📌 로그인이 필요합니다!');
            console.log('');
            console.log('   1. "로그인" 버튼 클릭');
            console.log('   2. "네이버로 로그인" 선택');
            console.log('   3. hunylee@naver.com으로 로그인');
            console.log('='.repeat(60));
            console.log('');

            await waitForEnter('로그인 완료 후 Enter 키를 눌러주세요...');
        } else {
            console.log('✅ 이미 로그인되어 있습니다.');
        }

        // 3. 상품 관리 > 대량 등록 페이지로 이동
        console.log('');
        console.log('상품 관리 페이지로 이동 중...');

        // 상품 관리 메뉴 찾기 및 클릭
        try {
            // 먼저 대시보드나 메인 페이지로 이동
            await page.goto('https://www.windly.cc/view3/main', { waitUntil: 'networkidle' });
            await page.waitForTimeout(2000);

            console.log('✅ 상품 관리 페이지 접속 완료');

            // 스크린샷
            await page.screenshot({ path: 'windly-product-page.png', fullPage: true });
            console.log('스크린샷 저장: windly-product-page.png');

        } catch (e) {
            console.log('상품 관리 페이지 접속 중 오류:', e);
        }

        // 4. CSV 업로드 안내
        console.log('');
        console.log('='.repeat(60));
        console.log('📋 CSV 업로드를 진행하세요:');
        console.log('');
        console.log('   1. 브라우저에서 "상품 등록" 또는 "대량 등록" 메뉴 선택');
        console.log('   2. CSV 파일 선택 및 업로드');
        console.log('   3. 상품 정보 확인 및 등록');
        console.log('='.repeat(60));
        console.log('');

        await waitForEnter('작업 완료 후 Enter 키를 눌러주세요...');

        // 최종 스크린샷
        await page.screenshot({ path: 'windly-upload-result.png', fullPage: true });
        console.log('스크린샷 저장: windly-upload-result.png');

    } catch (error) {
        console.error('오류 발생:', error);
        await page.screenshot({ path: 'windly-error.png', fullPage: true });
    } finally {
        await waitForEnter('\nEnter 키를 눌러 브라우저를 닫습니다...');
        await browser.close();
        console.log('완료!');
    }
}

main().catch(console.error);
