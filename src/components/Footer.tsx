// Footer Component
// 푸터 컴포넌트

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <a href="/" className="logo">
                            <span className="logo-icon">🏃</span>
                            <div>
                                <div className="logo-text">japanguru</div>
                                <div className="logo-sub">일본 러닝화 구매대행</div>
                            </div>
                        </a>
                        <p>일본 현지의 프리미엄 러닝화를 합리적인 가격에 만나보세요. 한정판과 발볼 넓은 제품을 전문으로 취급합니다.</p>
                        <a
                            href="https://smartstore.naver.com/japanguru"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="smartstore-link"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginTop: '16px',
                                padding: '10px 20px',
                                background: 'linear-gradient(135deg, #03c75a 0%, #00a53c 100%)',
                                color: 'white',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                        >
                            🛒 네이버 스마트스토어 바로가기
                        </a>
                    </div>

                    <div className="footer-column">
                        <h4>브랜드</h4>
                        <ul>
                            <li><a href="#">아식스 (ASICS)</a></li>
                            <li><a href="#">뉴발란스 (New Balance)</a></li>
                            <li><a href="#">미즈노 (Mizuno)</a></li>
                            <li><a href="#">써코니 (Saucony)</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>카테고리</h4>
                        <ul>
                            <li><a href="#">한정판</a></li>
                            <li><a href="#">발볼 넓은 러닝화</a></li>
                            <li><a href="#">레이싱 슈즈</a></li>
                            <li><a href="#">안정성 러닝화</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>고객지원</h4>
                        <ul>
                            <li><a href="#">구매대행 안내</a></li>
                            <li><a href="#">배송/반품 정책</a></li>
                            <li><a href="#">사이즈 가이드</a></li>
                            <li><a href="#">자주 묻는 질문</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2024 japanguru. All rights reserved. | 일본 러닝화 해외 구매 대행 플랫폼</p>
                    <p style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
                        📍 네이버 스마트스토어: <a href="https://smartstore.naver.com/japanguru" target="_blank" rel="noopener noreferrer" style={{ color: '#03c75a' }}>smartstore.naver.com/japanguru</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
