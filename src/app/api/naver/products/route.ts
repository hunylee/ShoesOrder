// Naver Smart Store API - Product Sync
// 네이버 스마트스토어 상품 동기화 API

import { NextRequest, NextResponse } from 'next/server';
import { getNaverApi, syncProduct, syncAllProducts } from '@/lib/naver';
import { Product } from '@/types';

// GET: 스마트스토어 상품 목록 조회
export async function GET(request: NextRequest) {
    try {
        const api = getNaverApi();
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const size = parseInt(searchParams.get('size') || '100');

        const products = await api.getProducts(page, size);

        return NextResponse.json({
            success: true,
            data: products,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : '상품 조회 실패',
        }, { status: 500 });
    }
}

// POST: 상품 동기화 (단일 또는 전체)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { products, syncAll } = body as { products?: Product[]; syncAll?: boolean };

        if (!products || products.length === 0) {
            return NextResponse.json({
                success: false,
                error: '동기화할 상품이 없습니다.',
            }, { status: 400 });
        }

        if (syncAll) {
            // 전체 동기화
            const result = await syncAllProducts(products);
            return NextResponse.json({
                success: result.success,
                data: {
                    synced: result.synced,
                    failed: result.failed,
                    errors: result.errors,
                },
                message: `${result.synced}개 상품 동기화 완료, ${result.failed}개 실패`,
            });
        } else {
            // 단일 상품 동기화
            const product = products[0];
            const result = await syncProduct(product);
            return NextResponse.json({
                success: result.success,
                error: result.error,
                message: result.success ? '상품 동기화 완료' : result.error,
            });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : '동기화 실패',
        }, { status: 500 });
    }
}
