// Product Modal Component
// 상품 상세 모달 컴포넌트

'use client';

import { useState } from 'react';
import { Product } from '@/types';

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product, size: string) => void;
}

export default function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    if (!product) return null;

    const badges: JSX.Element[] = [];
    if (product.isLimitedEdition) {
        badges.push(<span key="limited" className="badge badge-limited">한정판</span>);
    }
    if (product.isWideWidth) {
        badges.push(<span key="wide" className="badge badge-wide">발볼넓은</span>);
    }
    if (product.japanExclusive) {
        badges.push(<span key="japan" className="badge badge-japan">🇯🇵 일본한정</span>);
    }

    const totalPrice = product.priceKrw + product.commission;

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('사이즈를 선택해주세요.');
            return;
        }
        onAddToCart(product, selectedSize);
        setSelectedSize(null);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
            setSelectedSize(null);
        }
    };

    return (
        <div
            className={`modal-overlay ${isOpen ? 'active' : ''}`}
            onClick={handleOverlayClick}
        >
            <div className="modal">
                <div className="modal-header">
                    <h3>상품 상세</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="modal-image">
                        <img
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                            alt={product.name}
                        />
                    </div>
                    <div className="modal-details">
                        <div className="product-badges" style={{ position: 'static', flexDirection: 'row', marginBottom: '16px', display: 'flex', gap: '8px' }}>
                            {badges}
                        </div>
                        <div className="product-brand">{product.brand} / {product.brandKr}</div>
                        <h2>{product.name}</h2>
                        <div className="product-name-jp">{product.nameJp}</div>
                        <p className="modal-description">{product.description}</p>

                        <div className="size-selector">
                            <label>사이즈 선택 (cm)</label>
                            <div className="size-options">
                                {product.sizes.map((size) => (
                                    <div
                                        key={size}
                                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="price-display">
                            <div className="price-row">
                                <span>일본 정가</span>
                                <span>¥{product.priceJpy.toLocaleString()}</span>
                            </div>
                            <div className="price-row">
                                <span>한국 환산가</span>
                                <span>₩{product.priceKrw.toLocaleString()}</span>
                            </div>
                            <div className="price-row">
                                <span>구매대행 수수료</span>
                                <span>₩{product.commission.toLocaleString()}</span>
                            </div>
                            <div className="price-row total">
                                <span>총 예상가</span>
                                <span>₩{totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="btn btn-secondary" onClick={handleAddToCart}>
                                🛒 장바구니 담기
                            </button>
                            <button className="btn btn-primary" onClick={() => alert('주문 기능은 준비 중입니다.')}>
                                ⚡ 바로 주문하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
