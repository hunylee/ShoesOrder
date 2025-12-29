// Windly 연동 테스트 스크립트
// 실행: npx ts-node --esm scripts/test-windly.ts

import { WindlyAutomation } from '../src/lib/windly/windly-automation';

async function testWindlyConnection() {
    console.log('='.repeat(50));
    console.log('윈들리 연동 테스트 시작');
    console.log('='.repeat(50));

    const windly = new WindlyAutomation();

    try {
        // 1. 브라우저 초기화 (화면 표시)
        console.log('\n1. 브라우저 초기화 중...');
        await windly.initialize(false); // headless: false로 화면 표시

        // 2. 기존 세션 확인
        console.log('\n2. 기존 세션 확인 중...');
        const hasSession = await windly.loadSession();

        if (hasSession) {
            console.log('✅ 저장된 세션이 있습니다.');

            // 로그인 상태 확인
            const isLoggedIn = await windly.isLoggedIn();
            if (isLoggedIn) {
                console.log('✅ 로그인 상태 확인됨!');
                console.log('\n테스트 완료! 윈들리에 정상 연결되었습니다.');
                await windly.takeScreenshot('windly-connected.png');
                console.log('스크린샷 저장: windly-connected.png');
            } else {
                console.log('❌ 세션이 만료되었습니다. 다시 로그인해 주세요.');
                await openLoginAndWait(windly);
            }
        } else {
            console.log('❌ 저장된 세션이 없습니다. 로그인이 필요합니다.');
            await openLoginAndWait(windly);
        }

    } catch (error) {
        console.error('\n❌ 테스트 실패:', error);
    } finally {
        // 10초 후 브라우저 닫기
        console.log('\n10초 후 브라우저가 닫힙니다...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        await windly.close();
        console.log('브라우저 종료됨.');
    }
}

async function openLoginAndWait(windly: WindlyAutomation) {
    console.log('\n3. 로그인 페이지를 엽니다...');
    await windly.openLoginPage();

    console.log('\n' + '='.repeat(50));
    console.log('📌 네이버 로그인을 완료해 주세요!');
    console.log('   (최대 5분 대기)');
    console.log('='.repeat(50));

    const loginSuccess = await windly.waitForLoginAndSave(300000);

    if (loginSuccess) {
        console.log('\n✅ 로그인 성공 및 세션 저장 완료!');
        await windly.takeScreenshot('windly-login-success.png');
        console.log('스크린샷 저장: windly-login-success.png');
    } else {
        console.log('\n❌ 로그인 시간 초과');
    }
}

// 실행
testWindlyConnection().catch(console.error);
