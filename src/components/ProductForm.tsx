// Product Form Component
// 상품 등록/수정 폼 컴포넌트

'use client';

import React, { useState } from 'react';
import { Product, WidthType } from '@/types';

interface ProductFormProps {
    initialData?: Partial<Product>;
    onSubmit: (data: Partial<Product>) => Promise<void>;
    isLoading?: boolean;
}

const BRANDS = [
    { value: 'ASICS', label: 'ASICS', labelKr: '아식스' },
    { value: 'Mizuno', label: 'Mizuno', labelKr: '미즈노' },
    { value: 'New Balance', label: 'New Balance', labelKr: '뉴발란스' },
    { value: 'Nike', label: 'Nike', labelKr: '나이키' },
    { value: 'adidas', label: 'adidas', labelKr: '아디다스' },
    { value: 'Brooks', label: 'Brooks', labelKr: '브룩스' },
    { value: 'Saucony', label: 'Saucony', labelKr: '써코니' },
    { value: 'HOKA', label: 'HOKA', labelKr: '호카' },
];

const CATEGORIES = [
    { value: 'neutral', label: '뉴트럴 러닝화' },
    { value: 'stability', label: '안정성 러닝화' },
    { value: 'racing', label: '레이싱 슈즈' },
];

const WIDTH_TYPES: { value: WidthType; label: string }[] = [
    { value: 'standard', label: '표준' },
    { value: '2E', label: '2E (와이드)' },
    { value: '4E', label: '4E (초광폭)' },
    { value: 'SW', label: '슈퍼와이드' },
];

const SIZES = ['22.5', '23.0', '23.5', '24.0', '24.5', '25.0', '25.5', '26.0', '26.5', '27.0', '27.5', '28.0', '28.5', '29.0', '29.5', '30.0'];

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#ccc',
};

