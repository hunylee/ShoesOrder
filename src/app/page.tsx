// Main Page Component
// 메인 페이지

'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import Footer from '@/components/Footer';
import { Product, CartItem, WidthType } from '@/types';

// 고정 날짜 (하이드레이션 오류 방지)
const FIXED_DATE = new Date('2024-01-01');

// 초기 상품 데이터 (DB 연결 전 사용)
const initialProducts: Product[] = [
  {
    id: "asics-gel-kayano-30-wide",
    brand: "ASICS",
    brandKr: "아식스",
    name: "GEL-KAYANO 30 WIDE 2E",
    nameJp: "ゲルカヤノ30 ワイド 2E",
    description: "발볼이 넓은 러너를 위한 최고의 안정성 러닝화. 4D GUIDANCE SYSTEM으로 자연스러운 발 움직임을 지원합니다.",
    priceJpy: 19800,
    priceKrw: 178000,
    commission: 15000,
    isLimitedEdition: false,
    isWideWidth: true,
    widthType: "2E",
    sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0"],
    colors: ["Black/White", "French Blue", "Midnight"],
    japanExclusive: false,
    category: "stability",
    rating: 4.8,
    reviews: 324,
    imageUrl: "/asics_gel_kayano.png",
    tags: ["발볼넓은", "2E", "안정성", "장거리"],
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
  },
  {
    id: "asics-gel-kayano-30-4e",
    brand: "ASICS",
    brandKr: "아식스",
    name: "GEL-KAYANO 30 EXTRA WIDE 4E",
    nameJp: "ゲルカヤノ30 エクストラワイド 4E",
    description: "초광폭 4E 발볼을 위한 프리미엄 안정성 러닝화. 넓은 발에도 완벽한 피팅을 제공합니다.",
    priceJpy: 20900,
    priceKrw: 188000,
    commission: 16000,
    isLimitedEdition: false,
    isWideWidth: true,
    widthType: "4E",
    sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0", "30.0"],
    colors: ["Navy/Black", "Steel Grey", "Black/Pure Silver"],
    japanExclusive: true,
    category: "stability",
    rating: 4.9,
    reviews: 187,
    imageUrl: "/asics_kayano_4e.png",
    tags: ["발볼넓은", "4E", "초광폭", "안정성"],
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
  },
  {
    id: "asics-gel-nimbus-26-sw",
    brand: "ASICS",
    brandKr: "아식스",
    name: "GEL-NIMBUS 26 SUPER WIDE",
    nameJp: "ゲルニンバス26 スーパーワイド",
    description: "슈퍼와이드 버전의 최고급 쿠셔닝 러닝화. FF BLAST PLUS 쿠셔닝으로 부드러운 착지감을 제공합니다.",
    priceJpy: 21450,
    priceKrw: 193000,
    commission: 17000,
    isLimitedEdition: false,
    isWideWidth: true,
    widthType: "SW",
    sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0", "30.0"],
    colors: ["Orange/Black", "Sunrise Red", "Electric Blue"],
    japanExclusive: true,
    category: "neutral",
    rating: 4.8,
    reviews: 256,
    imageUrl: "/asics_nimbus_sw.png",
    tags: ["발볼넓은", "슈퍼와이드", "쿠셔닝", "프리미엄"],
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
  },
  {
    id: "asics-metaspeed-sky-paris",
    brand: "ASICS",
    brandKr: "아식스",
    name: "METASPEED SKY+ PARIS",
    nameJp: "メタスピードスカイ+ パリ",
    description: "파리 올림픽 한정판. FF BLAST TURBO 쿠셔닝과 풀렝스 카본 플레이트로 최고의 속도를 경험하세요.",
    priceJpy: 27500,
    priceKrw: 247000,
    commission: 20000,
    isLimitedEdition: true,
    isWideWidth: false,
    widthType: "standard",
    sizes: ["24.5", "25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0"],
    colors: ["Sunrise Red", "Safety Yellow"],
    japanExclusive: true,
    category: "racing",
    rating: 4.9,
    reviews: 156,
    imageUrl: "/asics_metaspeed.png",
    tags: ["한정판", "카본플레이트", "레이싱"],
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
  },
  {
    id: "asics-gt-2000-12-wide",
    brand: "ASICS",
    brandKr: "아식스",
    name: "GT-2000 12 WIDE 2E",
    nameJp: "GT-2000 12 ワイド 2E",
    description: "발볼이 넓은 데일리 러닝화. 안정성과 쿠셔닝의 완벽한 균형.",
    priceJpy: 16500,
    priceKrw: 148000,
    commission: 12000,
    isLimitedEdition: false,
    isWideWidth: true,
    widthType: "2E",
    sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0", "30.0"],
    colors: ["Black/Carrier Grey", "Blue Expanse", "Lake Drive"],
    japanExclusive: false,
    category: "stability",
    rating: 4.7,
    reviews: 512,
    imageUrl: "/asics_gt2000.png",
    tags: ["발볼넓은", "2E", "데일리", "입문자추천"],
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
  },
  {
    id: "nb-fresh-foam-1080v13-2e",
    brand: "New Balance",
    brandKr: "뉴발란스",
    name: "Fresh Foam X 1080v13 2E Wide",
    nameJp: "フレッシュフォーム X 1080v13 2E ワイド",
    description: "프리미엄 쿠셔닝의 정점. 발볼이 넓은 2E 와이드 버전으로 편안함을 극대화.",
    priceJpy: 18700,
    priceKrw: 168000,
    commission: 15000,
    isLimitedEdition: false,
    isWideWidth: true,
    widthType: "2E",
    sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0"],
    colors: ["Black/Gum", "Sea Salt/Raincloud", "Navy/Vintage Indigo"],
    japanExclusive: false,
    category: "neutral",
    rating: 4.8,
    reviews: 445,
    imageUrl: "/newbalance_1080.png",
    tags: ["발볼넓은", "2E", "쿠셔닝", "장거리"],
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
  },
  {
    id: "nb-880v14-4e",
    brand: "New Balance",
    brandKr: "뉴발란스",
    name: "880v14 EXTRA WIDE 4E",
    nameJp: "880v14 エクストラワイド 4E",
    description: "4E 초광폭 버전의 인기 데일리 러닝화. Fresh Foam X 미드솔로 뛰어난 쿠셔닝 제공.",
    priceJpy: 16280,
    priceKrw: 146000,
    commission: 13000,
    isLimitedEdition: false,
    isWideWidth: true,
    widthType: "4E",
    sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0", "30.0"],
    colors: ["Grey/White", "Black/Silver", "Navy/Red"],
    japanExclusive: true,
    category: "neutral",
    rating: 4.7,
    reviews: 328,
    imageUrl: "/newbalance_880_4e.png",
    tags: ["발볼넓은", "4E", "초광폭", "데일리"],
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
  },
  {
    id: "mizuno-wave-rider-27-sw",
    brand: "Mizuno",
    brandKr: "미즈노",
    name: "Wave Rider 27 SUPER WIDE",
    nameJp: "ウエーブライダー27 スーパーワイド",
    description: "미즈노의 시그니처 러닝화. 슈퍼 와이드 버전으로 넓은 발볼에 최적화.",
    priceJpy: 15950,
    priceKrw: 143000,
    commission: 12000,
    isLimitedEdition: false,
    isWideWidth: true,
    widthType: "SW",
    sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0"],
    colors: ["Undyed White", "Dress Blues", "Peacoat/Silver"],
    japanExclusive: false,
    category: "neutral",
    rating: 4.7,
    reviews: 389,
    imageUrl: "/mizuno_waverider.png",
    tags: ["발볼넓은", "슈퍼와이드", "웨이브플레이트", "쿠셔닝"],
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
  },
  {
    id: "mizuno-wave-inspire-20-sw",
    brand: "Mizuno",
    brandKr: "미즈노",
    name: "Wave Inspire 20 SUPER WIDE",
    nameJp: "ウエーブインスパイア20 スーパーワイド",
    description: "슈퍼와이드 안정성 러닝화. Mizuno Wave 플레이트로 안정적인 주행을 지원합니다.",
    priceJpy: 16500,
    priceKrw: 148000,
    commission: 13000,
    isLimitedEdition: false,
    isWideWidth: true,
    widthType: "SW",
    sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0", "30.0"],
    colors: ["Silver/Blue", "Black/White", "Navy/Orange"],
    japanExclusive: true,
    category: "stability",
    rating: 4.6,
    reviews: 201,
    imageUrl: "/mizuno_inspire_sw.png",
    tags: ["발볼넓은", "슈퍼와이드", "안정성", "장거리"],
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
  },
  {
    id: "saucony-endorphin-pro4",
    brand: "Saucony",
    brandKr: "써코니",
    name: "Endorphin Pro 4",
    nameJp: "エンドルフィンプロ4",
    description: "일본 선행 출시 컬러. 최고의 레이싱 성능을 제공하는 카본 플레이트 슈즈.",
    priceJpy: 26400,
    priceKrw: 237000,
    commission: 18000,
    isLimitedEdition: true,
    isWideWidth: false,
    widthType: "standard",
    sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0"],
    colors: ["Japan First Blue/Citrus", "Vizi Pro"],
    japanExclusive: true,
    category: "racing",
    rating: 4.8,
    reviews: 67,
    imageUrl: "/saucony_endorphin.png",
    tags: ["한정판", "레이싱", "일본선행"],
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters state
  const [activeBrand, setActiveBrand] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLimitedActive, setIsLimitedActive] = useState(false);
  const [isWideActive, setIsWideActive] = useState(false);
  const [activeWidthType, setActiveWidthType] = useState<WidthType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // API에서 상품 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.data?.products.length > 0) {
          setProducts(data.data.products);
          setFilteredProducts(data.data.products);
        }
      } catch (error) {
        console.log('Using initial products:', error);
      }
    };
    fetchProducts();
  }, []);

  // 필터 적용
  const applyFilters = useCallback(() => {
    let result = [...products];

    if (activeBrand !== 'all') {
      result = result.filter(p => p.brand === activeBrand);
    }

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    // 한정판과 발볼넓은 필터: 둘 다 선택시 OR 로직 적용
    if (isLimitedActive && isWideActive) {
      result = result.filter(p => p.isLimitedEdition || p.isWideWidth);
    } else if (isLimitedActive) {
      result = result.filter(p => p.isLimitedEdition);
    } else if (isWideActive) {
      result = result.filter(p => p.isWideWidth);
    }

    if (activeWidthType !== 'all') {
      result = result.filter(p => p.widthType === activeWidthType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.brandKr.includes(query) ||
        p.nameJp.includes(query) ||
        p.tags.some(tag => tag.includes(query))
      );
    }

    setFilteredProducts(result);
  }, [products, activeBrand, activeCategory, isLimitedActive, isWideActive, activeWidthType, searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Stats
  const totalProducts = products.length;
  const limitedProducts = products.filter(p => p.isLimitedEdition).length;
  const wideProducts = products.filter(p => p.isWideWidth).length;

  // Handlers
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: Product, size: string) => {
    const existingItem = cart.find(
      item => item.product.id === product.id && item.size === size
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, size, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId: string, size: string) => {
    setCart(cart.filter(
      item => !(item.product.id === productId && item.size === size)
    ));
  };

  const handleUpdateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId, size);
    } else {
      setCart(cart.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.priceKrw + item.product.commission) * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <Header
        cartCount={cartItemCount}
        onSearch={setSearchQuery}
        onCartClick={() => { }}
      />

      <main className="main-content">
        {/* Hero Stats Section */}
        <section className="hero-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{totalProducts}</div>
                <div className="stat-label">전체 상품</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{limitedProducts}</div>
                <div className="stat-label">한정판</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{wideProducts}</div>
                <div className="stat-label">발볼 넓은</div>
              </div>
            </div>
          </div>
        </section>

        <FilterBar
          activeBrand={activeBrand}
          activeCategory={activeCategory}
          isLimitedActive={isLimitedActive}
          isWideActive={isWideActive}
          activeWidthType={activeWidthType}
          onBrandChange={setActiveBrand}
          onCategoryChange={setActiveCategory}
          onLimitedToggle={() => setIsLimitedActive(!isLimitedActive)}
          onWideToggle={() => setIsWideActive(!isWideActive)}
          onWidthTypeChange={setActiveWidthType}
        />

        {/* Products Section */}
        <section className="products-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🏃 러닝화 컬렉션</h2>
              <span className="product-count">{filteredProducts.length}개의 상품</span>
            </div>

            <div className="products-grid">
              {filteredProducts.length === 0 ? (
                <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
                  <p style={{ color: 'var(--text-secondary)' }}>검색 결과가 없습니다</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
