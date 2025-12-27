// 일본 러닝화 상품 데이터
const shoesData = [
    // ASICS 아식스
    {
        id: "asics-gel-kayano-30-wide",
        brand: "ASICS",
        brandKr: "아식스",
        name: "GEL-KAYANO 30 WIDE",
        nameJp: "ゲルカヤノ30 ワイド",
        description: "발볼이 넓은 러너를 위한 최고의 안정성 러닝화. 4D GUIDANCE SYSTEM으로 자연스러운 발 움직임을 지원합니다.",
        price: {
            jpy: 19800,
            krw: 178000,
            commission: 15000
        },
        isLimitedEdition: false,
        isWideWidth: true,
        sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0"],
        colors: ["Black/White", "French Blue", "Midnight"],
        japanExclusive: false,
        category: "stability",
        rating: 4.8,
        reviews: 324,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        tags: ["발볼넓은", "안정성", "장거리"]
    },
    {
        id: "asics-metaspeed-sky-paris",
        brand: "ASICS",
        brandKr: "아식스",
        name: "METASPEED SKY+ PARIS",
        nameJp: "メタスピードスカイ+ パリ",
        description: "파리 올림픽 한정판. FF BLAST TURBO 쿠셔닝과 풀렝스 카본 플레이트로 최고의 속도를 경험하세요.",
        price: {
            jpy: 27500,
            krw: 247000,
            commission: 20000
        },
        isLimitedEdition: true,
        isWideWidth: false,
        sizes: ["24.5", "25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0"],
        colors: ["Sunrise Red", "Safety Yellow"],
        japanExclusive: true,
        category: "racing",
        rating: 4.9,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
        tags: ["한정판", "카본플레이트", "레이싱"]
    },
    {
        id: "asics-gt-2000-12-wide",
        brand: "ASICS",
        brandKr: "아식스",
        name: "GT-2000 12 WIDE",
        nameJp: "GT-2000 12 ワイド",
        description: "발볼이 넓은 데일리 러닝화. 안정성과 쿠셔닝의 완벽한 균형.",
        price: {
            jpy: 16500,
            krw: 148000,
            commission: 12000
        },
        isLimitedEdition: false,
        isWideWidth: true,
        sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0", "30.0"],
        colors: ["Black/Carrier Grey", "Blue Expanse", "Lake Drive"],
        japanExclusive: false,
        category: "stability",
        rating: 4.7,
        reviews: 512,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400",
        tags: ["발볼넓은", "데일리", "입문자추천"]
    },
    {
        id: "asics-novablast-4-tokyo",
        brand: "ASICS",
        brandKr: "아식스",
        name: "NOVABLAST 4 TOKYO EDITION",
        nameJp: "ノヴァブラスト4 東京エディション",
        description: "도쿄 마라톤 한정판. 경쾌한 반발력으로 즐거운 러닝을 선사합니다.",
        price: {
            jpy: 17600,
            krw: 158000,
            commission: 15000
        },
        isLimitedEdition: true,
        isWideWidth: false,
        sizes: ["24.5", "25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0"],
        colors: ["Tokyo Sunrise", "Neo Tokyo"],
        japanExclusive: true,
        category: "neutral",
        rating: 4.8,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400",
        tags: ["한정판", "도쿄마라톤", "반발력"]
    },

    // New Balance 뉴발란스
    {
        id: "nb-fresh-foam-1080v13-wide",
        brand: "New Balance",
        brandKr: "뉴발란스",
        name: "Fresh Foam X 1080v13 2E Wide",
        nameJp: "フレッシュフォーム X 1080v13 2E ワイド",
        description: "프리미엄 쿠셔닝의 정점. 발볼이 넓은 2E 와이드 버전으로 편안함을 극대화.",
        price: {
            jpy: 18700,
            krw: 168000,
            commission: 15000
        },
        isLimitedEdition: false,
        isWideWidth: true,
        sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0"],
        colors: ["Black/Gum", "Sea Salt/Raincloud", "Navy/Vintage Indigo"],
        japanExclusive: false,
        category: "neutral",
        rating: 4.8,
        reviews: 445,
        image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400",
        tags: ["발볼넓은", "쿠셔닝", "장거리"]
    },
    {
        id: "nb-fuelcell-sc-elite-v3",
        brand: "New Balance",
        brandKr: "뉴발란스",
        name: "FuelCell SC Elite v3",
        nameJp: "フューエルセル SC エリート v3",
        description: "일본 한정 컬러웨이. 엘리트 마라토너를 위한 궁극의 레이싱 슈즈.",
        price: {
            jpy: 30800,
            krw: 277000,
            commission: 22000
        },
        isLimitedEdition: true,
        isWideWidth: false,
        sizes: ["24.5", "25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0"],
        colors: ["Japan Exclusive White/Red", "Carbon Grey"],
        japanExclusive: true,
        category: "racing",
        rating: 4.9,
        reviews: 78,
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400",
        tags: ["한정판", "레이싱", "카본플레이트"]
    },
    {
        id: "nb-860v14-4e-extra-wide",
        brand: "New Balance",
        brandKr: "뉴발란스",
        name: "860v14 4E Extra Wide",
        nameJp: "860v14 4E エクストラワイド",
        description: "가장 넓은 발볼의 안정성 러닝화. 4E 엑스트라 와이드로 완벽한 핏.",
        price: {
            jpy: 15400,
            krw: 138000,
            commission: 12000
        },
        isLimitedEdition: false,
        isWideWidth: true,
        sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0", "30.0"],
        colors: ["Navy/Aluminum", "Black/Silver", "Grey/Lime"],
        japanExclusive: false,
        category: "stability",
        rating: 4.6,
        reviews: 234,
        image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400",
        tags: ["발볼넓은", "4E와이드", "안정성"]
    },

    // Mizuno 미즈노
    {
        id: "mizuno-wave-rider-27-wide",
        brand: "Mizuno",
        brandKr: "미즈노",
        name: "Wave Rider 27 SW Wide",
        nameJp: "ウエーブライダー27 SW ワイド",
        description: "미즈노의 시그니처 러닝화. 슈퍼 와이드 버전으로 넓은 발볼에 최적화.",
        price: {
            jpy: 15950,
            krw: 143000,
            commission: 12000
        },
        isLimitedEdition: false,
        isWideWidth: true,
        sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0"],
        colors: ["Undyed White", "Dress Blues", "Peacoat/Silver"],
        japanExclusive: false,
        category: "neutral",
        rating: 4.7,
        reviews: 389,
        image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400",
        tags: ["발볼넓은", "웨이브플레이트", "쿠셔닝"]
    },
    {
        id: "mizuno-wave-rebellion-pro2",
        brand: "Mizuno",
        brandKr: "미즈노",
        name: "Wave Rebellion Pro 2",
        nameJp: "ウエーブリベリオンプロ2",
        description: "일본 엘리트 선수 전용 레이싱 슈즈. 한정 수량 판매.",
        price: {
            jpy: 28600,
            krw: 257000,
            commission: 20000
        },
        isLimitedEdition: true,
        isWideWidth: false,
        sizes: ["24.5", "25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0"],
        colors: ["Neon Yellow/Black", "White/Fiery Coral"],
        japanExclusive: true,
        category: "racing",
        rating: 4.9,
        reviews: 56,
        image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=400",
        tags: ["한정판", "레이싱", "일본한정"]
    },
    {
        id: "mizuno-wave-inspire-20-wide",
        brand: "Mizuno",
        brandKr: "미즈노",
        name: "Wave Inspire 20 Wide",
        nameJp: "ウエーブインスパイア20 ワイド",
        description: "안정성과 편안함의 조화. 발볼 넓은 러너를 위한 서포트 러닝화.",
        price: {
            jpy: 14850,
            krw: 133000,
            commission: 11000
        },
        isLimitedEdition: false,
        isWideWidth: true,
        sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5", "29.0", "30.0"],
        colors: ["Ebony/White", "Blue Depths/Jet Blue"],
        japanExclusive: false,
        category: "stability",
        rating: 4.6,
        reviews: 198,
        image: "https://images.unsplash.com/photo-1491553895911-0055uj74df35?w=400",
        tags: ["발볼넓은", "안정성", "입문자추천"]
    },

    // Saucony 써코니
    {
        id: "saucony-endorphin-pro4",
        brand: "Saucony",
        brandKr: "써코니",
        name: "Endorphin Pro 4",
        nameJp: "エンドルフィンプロ4",
        description: "일본 선행 출시 컬러. 최고의 레이싱 성능을 제공하는 카본 플레이트 슈즈.",
        price: {
            jpy: 26400,
            krw: 237000,
            commission: 18000
        },
        isLimitedEdition: true,
        isWideWidth: false,
        sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0"],
        colors: ["Japan First Blue/Citrus", "Vizi Pro"],
        japanExclusive: true,
        category: "racing",
        rating: 4.8,
        reviews: 67,
        image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400",
        tags: ["한정판", "레이싱", "일본선행"]
    },
    {
        id: "saucony-triumph-22-wide",
        brand: "Saucony",
        brandKr: "써코니",
        name: "Triumph 22 Wide",
        nameJp: "トライアンフ22 ワイド",
        description: "최상급 쿠셔닝의 뉴트럴 러닝화. 와이드 버전으로 넓은 발볼에 최적화.",
        price: {
            jpy: 18700,
            krw: 168000,
            commission: 15000
        },
        isLimitedEdition: false,
        isWideWidth: true,
        sizes: ["25.0", "25.5", "26.0", "26.5", "27.0", "27.5", "28.0", "28.5"],
        colors: ["Black/White", "Fog/Bough", "Navy/Lime"],
        japanExclusive: false,
        category: "neutral",
        rating: 4.7,
        reviews: 145,
        image: "https://images.unsplash.com/photo-1584735175315-9d5df23be5bc?w=400",
        tags: ["발볼넓은", "쿠셔닝", "장거리"]
    }
];

// 브랜드 목록
const brands = [
    { id: "all", name: "전체", nameEn: "All" },
    { id: "ASICS", name: "아식스", nameEn: "ASICS" },
    { id: "New Balance", name: "뉴발란스", nameEn: "New Balance" },
    { id: "Mizuno", name: "미즈노", nameEn: "Mizuno" },
    { id: "Saucony", name: "써코니", nameEn: "Saucony" }
];

// 카테고리 목록
const categories = [
    { id: "all", name: "전체", icon: "🏃" },
    { id: "stability", name: "안정성", icon: "⚡" },
    { id: "neutral", name: "뉴트럴", icon: "🎯" },
    { id: "racing", name: "레이싱", icon: "🏆" }
];

export { shoesData, brands, categories };
