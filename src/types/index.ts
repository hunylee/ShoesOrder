// TypeScript Types for Japanese Running Shoes Platform
// 일본 러닝화 플랫폼 타입 정의

// 상품 타입
export type WidthType = 'standard' | '2E' | '4E' | 'SW'; // SW = Super Wide

export interface Product {
    id: string;
    brand: string;
    brandKr: string;
    name: string;
    nameJp: string;
    description: string;
    priceJpy: number;
    priceKrw: number;
    commission: number;
    isLimitedEdition: boolean;
    isWideWidth: boolean;
    widthType?: WidthType; // 발볼 타입: standard, 2E, 4E, SW(슈퍼와이드)
    sizes: string[];
    colors: string[];
    japanExclusive: boolean;
    category: 'stability' | 'neutral' | 'racing';
    rating: number;
    reviews: number;
    imageUrl?: string;
    tags: string[];
    sourceUrl?: string;
    sourcePlatform?: 'rakuten' | 'yahoo' | 'amazon' | 'mercari';
    createdAt: Date;
    updatedAt: Date;
}

// 크롤링된 상품 (아직 DB에 저장되지 않은)
export interface CrawledProduct {
    name: string;
    nameJp: string;
    brand?: string;
    priceJpy: number;
    imageUrl?: string;
    sourceUrl: string;
    platform: 'rakuten' | 'yahoo' | 'amazon' | 'mercari';
    sizes?: string[];
    colors?: string[];
    description?: string;
}

// 크롤링 로그 타입
export interface CrawlLog {
    id: string;
    platform: string;
    keyword?: string;
    status: 'success' | 'failed' | 'running';
    itemsFound: number;
    errorMsg?: string;
    duration?: number;
    createdAt: Date;
}

// 주문 타입
export interface Order {
    id: string;
    orderNumber: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    shippingAddress?: string;
    totalPrice: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    notes?: string;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

// 주문 아이템 타입
export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    size: string;
    color?: string;
    quantity: number;
    priceKrw: number;
    commission: number;
    product?: Product;
}

// 환율 타입
export interface ExchangeRate {
    id: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    createdAt: Date;
}

// API 응답 타입
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// 필터 타입
export interface ProductFilters {
    brand?: string;
    category?: string;
    isLimitedEdition?: boolean;
    isWideWidth?: boolean;
    widthType?: WidthType;
    searchQuery?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}

// 카트 아이템 타입
export interface CartItem {
    product: Product;
    size: string;
    color?: string;
    quantity: number;
}

// 브랜드 타입
export interface Brand {
    id: string;
    name: string;
    nameKr: string;
    icon?: string;
}

// 카테고리 타입
export interface Category {
    id: string;
    name: string;
    icon?: string;
}
