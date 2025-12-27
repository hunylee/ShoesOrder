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
                                <div className="logo-text">Japan Running</div>
                                <div className="logo-sub">일본 러닝화 전문</div>
                            </div>
                        </a>
                        <p>일본 현지의 프리미엄 러닝화를 합리적인 가격에 만나보세요. 한정판과 발볼 넓은 제품을 전문으로 취급합니다.</p>
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
                    <p>© 2024 Japan Running. All rights reserved. | 일본 러닝화 해외 구매 대행 플랫폼</p>
                </div>
            </div>
        </footer>
    );
}
