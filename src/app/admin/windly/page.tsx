// Admin - Windly Integration Page
// 관리자 - 윈들리 연동 페이지

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WindlyPage() {
    const [exporting, setExporting] = useState(false);
    const [exportResult, setExportResult] = useState<{ success: boolean; message: string } | null>(null);

    // CSV 내보내기
    const handleExportCSV = async () => {
        setExporting(true);
        setExportResult(null);

        try {
            // 먼저 상품 가져오기
            const productsRes = await fetch('/api/products');
            const productsData = await productsRes.json();

            if (!productsData.success || !productsData.data?.products) {
                throw new Error('상품을 가져올 수 없습니다.');
            }

            // CSV 생성 요청
            const response = await fetch('/api/export/csv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products: productsData.data.products }),
            });

            if (!response.ok) {
                throw new Error('CSV 생성 실패');
            }

            // 파일 다운로드
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `japanguru_products_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setExportResult({
                success: true,
                message: `${productsData.data.products.length}개 상품 CSV 다운로드 완료!`,
            });
        } catch (error) {
            setExportResult({
                success: false,
                message: error instanceof Error ? error.message : 'CSV 내보내기 실패',
            });
        } finally {
            setExporting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '40px 20px',
            color: 'white',
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* 헤더 */}
                <div style={{ marginBottom: '40px' }}>
                    <Link href="/" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '14px' }}>
                        ← 홈으로 돌아가기
                    </Link>
                    <h1 style={{
                        fontSize: '32px',
                        margin: '20px 0 10px',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        📦 윈들리 연동 관리
                    </h1>
                    <p style={{ color: '#888', fontSize: '14px' }}>
                        japanguru 상품을 윈들리를 통해 스마트스토어에 등록합니다.
                    </p>
                </div>

                {/* 연동 상태 */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '30px',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>✅</span>
                        <div>
                            <p style={{ fontWeight: '600', marginBottom: '4px' }}>윈들리 연동 활성화됨</p>
                            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '4px' }}>
                                로그인 방식: <code style={{ background: '#333', padding: '2px 8px', borderRadius: '4px' }}>네이버 연동</code>
                            </p>
                            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '4px' }}>
                                네이버 계정: <code style={{ background: '#333', padding: '2px 8px', borderRadius: '4px' }}>hunylee@naver.com</code>
                            </p>
                            <p style={{ fontSize: '14px', color: '#aaa' }}>
                                판매자 ID: <code style={{ background: '#333', padding: '2px 8px', borderRadius: '4px' }}>ncp_i6wuhd_01</code>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 작업 플로우 */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '30px',
                    marginBottom: '30px',
                }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>📋 상품 등록 순서</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Step 1 */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                flexShrink: 0,
                            }}>1</div>
                            <div>
                                <p style={{ fontWeight: '600', marginBottom: '8px' }}>CSV 파일 다운로드</p>
                                <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '12px' }}>
                                    아래 버튼을 클릭하여 상품 정보를 CSV로 내보냅니다.
                                </p>
                                <button
                                    onClick={handleExportCSV}
                                    disabled={exporting}
                                    style={{
                                        background: exporting ? '#333' : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: exporting ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {exporting ? '다운로드 중...' : '📥 CSV 다운로드'}
                                </button>
                                {exportResult && (
                                    <p style={{
                                        marginTop: '12px',
                                        fontSize: '14px',
                                        color: exportResult.success ? '#10b981' : '#ef4444',
                                    }}>
                                        {exportResult.success ? '✅' : '❌'} {exportResult.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                flexShrink: 0,
                            }}>2</div>
                            <div>
                                <p style={{ fontWeight: '600', marginBottom: '8px' }}>윈들리에서 대량 등록</p>
                                <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '12px' }}>
                                    윈들리에 접속하여 CSV 파일을 업로드합니다.
                                </p>
                                <a
                                    href="https://www.windly.cc"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-block',
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                        color: 'white',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                    }}
                                >
                                    🚀 윈들리 바로가기
                                </a>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                flexShrink: 0,
                            }}>3</div>
                            <div>
                                <p style={{ fontWeight: '600', marginBottom: '8px' }}>스마트스토어에서 확인</p>
                                <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '12px' }}>
                                    등록된 상품을 스마트스토어에서 확인합니다.
                                </p>
                                <a
                                    href="https://sell.smartstore.naver.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-block',
                                        background: 'linear-gradient(135deg, #03c75a 0%, #00a53c 100%)',
                                        color: 'white',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                    }}
                                >
                                    🏪 판매자센터 바로가기
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 빠른 링크 */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '30px',
                    marginBottom: '30px',
                }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>🔗 빠른 링크</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <a
                            href="https://smartstore.naver.com/japanguru"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: 'rgba(3, 199, 90, 0.1)',
                                border: '1px solid rgba(3, 199, 90, 0.3)',
                                padding: '16px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: 'white',
                            }}
                        >
                            <span style={{ fontSize: '24px' }}>🛍️</span>
                            <div>
                                <p style={{ fontWeight: '600' }}>스마트스토어</p>
                                <p style={{ fontSize: '12px', color: '#888' }}>japanguru</p>
                            </div>
                        </a>

                        <a
                            href="https://www.windly.cc"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: 'rgba(124, 58, 237, 0.1)',
                                border: '1px solid rgba(124, 58, 237, 0.3)',
                                padding: '16px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: 'white',
                            }}
                        >
                            <span style={{ fontSize: '24px' }}>📦</span>
                            <div>
                                <p style={{ fontWeight: '600' }}>윈들리</p>
                                <p style={{ fontSize: '12px', color: '#888' }}>상품/주문 관리</p>
                            </div>
                        </a>

                        <a
                            href="https://sell.smartstore.naver.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                padding: '16px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: 'white',
                            }}
                        >
                            <span style={{ fontSize: '24px' }}>⚙️</span>
                            <div>
                                <p style={{ fontWeight: '600' }}>판매자센터</p>
                                <p style={{ fontSize: '12px', color: '#888' }}>스토어 관리</p>
                            </div>
                        </a>

                        <Link
                            href="/admin/naver"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                padding: '16px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: 'white',
                            }}
                        >
                            <span style={{ fontSize: '24px' }}>🔌</span>
                            <div>
                                <p style={{ fontWeight: '600' }}>API 설정</p>
                                <p style={{ fontSize: '12px', color: '#888' }}>직접 연동 설정</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/products/new"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: 'rgba(168, 85, 247, 0.1)',
                                border: '1px solid rgba(168, 85, 247, 0.3)',
                                padding: '16px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: 'white',
                            }}
                        >
                            <span style={{ fontSize: '24px' }}>➕</span>
                            <div>
                                <p style={{ fontWeight: '600' }}>새 상품 추가</p>
                                <p style={{ fontSize: '12px', color: '#888' }}>상품 직접 등록</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* 도움말 */}
                <div style={{
                    background: 'rgba(251, 191, 36, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#fbbf24' }}>💡 알아두세요</h3>
                    <ul style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                        <li>현재 스마트스토어 상품/주문 API가 윈들리와 연동되어 있습니다.</li>
                        <li>상품 등록은 윈들리를 통해서만 가능합니다.</li>
                        <li>CSV 파일을 윈들리에 업로드하면 자동으로 스마트스토어에 등록됩니다.</li>
                        <li>주문 관리도 윈들리에서 처리할 수 있습니다.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
