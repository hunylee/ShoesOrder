// Admin - New Product Page
// 관리자 - 새 상품 등록 페이지

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import { Product } from '@/types';

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (data: Partial<Product>) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || '상품 등록 실패');
            }

            setSuccess(true);

            // 3초 후 윈들리 페이지로 이동
            setTimeout(() => {
                router.push('/admin/windly');
            }, 3000);

        } catch (err) {
            setError(err instanceof Error ? err.message : '상품 등록 중 오류 발생');
        } finally {
            setIsLoading(false);
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
                    <Link href="/admin/windly" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '14px' }}>
                        ← 윈들리 연동으로 돌아가기
                    </Link>
                    <h1 style={{
                        fontSize: '32px',
                        margin: '20px 0 10px',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        ➕ 새 상품 등록
                    </h1>
                    <p style={{ color: '#888', fontSize: '14px' }}>
                        새로운 일본 러닝화를 등록합니다. 등록 후 윈들리를 통해 스마트스토어에 등록할 수 있습니다.
                    </p>
                </div>

                {/* 성공 메시지 */}
                {success && (
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '30px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '24px' }}>✅</span>
                            <div>
                                <p style={{ fontWeight: '600', marginBottom: '4px' }}>상품이 등록되었습니다!</p>
                                <p style={{ fontSize: '14px', color: '#aaa' }}>
                                    잠시 후 윈들리 연동 페이지로 이동합니다...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 에러 메시지 */}
                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '30px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '24px' }}>❌</span>
                            <div>
                                <p style={{ fontWeight: '600', marginBottom: '4px' }}>등록 실패</p>
                                <p style={{ fontSize: '14px', color: '#aaa' }}>{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 폼 */}
                {!success && (
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        padding: '30px',
                    }}>
                        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
                    </div>
                )}

                {/* 도움말 */}
                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginTop: '30px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                }}>
                    <h3 style={{ fontSize: '14px', marginBottom: '12px', color: '#60a5fa' }}>💡 입력 팁</h3>
                    <ul style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                        <li>일본 가격(¥)을 입력하면 한국 환산가가 자동으로 계산됩니다 (1¥ ≈ 9₩)</li>
                        <li>사이즈는 여러 개를 선택할 수 있습니다. 클릭하여 선택/해제하세요.</li>
                        <li>색상과 태그는 입력 후 Enter 또는 추가 버튼을 클릭하세요.</li>
                        <li>발볼 타입이 와이드 계열이면 자동으로 &quot;발볼넓은&quot; 태그가 추가됩니다.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
