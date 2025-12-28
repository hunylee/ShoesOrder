// Admin - Naver Smart Store Settings Page
// 관리자 - 네이버 스마트스토어 설정 페이지

'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TestResult {
    success: boolean;
    message: string;
    timestamp?: string;
}

interface SyncResult {
    success: boolean;
    message?: string;
    data?: {
        synced: number;
        failed: number;
        errors: string[];
    };
}

export default function NaverSettingsPage() {
    const [testResult, setTestResult] = useState<TestResult | null>(null);
    const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);

    // API 연결 테스트
    const handleTestConnection = async () => {
        setLoading(true);
        setTestResult(null);

        try {
            const res = await fetch('/api/naver/test');
            const data = await res.json();
            setTestResult(data);
        } catch (error) {
            setTestResult({
                success: false,
                message: `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
            });
        } finally {
            setLoading(false);
        }
    };

    // 상품 동기화
    const handleSyncProducts = async () => {
        setSyncLoading(true);
        setSyncResult(null);

        try {
            // 먼저 현재 상품 목록 가져오기
            const productsRes = await fetch('/api/products');
            const productsData = await productsRes.json();

            if (!productsData.success || !productsData.data?.products) {
                throw new Error('상품 목록을 가져올 수 없습니다.');
            }

            // 스마트스토어에 동기화
            const syncRes = await fetch('/api/naver/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    products: productsData.data.products,
                    syncAll: true,
                }),
            });

            const syncData = await syncRes.json();
            setSyncResult(syncData);
        } catch (error) {
            setSyncResult({
                success: false,
                message: `동기화 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
            });
        } finally {
            setSyncLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '40px 20px',
            color: 'white',
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* 헤더 */}
                <div style={{ marginBottom: '40px' }}>
                    <Link href="/" style={{ color: '#03c75a', textDecoration: 'none', fontSize: '14px' }}>
                        ← 홈으로 돌아가기
                    </Link>
                    <h1 style={{
                        fontSize: '32px',
                        margin: '20px 0 10px',
                        background: 'linear-gradient(135deg, #03c75a 0%, #00a53c 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        🛒 네이버 스마트스토어 연동
                    </h1>
                    <p style={{ color: '#888', fontSize: '14px' }}>
                        japanguru 스마트스토어 API 설정 및 상품 동기화
                    </p>
                </div>

                {/* 설정 안내 */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '30px',
                    marginBottom: '30px',
                }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>📋 API 설정 방법</h2>

                    <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#ccc' }}>
                        <p><strong>1단계:</strong> 네이버 커머스 API 센터 접속</p>
                        <a
                            href="https://apicenter.commerce.naver.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#03c75a' }}
                        >
                            → apicenter.commerce.naver.com
                        </a>

                        <p style={{ marginTop: '16px' }}><strong>2단계:</strong> 애플리케이션 등록 후 Client ID와 Secret 발급</p>

                        <p style={{ marginTop: '16px' }}><strong>3단계:</strong> 프로젝트 루트에 <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>.env.local</code> 파일 생성:</p>

                        <pre style={{
                            background: '#0d1117',
                            padding: '16px',
                            borderRadius: '8px',
                            marginTop: '10px',
                            overflow: 'auto',
                        }}>
                            {`NAVER_CLIENT_ID=발급받은_클라이언트_ID
NAVER_CLIENT_SECRET=발급받은_시크릿_키
NAVER_SELLER_ID=japanguru`}
                        </pre>

                        <p style={{ marginTop: '16px' }}><strong>4단계:</strong> 서버 재시작 후 아래 버튼으로 연결 테스트</p>
                    </div>
                </div>

                {/* 연결 테스트 */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '30px',
                    marginBottom: '30px',
                }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>🔌 API 연결 테스트</h2>

                    <button
                        onClick={handleTestConnection}
                        disabled={loading}
                        style={{
                            background: loading ? '#333' : 'linear-gradient(135deg, #03c75a 0%, #00a53c 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '14px 28px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.2s, opacity 0.2s',
                        }}
                    >
                        {loading ? '테스트 중...' : '연결 테스트'}
                    </button>

                    {testResult && (
                        <div style={{
                            marginTop: '20px',
                            padding: '16px',
                            borderRadius: '8px',
                            background: testResult.success ? 'rgba(3,199,90,0.1)' : 'rgba(255,87,87,0.1)',
                            border: `1px solid ${testResult.success ? '#03c75a' : '#ff5757'}`,
                        }}>
                            <p style={{
                                color: testResult.success ? '#03c75a' : '#ff5757',
                                fontWeight: '600',
                                marginBottom: '8px',
                            }}>
                                {testResult.success ? '✅ 연결 성공' : '❌ 연결 실패'}
                            </p>
                            <p style={{ color: '#ccc', fontSize: '14px' }}>{testResult.message}</p>
                        </div>
                    )}
                </div>

                {/* 상품 동기화 */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '30px',
                    marginBottom: '30px',
                }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>📦 상품 동기화</h2>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                        현재 등록된 상품을 네이버 스마트스토어에 자동 등록합니다.
                    </p>

                    <button
                        onClick={handleSyncProducts}
                        disabled={syncLoading}
                        style={{
                            background: syncLoading ? '#333' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '14px 28px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: syncLoading ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.2s, opacity 0.2s',
                        }}
                    >
                        {syncLoading ? '동기화 중...' : '전체 상품 동기화'}
                    </button>

                    {syncResult && (
                        <div style={{
                            marginTop: '20px',
                            padding: '16px',
                            borderRadius: '8px',
                            background: syncResult.success ? 'rgba(3,199,90,0.1)' : 'rgba(255,87,87,0.1)',
                            border: `1px solid ${syncResult.success ? '#03c75a' : '#ff5757'}`,
                        }}>
                            <p style={{
                                color: syncResult.success ? '#03c75a' : '#ff5757',
                                fontWeight: '600',
                                marginBottom: '8px',
                            }}>
                                {syncResult.success ? '✅ 동기화 완료' : '⚠️ 동기화 결과'}
                            </p>
                            {syncResult.data && (
                                <div style={{ color: '#ccc', fontSize: '14px' }}>
                                    <p>✓ 성공: {syncResult.data.synced}개</p>
                                    <p>✗ 실패: {syncResult.data.failed}개</p>
                                    {syncResult.data.errors.length > 0 && (
                                        <details style={{ marginTop: '10px' }}>
                                            <summary style={{ cursor: 'pointer' }}>오류 상세</summary>
                                            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                                                {syncResult.data.errors.map((err, idx) => (
                                                    <li key={idx}>{err}</li>
                                                ))}
                                            </ul>
                                        </details>
                                    )}
                                </div>
                            )}
                            {syncResult.message && !syncResult.data && (
                                <p style={{ color: '#ccc', fontSize: '14px' }}>{syncResult.message}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* 스마트스토어 바로가기 */}
                <div style={{
                    background: 'linear-gradient(135deg, #03c75a 0%, #00a53c 100%)',
                    borderRadius: '16px',
                    padding: '30px',
                    textAlign: 'center',
                }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>🏪 스마트스토어 바로가기</h2>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                            href="https://smartstore.naver.com/japanguru"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: 'white',
                                color: '#03c75a',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600',
                            }}
                        >
                            고객용 스토어
                        </a>
                        <a
                            href="https://sell.smartstore.naver.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600',
                            }}
                        >
                            판매자 센터
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
