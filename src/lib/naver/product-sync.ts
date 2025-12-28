// Product Sync Service
// 상품 동기화 서비스

import { getNaverApi, NaverProductRequest } from './commerce-api';
import { Product } from '@/types';

interface SyncResult {
    success: boolean;
    synced: number;
    failed: number;
    errors: string[];
}

/**
 * 로컬 상품을 네이버 스마트스토어 형식으로 변환
 */
export function convertToNaverProduct(product: Product): NaverProductRequest {
    // 카테고리 ID 매핑 (러닝화 카테고리)
    // 실제 사용 시 네이버 카테고리 ID로 변경 필요
    const RUNNING_SHOES_CATEGORY = '50000804'; // 예시 카테고리 ID

    const deliveryFee = 3000; // 기본 배송비
    const freeShippingThreshold = 50000; // 무료배송 기준

    return {
        originProduct: {
            statusType: 'SALE',
            saleType: 'NEW',
            leafCategoryId: RUNNING_SHOES_CATEGORY,
            name: `[${product.brand}] ${product.name}`,
            detailContent: generateProductDescription(product),
            images: {
                representativeImage: {
                    url: product.imageUrl || 'https://via.placeholder.com/500',
                },
            },
            salePrice: product.priceKrw + product.commission,
            stockQuantity: 10, // 기본 재고
            deliveryInfo: {
                deliveryType: 'DELIVERY',
                deliveryAttributeType: 'NORMAL',
                deliveryFee: {
                    deliveryFeeType: 'CONDITIONAL_FREE',
                    baseFee: deliveryFee,
                    freeConditionalAmount: freeShippingThreshold,
                },
            },
            detailAttribute: {
                naverShoppingSearchInfo: {
                    manufacturerName: product.brand,
                    brandName: product.brand,
                    modelName: product.name,
                },
                afterServiceInfo: {
                    afterServiceTelephoneNumber: '010-0000-0000', // 실제 번호로 변경 필요
                    afterServiceGuideContent: '구매 후 7일 이내 반품 가능. 상품 불량 시 무료 반품.',
                },
                purchaseQuantityInfo: {
                    minPurchaseQuantity: 1,
                    maxPurchaseQuantityPerOrder: 5,
                },
            },
        },
        smartstoreChannelProduct: {
            channelProductName: product.name,
            storeKeepExclusiveProduct: false,
        },
    };
}

/**
 * 상품 상세 설명 HTML 생성
 */
function generateProductDescription(product: Product): string {
    const widthLabel = product.widthType === '4E' ? '초광폭 4E' :
        product.widthType === 'SW' ? '슈퍼와이드' :
            product.widthType === '2E' ? '와이드 2E' : '표준';

    const tags = product.tags.map(tag => `#${tag}`).join(' ');

    return `
<div style="max-width: 860px; margin: 0 auto; font-family: 'Noto Sans KR', sans-serif;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 16px; margin-bottom: 30px;">
    <h1 style="margin: 0; font-size: 28px;">${product.brand}</h1>
    <h2 style="margin: 10px 0; font-size: 22px;">${product.name}</h2>
    <p style="margin: 0; font-size: 14px; opacity: 0.9;">${product.nameJp}</p>
  </div>

  <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
    <h3 style="color: #333; margin-bottom: 20px;">📦 상품 정보</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">브랜드</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${product.brand} (${product.brandKr})</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">카테고리</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${getCategoryLabel(product.category)}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">발볼</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${widthLabel}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">사이즈</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${product.sizes.join(', ')}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">컬러</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${product.colors.join(', ')}</td>
      </tr>
      <tr>
        <td style="padding: 12px; color: #666;">평점</td>
        <td style="padding: 12px; font-weight: 600;">⭐ ${product.rating} (${product.reviews}개 리뷰)</td>
      </tr>
    </table>
  </div>

  <div style="padding: 30px; margin-bottom: 30px;">
    <h3 style="color: #333; margin-bottom: 15px;">📝 상품 설명</h3>
    <p style="line-height: 1.8; color: #555;">${product.description}</p>
  </div>

  ${product.isWideWidth ? `
  <div style="background: #e8f5e9; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #4caf50;">
    <h4 style="margin: 0 0 10px 0; color: #2e7d32;">👟 발볼 넓은 러닝화</h4>
    <p style="margin: 0; color: #388e3c;">발볼이 넓은 분들을 위해 특별히 디자인된 와이드 버전입니다.</p>
  </div>
  ` : ''}

  ${product.isLimitedEdition ? `
  <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #ff9800;">
    <h4 style="margin: 0 0 10px 0; color: #e65100;">🔥 한정판</h4>
    <p style="margin: 0; color: #f57c00;">한정 수량으로 출시된 프리미엄 에디션입니다.</p>
  </div>
  ` : ''}

  ${product.japanExclusive ? `
  <div style="background: #fce4ec; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #e91e63;">
    <h4 style="margin: 0 0 10px 0; color: #c2185b;">🇯🇵 일본 한정</h4>
    <p style="margin: 0; color: #d81b60;">일본에서만 구매 가능한 한정 상품입니다.</p>
  </div>
  ` : ''}

  <div style="text-align: center; padding: 20px; color: #888; font-size: 14px;">
    <p>${tags}</p>
    <p style="margin-top: 10px;">japanguru | 일본 러닝화 구매대행</p>
  </div>
</div>
  `.trim();
}

function getCategoryLabel(category: string): string {
    switch (category) {
        case 'stability': return '안정성 러닝화';
        case 'neutral': return '뉴트럴 러닝화';
        case 'racing': return '레이싱 슈즈';
        default: return '러닝화';
    }
}

/**
 * 모든 상품을 네이버 스마트스토어에 동기화
 */
export async function syncAllProducts(products: Product[]): Promise<SyncResult> {
    const api = getNaverApi();
    const result: SyncResult = {
        success: true,
        synced: 0,
        failed: 0,
        errors: [],
    };

    for (const product of products) {
        try {
            const naverProduct = convertToNaverProduct(product);
            await api.createProduct(naverProduct);
            result.synced++;
        } catch (error) {
            result.failed++;
            result.errors.push(`${product.name}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    }

    result.success = result.failed === 0;
    return result;
}

/**
 * 단일 상품을 네이버 스마트스토어에 등록
 */
export async function syncProduct(product: Product): Promise<{ success: boolean; error?: string }> {
    try {
        const api = getNaverApi();
        const naverProduct = convertToNaverProduct(product);
        await api.createProduct(naverProduct);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류',
        };
    }
}

export default {
    convertToNaverProduct,
    syncAllProducts,
    syncProduct,
};
