// Product Card Component
// 상품 카드 컴포넌트

'use client';

import { Product } from '@/types';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
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

    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    const totalPrice = product.priceKrw + product.commission;

    return (
        <div className="product-card" onClick={() => onClick(product)}>
            <div className="product-badges">
                {badges}
            </div>
            <div className="product-image">
                <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                    alt={product.name}
                    loading="lazy"
                />
                <div className="quick-view">
                    <button className="quick-view-btn">상세 보기</button>
                </div>
            </div>
            <div className="product-info">
                <div className="product-brand">{product.brand}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-name-jp">{product.nameJp}</div>
                <div className="product-tags">
                    {product.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                    ))}
                </div>
                <div className="product-price">
                    <span className="price-krw">₩{totalPrice.toLocaleString()}</span>
                    <span className="price-jpy">¥{product.priceJpy.toLocaleString()}</span>
                </div>
                <div className="product-rating">
                    <span className="stars">{stars}</span>
                    <span className="rating-text">{product.rating} ({product.reviews}개 리뷰)</span>
                </div>
            </div>
        </div>
    );
}
