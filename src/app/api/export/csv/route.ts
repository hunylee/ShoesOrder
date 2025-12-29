// CSV Export API for Windly
// 윈들리용 CSV 내보내기 API

import { NextResponse } from 'next/server';
import { Product } from '@/types';

// CSV 설정 옵션
interface CSVOptions {
    deliveryFeeType: 'FREE' | 'PAID' | 'CONDITIONAL_FREE';
    deliveryFee: number;
    conditionalFreeAmount: number;
    returnShippingFee: number;
    origin: string;
    asPhone: string;
    asGuide: string;
}

const DEFAULT_OPTIONS: CSVOptions = {
    deliveryFeeType: 'CONDITIONAL_FREE',
    deliveryFee: 3000,
    conditionalFreeAmount: 50000,
    returnShippingFee: 5000,
    origin: '일본',
    asPhone: '02-1234-5678',
    asGuide: '상품 수령 후 7일 이내 교환/반품 가능합니다. 해외 구매대행 상품 특성상 단순 변심에 의한 교환/반품 시 왕복 배송비가 발생합니다.',
};

// 윈들리 CSV 형식으로 상품 변환
function convertToWindlyCSV(products: Product[], options: CSVOptions = DEFAULT_OPTIONS): string {
    // 윈들리 CSV 헤더 (스마트스토어 대량등록 양식 기준 - 확장)
    const headers = [
        '상품명',
        '판매가',
        '재고수량',
        '카테고리',
        '브랜드',
        '상품상태',
        '배송비유형',
        '배송비',
        '조건부무료금액',
        '반품배송비',
        '원산지',
        'AS전화번호',
        'AS안내',
        '상세설명',
        '대표이미지URL',
        '옵션1명',
        '옵션1값',
        '옵션2명',
        '옵션2값',
        '태그',
    ];

    const rows = products.map(product => {
        const totalPrice = product.priceKrw + product.commission;
        const sizes = product.sizes.join('/');
        const colors = product.colors.join('/');
        const tags = product.tags.join(',');

        // 발볼 타입 표시
        const widthLabel = product.widthType === '4E' ? '[4E 초광폭] ' :
            product.widthType === 'SW' ? '[슈퍼와이드] ' :
                product.widthType === '2E' ? '[2E 와이드] ' : '';

        // 한정판/일본한정 표시
        const limitedLabel = product.isLimitedEdition ? '[한정판] ' : '';
        const japanLabel = product.japanExclusive ? '[일본한정] ' : '';

        const productName = `${limitedLabel}${japanLabel}${widthLabel}[${product.brand}] ${product.name}`;

        // 카테고리 매핑
        const category = product.category === 'stability' ? '안정성 러닝화' :
            product.category === 'neutral' ? '뉴트럴 러닝화' :
                product.category === 'racing' ? '레이싱 슈즈' : '러닝화';

        // 배송비 유형 매핑
        const deliveryFeeTypeLabel = options.deliveryFeeType === 'FREE' ? '무료' :
            options.deliveryFeeType === 'CONDITIONAL_FREE' ? '조건부무료' : '유료';

        return [
            productName,
            totalPrice,
            10, // 기본 재고
            category,
            product.brand,
            '신상품',
            deliveryFeeTypeLabel,
            options.deliveryFee,
            options.conditionalFreeAmount,
            options.returnShippingFee,
            options.origin,
            options.asPhone,
            options.asGuide,
            generateDescription(product),
            product.imageUrl || '',
            '사이즈',
            sizes,
            '컬러',
            colors,
            tags,
        ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
}

// 상품 설명 생성
function generateDescription(product: Product): string {
    const widthLabel = product.widthType === '4E' ? '초광폭 4E' :
        product.widthType === 'SW' ? '슈퍼와이드' :
            product.widthType === '2E' ? '와이드 2E' : '표준';

    let description = `[${product.brand}] ${product.name}\n\n`;
    description += `◆ 일본어명: ${product.nameJp}\n`;
    description += `◆ 카테고리: ${product.category === 'stability' ? '안정성' : product.category === 'neutral' ? '뉴트럴' : '레이싱'}\n`;
    description += `◆ 발볼: ${widthLabel}\n`;
    description += `◆ 사이즈: ${product.sizes.join(', ')}\n`;
    description += `◆ 컬러: ${product.colors.join(', ')}\n\n`;
    description += `${product.description}\n\n`;

    if (product.isLimitedEdition) {
        description += `🔥 한정판 상품입니다.\n`;
    }
    if (product.japanExclusive) {
        description += `🇯🇵 일본 한정 상품입니다.\n`;
    }
    if (product.isWideWidth) {
        description += `👟 발볼이 넓은 분들을 위한 와이드 버전입니다.\n`;
    }

    description += `\n#${product.tags.join(' #')}`;

    return description;
}

export async function POST(request: Request) {
    try {
        const { products } = await request.json() as { products: Product[] };

        if (!products || products.length === 0) {
            return NextResponse.json({
                success: false,
                error: '내보낼 상품이 없습니다.',
            }, { status: 400 });
        }

        const csv = convertToWindlyCSV(products);

        // CSV 파일로 응답
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="japanguru_products_${Date.now()}.csv"`,
            },
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'CSV 생성 실패',
        }, { status: 500 });
    }
}

// GET: 전체 상품 CSV 다운로드
export async function GET() {
    try {
        // 기본 상품 데이터 (실제로는 DB에서 가져와야 함)
        const productsRes = await fetch('http://localhost:3000/api/products');
        const productsData = await productsRes.json();

        if (!productsData.success || !productsData.data?.products) {
            return NextResponse.json({
                success: false,
                error: '상품을 가져올 수 없습니다.',
            }, { status: 500 });
        }

        const csv = convertToWindlyCSV(productsData.data.products);

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="japanguru_products_${Date.now()}.csv"`,
            },
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'CSV 생성 실패',
        }, { status: 500 });
    }
}
