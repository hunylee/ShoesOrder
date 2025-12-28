// Naver Smart Store API - Test Connection
// 네이버 스마트스토어 API 연결 테스트

import { NextResponse } from 'next/server';
import { getNaverApi } from '@/lib/naver';

export async function GET() {
    try {
        const api = getNaverApi();
        const result = await api.testConnection();

        return NextResponse.json({
            success: result.success,
            message: result.message,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : '알 수 없는 오류',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
