// Crawl API Route
// 크롤링 API 라우트

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { unifiedCrawler } from '@/lib/crawler';

// POST /api/crawl - 크롤링 실행
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { keyword, platforms } = body;

        if (!keyword) {
            return NextResponse.json(
                { success: false, error: 'Keyword is required' },
                { status: 400 }
            );
        }

        const startTime = Date.now();
        let totalItems = 0;
        const results: { platform: string; count: number }[] = [];

        // 특정 플랫폼만 크롤링하거나 전체 크롤링
        if (platforms && Array.isArray(platforms)) {
            for (const platform of platforms) {
                const result = await unifiedCrawler.crawlPlatform(platform, keyword);
                results.push({ platform, count: result.products.length });
                totalItems += result.products.length;

                // 크롤링된 상품을 데이터베이스에 저장
                for (const product of result.products) {
                    await prisma.product.upsert({
                        where: {
                            // sourceUrl을 유니크 키로 사용하여 중복 방지
                            id: product.sourceUrl ? Buffer.from(product.sourceUrl).toString('base64').slice(0, 25) : `temp-${Date.now()}`,
                        },
                        update: {
                            priceJpy: product.priceJpy,
                            priceKrw: Math.round(product.priceJpy * 9),
                            imageUrl: product.imageUrl,
                            updatedAt: new Date(),
                        },
                        create: {
                            brand: product.brand || 'Unknown',
                            brandKr: product.brand || '미확인',
                            name: product.name,
                            nameJp: product.nameJp,
                            description: product.description || '',
                            priceJpy: product.priceJpy,
                            priceKrw: Math.round(product.priceJpy * 9),
                            commission: 15000,
                            category: 'neutral',
                            imageUrl: product.imageUrl,
                            sourceUrl: product.sourceUrl,
                            sourcePlatform: product.platform,
                            sizes: product.sizes || [],
                            colors: product.colors || [],
                            tags: [],
                        },
                    });
                }

                // 크롤링 로그 저장
                await prisma.crawlLog.create({
                    data: {
                        platform,
                        keyword,
                        status: 'success',
                        itemsFound: result.products.length,
                        duration: Date.now() - startTime,
                    },
                });
            }
        } else {
            // 전체 플랫폼 크롤링
            const allResults = await unifiedCrawler.crawlAll(keyword);

            for (const result of allResults) {
                results.push({ platform: result.platform, count: result.products.length });
                totalItems += result.products.length;

                for (const product of result.products) {
                    try {
                        await prisma.product.create({
                            data: {
                                brand: product.brand || 'Unknown',
                                brandKr: product.brand || '미확인',
                                name: product.name,
                                nameJp: product.nameJp,
                                description: product.description || '',
                                priceJpy: product.priceJpy,
                                priceKrw: Math.round(product.priceJpy * 9),
                                commission: 15000,
                                category: 'neutral',
                                imageUrl: product.imageUrl,
                                sourceUrl: product.sourceUrl,
                                sourcePlatform: product.platform,
                                sizes: product.sizes || [],
                                colors: product.colors || [],
                                tags: [],
                            },
                        });
                    } catch (e) {
                        // 중복 상품 무시
                        console.log('Duplicate product skipped:', product.name);
                    }
                }

                await prisma.crawlLog.create({
                    data: {
                        platform: result.platform,
                        keyword,
                        status: 'success',
                        itemsFound: result.products.length,
                        duration: Date.now() - startTime,
                    },
                });
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                keyword,
                totalItems,
                results,
                duration: Date.now() - startTime,
            },
            message: `Crawled ${totalItems} items successfully`,
        });
    } catch (error) {
        console.error('Crawl API error:', error);

        // 에러 로그 저장
        await prisma.crawlLog.create({
            data: {
                platform: 'all',
                status: 'failed',
                errorMsg: error instanceof Error ? error.message : 'Unknown error',
            },
        });

        return NextResponse.json(
            { success: false, error: 'Crawling failed' },
            { status: 500 }
        );
    }
}

// GET /api/crawl - 크롤링 로그 조회
export async function GET() {
    try {
        const logs = await prisma.crawlLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return NextResponse.json({
            success: true,
            data: logs,
        });
    } catch (error) {
        console.error('Crawl log error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch crawl logs' },
            { status: 500 }
        );
    }
}
