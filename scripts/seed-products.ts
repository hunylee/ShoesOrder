// 샘플 상품 추가 스크립트
// Sample Product Seeder for SmartStore Upload
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleProducts = [
    {
        brand: 'ASICS',
        brandKr: '아식스',
        name: 'GT-2000 12',
        nameJp: 'GT-2000 12',
        description: '안정성과 쿠션을 겸비한 러닝화. 발볼이 넓은 분들에게 적합한 와이드 버전입니다.',
        priceJpy: 16500,
        priceKrw: 148500,
        commission: 15000,
        isLimitedEdition: false,
        isWideWidth: true,
        sizes: ['25.0', '25.5', '26.0', '26.5', '27.0', '27.5', '28.0'],
        colors: ['Black/White', 'Blue/Yellow'],
        japanExclusive: false,
        category: 'stability',
        rating: 4.5,
        reviews: 128,
        imageUrl: 'https://example.com/gt2000-12.jpg',
        tags: ['러닝화', '안정성', '와이드', '아식스'],
        sourceUrl: 'https://www.rakuten.co.jp/example',
        sourcePlatform: 'rakuten',
    },
    {
        brand: 'MIZUNO',
        brandKr: '미즈노',
        name: 'Wave Rider 27',
        nameJp: 'ウェーブライダー27',
        description: '가볍고 쿠션감이 뛰어난 뉴트럴 러닝화. 일본 한정 컬러입니다.',
        priceJpy: 15400,
        priceKrw: 138600,
        commission: 15000,
        isLimitedEdition: false,
        isWideWidth: false,
        sizes: ['25.0', '25.5', '26.0', '26.5', '27.0', '27.5', '28.0', '28.5'],
        colors: ['Japan Blue', 'Neo Lime'],
        japanExclusive: true,
        category: 'neutral',
        rating: 4.7,
        reviews: 256,
        imageUrl: 'https://example.com/wave-rider-27.jpg',
        tags: ['러닝화', '뉴트럴', '미즈노', '일본한정'],
        sourceUrl: 'https://www.rakuten.co.jp/example2',
        sourcePlatform: 'rakuten',
    },
    {
        brand: 'New Balance',
        brandKr: '뉴발란스',
        name: 'Fresh Foam X 1080 v13',
        nameJp: 'フレッシュフォーム X 1080 v13',
        description: '최상의 쿠션감을 제공하는 프리미엄 러닝화. 4E 초광폭 버전으로 발볼이 매우 넓은 분들에게 추천합니다.',
        priceJpy: 18700,
        priceKrw: 168300,
        commission: 15000,
        isLimitedEdition: true,
        isWideWidth: true,
        sizes: ['25.5', '26.0', '26.5', '27.0', '27.5', '28.0', '28.5', '29.0'],
        colors: ['Limited Edition Gray', 'Premium Black'],
        japanExclusive: true,
        category: 'neutral',
        rating: 4.9,
        reviews: 89,
        imageUrl: 'https://example.com/1080v13.jpg',
        tags: ['러닝화', '프리미엄', '4E', '초광폭', '한정판', '뉴발란스'],
        sourceUrl: 'https://www.rakuten.co.jp/example3',
        sourcePlatform: 'rakuten',
    },
];

async function main() {
    console.log('='.repeat(60));
    console.log('📦 샘플 상품 추가');
    console.log('='.repeat(60));
    console.log('');

    try {
        console.log('데이터베이스 연결 중...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 60) + '...');

        // 기존 상품 개수 확인
        const existingCount = await prisma.product.count();
        console.log(`기존 상품 수: ${existingCount}`);

        if (existingCount > 0) {
            console.log('이미 상품이 있습니다. 추가하지 않습니다.');
        } else {
            // 샘플 상품 추가
            console.log('\n샘플 상품 추가 중...');
            for (const product of sampleProducts) {
                const created = await prisma.product.create({
                    data: product,
                });
                console.log(`  ✅ 추가됨: ${created.brand} ${created.name}`);
            }
            console.log(`\n총 ${sampleProducts.length}개 상품이 추가되었습니다.`);
        }

        // 최종 상품 개수 확인
        const finalCount = await prisma.product.count();
        console.log(`\n현재 상품 수: ${finalCount}`);

    } catch (error) {
        console.error('오류 발생:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