export default function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        brand: '',
        brandKr: '',
        name: '',
        nameJp: '',
        description: '',
        priceJpy: 0,
        priceKrw: 0,
        commission: 15000,
        isLimitedEdition: false,
        isWideWidth: false,
        widthType: 'standard',
        sizes: [],
        colors: [],
        japanExclusive: false,
        category: 'neutral',
        imageUrl: '',
        tags: [],
        ...initialData,
    });

    const [colorInput, setColorInput] = useState('');
    const [tagInput, setTagInput] = useState('');

    const handleBrandChange = (brandValue: string) => {
        const brand = BRANDS.find(b => b.value === brandValue);
        setFormData(prev => ({
            ...prev,
            brand: brandValue,
            brandKr: brand?.labelKr || '',
        }));
    };

    const handlePriceJpyChange = (priceJpy: number) => {
        // 자동 환율 계산 (1 JPY = 약 9 KRW)
        const priceKrw = Math.round(priceJpy * 9);
        setFormData(prev => ({ ...prev, priceJpy, priceKrw }));
    };

    const handleSizeToggle = (size: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes?.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...(prev.sizes || []), size],
        }));
    };

    const handleAddColor = () => {
        if (colorInput.trim()) {
            setFormData(prev => ({
                ...prev,
                colors: [...(prev.colors || []), colorInput.trim()],
            }));
            setColorInput('');
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim()) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tagInput.trim()],
            }));
            setTagInput('');
        }
    };

    const handleWidthTypeChange = (widthType: WidthType) => {
        setFormData(prev => ({
            ...prev,
            widthType,
            isWideWidth: widthType !== 'standard',
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 브랜드 & 카테고리 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                    <label style={labelStyle}>브랜드 *</label>
                    <select
                        value={formData.brand}
                        onChange={(e) => handleBrandChange(e.target.value)}
                        style={inputStyle}
                        required
                    >
                        <option value="">선택하세요</option>
                        {BRANDS.map(b => (
                            <option key={b.value} value={b.value}>{b.label} ({b.labelKr})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>카테고리 *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
                        style={inputStyle}
                        required
                    >
                        {CATEGORIES.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 상품명 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                    <label style={labelStyle}>상품명 (영문) *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        style={inputStyle}
                        placeholder="예: GEL-KAYANO 31"
                        required
                    />
                </div>
                <div>
                    <label style={labelStyle}>상품명 (일본어)</label>
                    <input
                        type="text"
                        value={formData.nameJp}
                        onChange={(e) => setFormData(prev => ({ ...prev, nameJp: e.target.value }))}
                        style={inputStyle}
                        placeholder="예: ゲルカヤノ31"
                    />
                </div>
            </div>

            {/* 가격 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                    <label style={labelStyle}>일본 가격 (¥) *</label>
                    <input
                        type="number"
                        value={formData.priceJpy || ''}
                        onChange={(e) => handlePriceJpyChange(Number(e.target.value))}
                        style={inputStyle}
                        placeholder="18000"
                        required
                    />
                </div>
                <div>
                    <label style={labelStyle}>한국 환산가 (₩)</label>
                    <input
                        type="number"
                        value={formData.priceKrw || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, priceKrw: Number(e.target.value) }))}
                        style={inputStyle}
                        placeholder="자동 계산"
                    />
                </div>
                <div>
                    <label style={labelStyle}>수수료 (₩)</label>
                    <input
                        type="number"
                        value={formData.commission || 15000}
                        onChange={(e) => setFormData(prev => ({ ...prev, commission: Number(e.target.value) }))}
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* 발볼 타입 */}
            <div>
                <label style={labelStyle}>발볼 타입</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {WIDTH_TYPES.map(w => (
                        <button
                            key={w.value}
                            type="button"
                            onClick={() => handleWidthTypeChange(w.value)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: formData.widthType === w.value
                                    ? '2px solid #7c3aed'
                                    : '1px solid rgba(255,255,255,0.2)',
                                background: formData.widthType === w.value
                                    ? 'rgba(124, 58, 237, 0.3)'
                                    : 'rgba(255,255,255,0.05)',
                                color: 'white',
                                cursor: 'pointer',
                            }}
                        >
                            {w.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 사이즈 선택 */}
            <div>
                <label style={labelStyle}>사이즈 (cm)</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {SIZES.map(size => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeToggle(size)}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '6px',
                                border: formData.sizes?.includes(size)
                                    ? '2px solid #10b981'
                                    : '1px solid rgba(255,255,255,0.2)',
                                background: formData.sizes?.includes(size)
                                    ? 'rgba(16, 185, 129, 0.3)'
                                    : 'rgba(255,255,255,0.05)',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '13px',
                            }}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* 색상 */}
            <div>
                <label style={labelStyle}>색상</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                        type="text"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                        style={{ ...inputStyle, flex: 1 }}
                        placeholder="색상 입력 후 Enter 또는 추가 버튼"
                    />
                    <button
                        type="button"
                        onClick={handleAddColor}
                        style={{
                            padding: '12px 20px',
                            background: '#7c3aed',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        추가
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {formData.colors?.map((color, i) => (
                        <span
                            key={i}
                            style={{
                                padding: '6px 12px',
                                background: 'rgba(124, 58, 237, 0.3)',
                                borderRadius: '20px',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            {color}
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    colors: prev.colors?.filter((_, idx) => idx !== i),
                                }))}
                                style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* 이미지 URL */}
            <div>
                <label style={labelStyle}>대표 이미지 URL</label>
                <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    style={inputStyle}
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            {/* 설명 */}
            <div>
                <label style={labelStyle}>상품 설명</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                    placeholder="상품 특징 및 설명을 입력하세요"
                />
            </div>

            {/* 태그 */}
            <div>
                <label style={labelStyle}>태그</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        style={{ ...inputStyle, flex: 1 }}
                        placeholder="태그 입력 (예: 쿠셔닝, 마라톤)"
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        style={{
                            padding: '12px 20px',
                            background: '#7c3aed',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        추가
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {formData.tags?.map((tag, i) => (
                        <span
                            key={i}
                            style={{
                                padding: '6px 12px',
                                background: 'rgba(59, 130, 246, 0.3)',
                                borderRadius: '20px',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            #{tag}
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    tags: prev.tags?.filter((_, idx) => idx !== i),
                                }))}
                                style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* 옵션 체크박스 */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={formData.isLimitedEdition}
                        onChange={(e) => setFormData(prev => ({ ...prev, isLimitedEdition: e.target.checked }))}
                        style={{ width: '18px', height: '18px' }}
                    />
                    🔥 한정판
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={formData.japanExclusive}
                        onChange={(e) => setFormData(prev => ({ ...prev, japanExclusive: e.target.checked }))}
                        style={{ width: '18px', height: '18px' }}
                    />
                    🇯🇵 일본한정
                </label>
            </div>

            {/* 제출 버튼 */}
            <button
                type="submit"
                disabled={isLoading}
                style={{
                    padding: '16px 32px',
                    background: isLoading ? '#333' : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    marginTop: '16px',
                }}
            >
                {isLoading ? '저장 중...' : '상품 등록'}
            </button>
        </form>
    );
}
