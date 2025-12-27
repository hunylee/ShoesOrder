// 메인 애플리케이션 로직
import { shoesData, brands, categories } from './data.js';
import { shoppingAPI, shopIntegration } from './api.js';

class ShoesOrderApp {
    constructor() {
        this.products = [...shoesData];
        this.filteredProducts = [...shoesData];
        this.cart = [];
        this.filters = {
            brand: 'all',
            category: 'all',
            isLimitedEdition: false,
            isWideWidth: false,
            searchQuery: ''
        };
        this.selectedProduct = null;
        this.selectedSize = null;

        this.init();
    }

    init() {
        this.renderProducts();
        this.setupEventListeners();
        this.updateStats();
        console.log('🏃 일본 러닝화 해외 구매 대행 플랫폼 로딩 완료!');
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 검색
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.searchQuery = e.target.value;
                this.applyFilters();
            });
        }

        // 브랜드 필터
        document.querySelectorAll('.brand-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.brand-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filters.brand = btn.dataset.brand;
                this.applyFilters();
            });
        });

        // 카테고리 필터
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filters.category = btn.dataset.category;
                this.applyFilters();
            });
        });

        // 한정판 필터
        const limitedBtn = document.getElementById('limitedFilter');
        if (limitedBtn) {
            limitedBtn.addEventListener('click', () => {
                limitedBtn.classList.toggle('active');
                this.filters.isLimitedEdition = limitedBtn.classList.contains('active');
                this.applyFilters();
            });
        }

        // 발볼 넓은 제품 필터
        const wideBtn = document.getElementById('wideFilter');
        if (wideBtn) {
            wideBtn.addEventListener('click', () => {
                wideBtn.classList.toggle('active');
                this.filters.isWideWidth = wideBtn.classList.contains('active');
                this.applyFilters();
            });
        }

        // 모달 닫기
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        const closeModalBtn = document.getElementById('closeModal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal());
        }

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    // 필터 적용
    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // 브랜드 필터
            if (this.filters.brand !== 'all' && product.brand !== this.filters.brand) {
                return false;
            }

            // 카테고리 필터
            if (this.filters.category !== 'all' && product.category !== this.filters.category) {
                return false;
            }

            // 한정판 필터
            if (this.filters.isLimitedEdition && !product.isLimitedEdition) {
                return false;
            }

            // 발볼 넓은 제품 필터
            if (this.filters.isWideWidth && !product.isWideWidth) {
                return false;
            }

            // 검색어 필터
            if (this.filters.searchQuery) {
                const query = this.filters.searchQuery.toLowerCase();
                return (
                    product.name.toLowerCase().includes(query) ||
                    product.brand.toLowerCase().includes(query) ||
                    product.brandKr.includes(query) ||
                    product.nameJp.includes(query) ||
                    product.tags.some(tag => tag.includes(query))
                );
            }

            return true;
        });

        this.renderProducts();
        this.updateProductCount();
    }

    // 상품 목록 렌더링
    renderProducts() {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        if (this.filteredProducts.length === 0) {
            container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="icon">🔍</div>
          <h3>상품을 찾을 수 없습니다</h3>
          <p>다른 검색어나 필터를 사용해보세요.</p>
        </div>
      `;
            return;
        }

        container.innerHTML = this.filteredProducts.map(product => this.createProductCard(product)).join('');

        // 상품 카드 클릭 이벤트
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.dataset.id;
                this.openProductModal(productId);
            });
        });
    }

    // 상품 카드 HTML 생성
    createProductCard(product) {
        const badges = [];
        if (product.isLimitedEdition) {
            badges.push('<span class="badge badge-limited">한정판</span>');
        }
        if (product.isWideWidth) {
            badges.push('<span class="badge badge-wide">발볼넓은</span>');
        }
        if (product.japanExclusive) {
            badges.push('<span class="badge badge-japan">🇯🇵 일본한정</span>');
        }

        const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
        const totalPrice = product.price.krw + product.price.commission;

        return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-badges">
          ${badges.join('')}
        </div>
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="quick-view">
            <button class="quick-view-btn">상세 보기</button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-brand">${product.brand}</div>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-name-jp">${product.nameJp}</div>
          <div class="product-tags">
            ${product.tags.slice(0, 3).map(tag => `<span class="tag">#${tag}</span>`).join('')}
          </div>
          <div class="product-price">
            <span class="price-krw">₩${totalPrice.toLocaleString()}</span>
            <span class="price-jpy">¥${product.price.jpy.toLocaleString()}</span>
          </div>
          <div class="product-rating">
            <span class="stars">${stars}</span>
            <span class="rating-text">${product.rating} (${product.reviews}개 리뷰)</span>
          </div>
        </div>
      </div>
    `;
    }

    // 상품 상세 모달 열기
    openProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        this.selectedProduct = product;
        this.selectedSize = null;

        const modal = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');

        const badges = [];
        if (product.isLimitedEdition) {
            badges.push('<span class="badge badge-limited">한정판</span>');
        }
        if (product.isWideWidth) {
            badges.push('<span class="badge badge-wide">발볼넓은</span>');
        }
        if (product.japanExclusive) {
            badges.push('<span class="badge badge-japan">🇯🇵 일본한정</span>');
        }

        const totalPrice = product.price.krw + product.price.commission;

        modalContent.innerHTML = `
      <div class="modal-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="modal-details">
        <div class="product-badges" style="position: static; flex-direction: row; margin-bottom: 16px;">
          ${badges.join('')}
        </div>
        <div class="product-brand">${product.brand} / ${product.brandKr}</div>
        <h2>${product.name}</h2>
        <div class="product-name-jp">${product.nameJp}</div>
        <p class="modal-description">${product.description}</p>
        
        <div class="size-selector">
          <label>사이즈 선택 (cm)</label>
          <div class="size-options">
            ${product.sizes.map(size => `
              <div class="size-option" data-size="${size}">${size}</div>
            `).join('')}
          </div>
        </div>

        <div class="price-display">
          <div class="price-row">
            <span>일본 정가</span>
            <span>¥${product.price.jpy.toLocaleString()}</span>
          </div>
          <div class="price-row">
            <span>한국 환산가</span>
            <span>₩${product.price.krw.toLocaleString()}</span>
          </div>
          <div class="price-row">
            <span>구매대행 수수료</span>
            <span>₩${product.price.commission.toLocaleString()}</span>
          </div>
          <div class="price-row total">
            <span>총 예상가</span>
            <span>₩${totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn btn-secondary" id="addToCartBtn">
            🛒 장바구니 담기
          </button>
          <button class="btn btn-primary" id="orderNowBtn">
            ⚡ 바로 주문하기
          </button>
        </div>
      </div>
    `;

        // 사이즈 선택 이벤트
        modalContent.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', () => {
                modalContent.querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedSize = option.dataset.size;
            });
        });

        // 장바구니 담기
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            this.addToCart();
        });

        // 바로 주문하기
        document.getElementById('orderNowBtn').addEventListener('click', () => {
            this.orderNow();
        });

        modal.classList.add('active');
    }

    // 모달 닫기
    closeModal() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.remove('active');
        this.selectedProduct = null;
        this.selectedSize = null;
    }

    // 장바구니 담기
    addToCart() {
        if (!this.selectedProduct) return;

        if (!this.selectedSize) {
            this.showToast('사이즈를 선택해주세요.', 'error');
            return;
        }

        const cartItem = {
            ...this.selectedProduct,
            selectedSize: this.selectedSize,
            quantity: 1
        };

        this.cart.push(cartItem);
        this.updateCartBadge();
        this.showToast(`${this.selectedProduct.name}를 장바구니에 담았습니다.`, 'success');
        this.closeModal();
    }

    // 바로 주문하기
    async orderNow() {
        if (!this.selectedProduct) return;

        if (!this.selectedSize) {
            this.showToast('사이즈를 선택해주세요.', 'error');
            return;
        }

        // API 호출 (플레이스홀더)
        const result = await shoppingAPI.createOrder({
            product: this.selectedProduct,
            size: this.selectedSize
        });

        this.showToast('주문 기능은 API 연동 후 사용 가능합니다.', 'info');
        console.log('주문 시도:', result);
    }

    // 장바구니 뱃지 업데이트
    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = this.cart.length;
            badge.style.display = this.cart.length > 0 ? 'block' : 'none';
        }
    }

    // 통계 업데이트
    updateStats() {
        const totalProducts = document.getElementById('totalProducts');
        const limitedProducts = document.getElementById('limitedProducts');
        const wideProducts = document.getElementById('wideProducts');

        if (totalProducts) {
            totalProducts.textContent = this.products.length;
        }
        if (limitedProducts) {
            limitedProducts.textContent = this.products.filter(p => p.isLimitedEdition).length;
        }
        if (wideProducts) {
            wideProducts.textContent = this.products.filter(p => p.isWideWidth).length;
        }
    }

    // 상품 개수 업데이트
    updateProductCount() {
        const countEl = document.getElementById('productCount');
        if (countEl) {
            countEl.textContent = `${this.filteredProducts.length}개의 상품`;
        }
    }

    // 토스트 알림
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        };

        toast.innerHTML = `
      <span>${icons[type] || 'ℹ️'}</span>
      <span>${message}</span>
    `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ShoesOrderApp();
});

export { ShoesOrderApp };
