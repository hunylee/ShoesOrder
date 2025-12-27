// Products API Route
// 상품 API 라우트

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ProductFilters, ApiResponse, Product } from '@/types';

// GET /api/products - 상품 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // 필터 파라미터 추출
        const filters: ProductFilters = {
            brand: searchParams.get('brand') || undefined,
            category: searchParams.get('category') || undefined,
            isLimitedEdition: searchParams.get('isLimitedEdition') === 'true',
            isWideWidth: searchParams.get('isWideWidth') === 'true',
            searchQuery: searchParams.get('q') || undefined,
            minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
            maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
            page: parseInt(searchParams.get('page') || '1'),
            limit: parseInt(searchParams.get('limit') || '20'),
        };

        // Prisma 쿼리 조건 구성
        const where: Record<string, unknown> = {};

        if (filters.brand && filters.brand !== 'all') {
            where.brand = filters.brand;
        }

        if (filters.category && filters.category !== 'all') {
            where.category = filters.category;
        }

        if (filters.isLimitedEdition) {
            where.isLimitedEdition = true;
        }

        if (filters.isWideWidth) {
            where.isWideWidth = true;
        }

        if (filters.searchQuery) {
            where.OR = [
                { name: { contains: filters.searchQuery, mode: 'insensitive' } },
                { nameJp: { contains: filters.searchQuery } },
                { brand: { contains: filters.searchQuery, mode: 'insensitive' } },
                { brandKr: { contains: filters.searchQuery } },
                { tags: { hasSome: [filters.searchQuery] } },
            ];
        }

        if (filters.minPrice) {
            where.priceKrw = { gte: filters.minPrice };
        }

        if (filters.maxPrice) {
            where.priceKrw = { ...where.priceKrw as object, lte: filters.maxPrice };
        }

        // 페이지네이션
        const skip = ((filters.page || 1) - 1) * (filters.limit || 20);
        const take = filters.limit || 20;

        // 쿼리 실행
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.product.count({ where }),
        ]);

        const response: ApiResponse<{ products: Product[]; total: number; page: number; limit: number }> = {
            success: true,
            data: {
                products: products as unknown as Product[],
                total,
                page: filters.page || 1,
                limit: filters.limit || 20,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Products API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST /api/products - 상품 추가
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const product = await prisma.product.create({
            data: {
                brand: body.brand,
                brandKr: body.brandKr,
                name: body.name,
                nameJp: body.nameJp,
                description: body.description || '',
                priceJpy: body.priceJpy,
                priceKrw: body.priceKrw || Math.round(body.priceJpy * 9), // 기본 환율 적용
                commission: body.commission || 15000,
                isLimitedEdition: body.isLimitedEdition || false,
                isWideWidth: body.isWideWidth || false,
                sizes: body.sizes || [],
                colors: body.colors || [],
                japanExclusive: body.japanExclusive || false,
                category: body.category || 'neutral',
                rating: body.rating || 0,
                reviews: body.reviews || 0,
                imageUrl: body.imageUrl,
                tags: body.tags || [],
                sourceUrl: body.sourceUrl,
                sourcePlatform: body.sourcePlatform,
            },
        });

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product created successfully',
        });
    } catch (error) {
        console.error('Product creation error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
