// Filter Bar Component
// 필터 바 컴포넌트

'use client';

import { WidthType } from '@/types';

interface FilterBarProps {
    activeBrand: string;
    activeCategory: string;
    isLimitedActive: boolean;
    isWideActive: boolean;
    activeWidthType: WidthType | 'all';
    onBrandChange: (brand: string) => void;
    onCategoryChange: (category: string) => void;
    onLimitedToggle: () => void;
    onWideToggle: () => void;
    onWidthTypeChange: (widthType: WidthType | 'all') => void;
}

const brands = [
    { id: 'all', name: '전체', icon: '🏷️' },
    { id: 'ASICS', name: '아식스', icon: '⚡' },
    { id: 'New Balance', name: '뉴발란스', icon: '🎯' },
    { id: 'Mizuno', name: '미즈노', icon: '🌊' },
    { id: 'Saucony', name: '써코니', icon: '💨' },
];

const categories = [
    { id: 'all', name: '전체', icon: '🏃' },
    { id: 'stability', name: '안정성', icon: '⚡' },
    { id: 'neutral', name: '뉴트럴', icon: '🎯' },
    { id: 'racing', name: '레이싱', icon: '🏆' },
];

const widthTypes = [
    { id: 'all', name: '전체 발볼', icon: '👟' },
    { id: '2E', name: '2E (와이드)', icon: '📐' },
    { id: '4E', name: '4E (초광폭)', icon: '📏' },
    { id: 'SW', name: '슈퍼와이드', icon: '🦶' },
];

export default function FilterBar({
    activeBrand,
    activeCategory,
    isLimitedActive,
    isWideActive,
    activeWidthType,
    onBrandChange,
    onCategoryChange,
    onLimitedToggle,
    onWideToggle,
    onWidthTypeChange,
}: FilterBarProps) {
    return (
        <section className="filters-section">
            <div className="container">
                <div className="filter-row">
                    {/* Brand Filters */}
                    <div className="filter-group">
                        {brands.map((brand) => (
                            <button
                                key={brand.id}
                                className={`filter-btn brand-filter ${activeBrand === brand.id ? 'active' : ''}`}
                                onClick={() => onBrandChange(brand.id)}
                            >
                                <span className="icon">{brand.icon}</span> {brand.name}
                            </button>
                        ))}
                    </div>

                    {/* Special Filters */}
                    <div className="filter-group">
                        <button
                            className={`filter-btn limited ${isLimitedActive ? 'active' : ''}`}
                            onClick={onLimitedToggle}
                        >
                            <span className="icon">🔥</span> 한정판
                        </button>
                        <button
                            className={`filter-btn wide ${isWideActive ? 'active' : ''}`}
                            onClick={onWideToggle}
                        >
                            <span className="icon">👟</span> 발볼 넓은
                        </button>
                    </div>
                </div>

                {/* Category Filters */}
                <div className="filter-row" style={{ marginTop: '16px' }}>
                    <div className="filter-group">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className={`filter-btn category-filter ${activeCategory === category.id ? 'active' : ''}`}
                                onClick={() => onCategoryChange(category.id)}
                            >
                                <span className="icon">{category.icon}</span> {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Width Type Filters */}
                <div className="filter-row" style={{ marginTop: '16px' }}>
                    <div className="filter-group">
                        <span style={{ color: 'var(--text-secondary)', marginRight: '12px', fontWeight: '500' }}>발볼 폭:</span>
                        {widthTypes.map((width) => (
                            <button
                                key={width.id}
                                className={`filter-btn width-filter ${activeWidthType === width.id ? 'active' : ''}`}
                                onClick={() => onWidthTypeChange(width.id as WidthType | 'all')}
                            >
                                <span className="icon">{width.icon}</span> {width.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
