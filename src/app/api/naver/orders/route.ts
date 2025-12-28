// Naver Smart Store API - Orders
// 네이버 스마트스토어 주문 관리 API

import { NextRequest, NextResponse } from 'next/server';
import { getNaverApi } from '@/lib/naver';

// GET: 주문 목록 조회
export async function GET() {
    try {
        const api = getNaverApi();
        const orders = await api.getNewOrders();

        return NextResponse.json({
            success: true,
            data: orders,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : '주문 조회 실패',
        }, { status: 500 });
    }
}

// POST: 주문 상태 변경 (발주확인, 발송처리)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, productOrderId, deliveryInfo } = body;

        const api = getNaverApi();

        switch (action) {
            case 'confirm':
                // 발주 확인
                await api.confirmOrder(productOrderId);
                return NextResponse.json({
                    success: true,
                    message: '발주 확인 완료',
                });

            case 'ship':
                // 발송 처리
                if (!deliveryInfo) {
                    return NextResponse.json({
                        success: false,
                        error: '배송 정보가 필요합니다.',
                    }, { status: 400 });
                }
                await api.shipOrder(productOrderId, deliveryInfo);
                return NextResponse.json({
                    success: true,
                    message: '발송 처리 완료',
                });

            default:
                return NextResponse.json({
                    success: false,
                    error: '지원하지 않는 액션입니다.',
                }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : '주문 처리 실패',
        }, { status: 500 });
    }
}
