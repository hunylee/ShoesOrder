// Naver Commerce API Client
// 네이버 커머스 API 클라이언트

import crypto from 'crypto';

interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

interface NaverApiConfig {
    clientId: string;
    clientSecret: string;
    sellerId: string;
}

class NaverCommerceApi {
    private config: NaverApiConfig;
    private baseUrl = 'https://api.commerce.naver.com';
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;

    constructor(config?: Partial<NaverApiConfig>) {
        this.config = {
            clientId: config?.clientId || process.env.NAVER_CLIENT_ID || '',
            clientSecret: config?.clientSecret || process.env.NAVER_CLIENT_SECRET || '',
            sellerId: config?.sellerId || process.env.NAVER_SELLER_ID || 'ncp_i6wuhd_01',
        };
    }

    /**
     * HMAC-SHA256 서명 생성 (네이버 API 인증에 필요)
     */
    private generateSignature(timestamp: string): string {
        const message = `${this.config.clientId}_${timestamp}`;
        const signature = crypto
            .createHmac('sha256', this.config.clientSecret)
            .update(message)
            .digest('base64');
        return signature;
    }

    /**
     * 액세스 토큰 발급
     */
    async getAccessToken(): Promise<string> {
        // 이미 유효한 토큰이 있으면 재사용
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        const timestamp = String(Date.now());
        const signature = this.generateSignature(timestamp);

        const params = new URLSearchParams({
            client_id: this.config.clientId,
            timestamp: timestamp,
            client_secret_sign: signature,
            grant_type: 'client_credentials',
            type: 'SELF',
        });

        try {
            const response = await fetch(`${this.baseUrl}/external/v1/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`토큰 발급 실패: ${response.status} - ${error}`);
            }

            const data: TokenResponse = await response.json();
            this.accessToken = data.access_token;
            // 만료 5분 전에 갱신하도록 설정
            this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

            return this.accessToken;
        } catch (error) {
            console.error('네이버 API 토큰 발급 오류:', error);
            throw error;
        }
    }

    /**
     * API 요청 헤더 생성
     */
    private async getHeaders(): Promise<HeadersInit> {
        const token = await this.getAccessToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    /**
     * API 요청 (GET)
     */
    async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        const headers = await this.getHeaders();
        const url = new URL(`${this.baseUrl}${endpoint}`);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API 요청 실패: ${response.status} - ${error}`);
        }

        return response.json();
    }

    /**
     * API 요청 (POST)
     */
    async post<T>(endpoint: string, body: unknown): Promise<T> {
        const headers = await this.getHeaders();

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API 요청 실패: ${response.status} - ${error}`);
        }

        return response.json();
    }

    /**
     * API 요청 (PUT)
     */
    async put<T>(endpoint: string, body: unknown): Promise<T> {
        const headers = await this.getHeaders();

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API 요청 실패: ${response.status} - ${error}`);
        }

        return response.json();
    }

    // ==================== 상품 API ====================

    /**
     * 상품 목록 조회
     */
    async getProducts(page = 1, size = 100) {
        return this.get('/external/v2/products', {
            page: String(page),
            size: String(size),
        });
    }

    /**
     * 상품 상세 조회
     */
    async getProduct(productNo: string) {
        return this.get(`/external/v2/products/${productNo}`);
    }

    /**
     * 상품 등록
     */
    async createProduct(productData: NaverProductRequest) {
        return this.post('/external/v2/products', productData);
    }

    /**
     * 상품 수정
     */
    async updateProduct(productNo: string, productData: Partial<NaverProductRequest>) {
        return this.put(`/external/v2/products/${productNo}`, productData);
    }

    // ==================== 주문 API ====================

    /**
     * 신규 주문 목록 조회
     */
    async getNewOrders() {
        return this.get('/external/v1/pay-order/seller/orders/new');
    }

    /**
     * 주문 상세 조회
     */
    async getOrder(orderId: string) {
        return this.get(`/external/v1/pay-order/seller/orders/${orderId}`);
    }

    /**
     * 발주 확인 처리
     */
    async confirmOrder(productOrderId: string) {
        return this.post('/external/v1/pay-order/seller/product-orders/confirm', {
            productOrderIds: [productOrderId],
        });
    }

    /**
     * 발송 처리
     */
    async shipOrder(productOrderId: string, deliveryInfo: DeliveryInfo) {
        return this.post('/external/v1/pay-order/seller/product-orders/dispatch', {
            productOrderId,
            deliveryMethod: deliveryInfo.method,
            deliveryCompany: deliveryInfo.company,
            trackingNumber: deliveryInfo.trackingNumber,
        });
    }

    // ==================== 설정 확인 ====================

    /**
     * API 연결 테스트
     */
    async testConnection(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this.config.clientId || !this.config.clientSecret) {
                return {
                    success: false,
                    message: 'API 키가 설정되지 않았습니다. env.example을 참고하여 .env.local 파일을 생성하세요.',
                };
            }

            await this.getAccessToken();
            return {
                success: true,
                message: '네이버 스마트스토어 API 연결 성공!',
            };
        } catch (error) {
            return {
                success: false,
                message: `연결 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
            };
        }
    }
}

// 타입 정의
export interface NaverProductRequest {
    originProduct: {
        statusType: 'SALE' | 'SUSPENSION';
        saleType: 'NEW';
        leafCategoryId: string;
        name: string;
        detailContent: string;
        images: {
            representativeImage: { url: string };
            optionalImages?: { url: string }[];
        };
        salePrice: number;
        stockQuantity: number;
        deliveryInfo: {
            deliveryType: 'DELIVERY';
            deliveryAttributeType: 'NORMAL';
            deliveryFee: {
                deliveryFeeType: 'FREE' | 'PAID' | 'CONDITIONAL_FREE';
                baseFee?: number;
                freeConditionalAmount?: number;
            };
        };
        detailAttribute?: {
            naverShoppingSearchInfo?: {
                manufacturerName?: string;
                brandName?: string;
                modelName?: string;
            };
            afterServiceInfo?: {
                afterServiceTelephoneNumber: string;
                afterServiceGuideContent: string;
            };
            purchaseQuantityInfo?: {
                minPurchaseQuantity?: number;
                maxPurchaseQuantityPerOrder?: number;
            };
        };
    };
    smartstoreChannelProduct?: {
        channelProductName?: string;
        storeKeepExclusiveProduct?: boolean;
    };
}

export interface DeliveryInfo {
    method: 'DELIVERY' | 'DIRECT_DELIVERY' | 'NOTHING';
    company?: string;
    trackingNumber?: string;
}

// 싱글톤 인스턴스
let naverApiInstance: NaverCommerceApi | null = null;

export function getNaverApi(config?: Partial<NaverApiConfig>): NaverCommerceApi {
    if (!naverApiInstance) {
        naverApiInstance = new NaverCommerceApi(config);
    }
    return naverApiInstance;
}

export default NaverCommerceApi;
