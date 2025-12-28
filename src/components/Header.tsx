// Header Component
// 헤더 컴포넌트

'use client';

import { useState } from 'react';

interface HeaderProps {
    cartCount: number;
    onSearch: (query: string) => void;
    onCartClick: () => void;
}

export default function Header({ cartCount, onSearch, onCartClick }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    return (
        <header className="header">
            <div className="container header-content">
                <a href="/" className="logo">
                    <span className="logo-icon">🏃</span>
                    <div>
                        <div className="logo-text">japanguru</div>
                        <div className="logo-sub">일본 러닝화 구매대행</div>
                    </div>
                </a>

                <div className="search-bar">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="브랜드, 상품명, 태그로 검색..."
                    />
                    <button type="button">🔍</button>
                </div>

                <div className="header-actions">
                    <button className="cart-btn" onClick={onCartClick}>
                        🛒 장바구니
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
