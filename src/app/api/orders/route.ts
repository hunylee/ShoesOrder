// Orders API Route
// 주문 API 라우트

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/orders - 주문 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const where = status ? { status } : {};
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            }),
            prisma.order.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                orders,
                total,
                page,
                limit,
            },
        });
    } catch (error) {
        console.error('Orders API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST /api/orders - 주문 생성
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items, customerName, customerEmail, customerPhone, shippingAddress, notes } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Items are required' },
                { status: 400 }
            );
        }

        // 총 가격 계산
        let totalPrice = 0;
        for (const item of items) {
            totalPrice += (item.priceKrw + item.commission) * item.quantity;
        }

        // 주문 생성
        const order = await prisma.order.create({
            data: {
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                totalPrice,
                notes,
                items: {
                    create: items.map((item: { productId: string; size: string; color?: string; quantity: number; priceKrw: number; commission: number }) => ({
                        productId: item.productId,
                        size: item.size,
                        color: item.color,
                        quantity: item.quantity,
                        priceKrw: item.priceKrw,
                        commission: item.commission,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order created successfully',
        });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
