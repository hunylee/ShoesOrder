// Web Crawler for Japanese Shopping Platforms
// Playwright 기반 웹 크롤러 (라쿠텐, 야후재팬, 아마존재팬, 메루카리)

import { chromium, Browser, Page } from 'playwright';
import { CrawledProduct } from '@/types';

// 크롤러 설정
const CRAWLER_CONFIG = {
    timeout: parseInt(process.env.CRAWLER_TIMEOUT || '30000'),
    headless: process.env.CRAWLER_HEADLESS !== 'false',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

// 기본 크롤러 클래스
export class BaseCrawler {
    protected browser: Browser | null = null;
    protected page: Page | null = null;

    async init(): Promise<void> {
        this.browser = await chromium.launch({
            headless: CRAWLER_CONFIG.headless,
        });
        const context = await this.browser.newContext({
            userAgent: CRAWLER_CONFIG.userAgent,
            locale: 'ja-JP',
        });
        this.page = await context.newPage();
        this.page.setDefaultTimeout(CRAWLER_CONFIG.timeout);
    }

    async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }

    protected delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 라쿠텐 크롤러
export class RakutenCrawler extends BaseCrawler {
    private baseUrl = 'https://search.rakuten.co.jp/search/mall/';

    async crawl(keyword: string): Promise<CrawledProduct[]> {
        const products: CrawledProduct[] = [];

        try {
            await this.init();
            if (!this.page) throw new Error('Page not initialized');

            const searchUrl = `${this.baseUrl}${encodeURIComponent(keyword)}/`;
            await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
            await this.delay(2000);

            // 상품 목록 추출
            const items = await this.page.$$('.searchresultitem');

            for (const item of items.slice(0, 20)) { // 최대 20개
                try {
                    const nameEl = await item.$('.title a');
                    const priceEl = await item.$('.important');
                    const imageEl = await item.$('img');
                    const linkEl = await item.$('.title a');

                    const name = await nameEl?.textContent() || '';
                    const priceText = await priceEl?.textContent() || '0';
                    const imageUrl = await imageEl?.getAttribute('src') || '';
                    const sourceUrl = await linkEl?.getAttribute('href') || '';

                    // 가격 파싱 (숫자만 추출)
                    const priceJpy = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

                    if (name && priceJpy > 0) {
                        products.push({
                            name: name.trim(),
                            nameJp: name.trim(),
                            priceJpy,
                            imageUrl,
                            sourceUrl,
                            platform: 'rakuten',
                        });
                    }
                } catch (e) {
                    console.error('Item parsing error:', e);
                }
            }
        } catch (error) {
            console.error('Rakuten crawl error:', error);
        } finally {
            await this.close();
        }

        return products;
    }
}

// 야후재팬 크롤러
export class YahooCrawler extends BaseCrawler {
    private baseUrl = 'https://shopping.yahoo.co.jp/search?p=';

    async crawl(keyword: string): Promise<CrawledProduct[]> {
        const products: CrawledProduct[] = [];

        try {
            await this.init();
            if (!this.page) throw new Error('Page not initialized');

            const searchUrl = `${this.baseUrl}${encodeURIComponent(keyword)}`;
            await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
            await this.delay(2000);

            // 상품 목록 추출 (Yahoo Shopping의 CSS는 자주 변경됨)
            const items = await this.page.$$('[data-product-id]');

            for (const item of items.slice(0, 20)) {
                try {
                    const nameEl = await item.$('a[data-ylk]');
                    const priceEl = await item.$('[class*="Price"]');
                    const imageEl = await item.$('img');

                    const name = await nameEl?.textContent() || '';
                    const sourceUrl = await nameEl?.getAttribute('href') || '';
                    const priceText = await priceEl?.textContent() || '0';
                    const imageUrl = await imageEl?.getAttribute('src') || '';

                    const priceJpy = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

                    if (name && priceJpy > 0) {
                        products.push({
                            name: name.trim(),
                            nameJp: name.trim(),
                            priceJpy,
                            imageUrl,
                            sourceUrl,
                            platform: 'yahoo',
                        });
                    }
                } catch (e) {
                    console.error('Item parsing error:', e);
                }
            }
        } catch (error) {
            console.error('Yahoo crawl error:', error);
        } finally {
            await this.close();
        }

        return products;
    }
}

// 아마존재팬 크롤러
export class AmazonCrawler extends BaseCrawler {
    private baseUrl = 'https://www.amazon.co.jp/s?k=';

    async crawl(keyword: string): Promise<CrawledProduct[]> {
        const products: CrawledProduct[] = [];

        try {
            await this.init();
            if (!this.page) throw new Error('Page not initialized');

            const searchUrl = `${this.baseUrl}${encodeURIComponent(keyword)}`;
            await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
            await this.delay(2000);

            // 상품 목록 추출
            const items = await this.page.$$('[data-component-type="s-search-result"]');

            for (const item of items.slice(0, 20)) {
                try {
                    const nameEl = await item.$('h2 a span');
                    const priceWholeEl = await item.$('.a-price-whole');
                    const imageEl = await item.$('.s-image');
                    const linkEl = await item.$('h2 a');

                    const name = await nameEl?.textContent() || '';
                    const priceText = await priceWholeEl?.textContent() || '0';
                    const imageUrl = await imageEl?.getAttribute('src') || '';
                    const href = await linkEl?.getAttribute('href') || '';
                    const sourceUrl = href.startsWith('http') ? href : `https://www.amazon.co.jp${href}`;

                    const priceJpy = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

                    if (name && priceJpy > 0) {
                        products.push({
                            name: name.trim(),
                            nameJp: name.trim(),
                            priceJpy,
                            imageUrl,
                            sourceUrl,
                            platform: 'amazon',
                        });
                    }
                } catch (e) {
                    console.error('Item parsing error:', e);
                }
            }
        } catch (error) {
            console.error('Amazon crawl error:', error);
        } finally {
            await this.close();
        }

        return products;
    }
}

// 메루카리 크롤러
export class MercariCrawler extends BaseCrawler {
    private baseUrl = 'https://jp.mercari.com/search?keyword=';

    async crawl(keyword: string): Promise<CrawledProduct[]> {
        const products: CrawledProduct[] = [];

        try {
            await this.init();
            if (!this.page) throw new Error('Page not initialized');

            const searchUrl = `${this.baseUrl}${encodeURIComponent(keyword)}`;
            await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
            await this.delay(3000); // 메루카리는 JS 렌더링이 더 오래 걸림

            // 상품 목록 추출
            const items = await this.page.$$('[data-testid="item-cell"]');

            for (const item of items.slice(0, 20)) {
                try {
                    const nameEl = await item.$('[data-testid="thumbnail-item-name"]');
                    const priceEl = await item.$('[data-testid="thumbnail-item-price"]');
                    const imageEl = await item.$('img');
                    const linkEl = await item.$('a');

                    const name = await nameEl?.textContent() || '';
                    const priceText = await priceEl?.textContent() || '0';
                    const imageUrl = await imageEl?.getAttribute('src') || '';
                    const href = await linkEl?.getAttribute('href') || '';
                    const sourceUrl = href.startsWith('http') ? href : `https://jp.mercari.com${href}`;

                    const priceJpy = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

                    if (name && priceJpy > 0) {
                        products.push({
                            name: name.trim(),
                            nameJp: name.trim(),
                            priceJpy,
                            imageUrl,
                            sourceUrl,
                            platform: 'mercari',
                        });
                    }
                } catch (e) {
                    console.error('Item parsing error:', e);
                }
            }
        } catch (error) {
            console.error('Mercari crawl error:', error);
        } finally {
            await this.close();
        }

        return products;
    }
}

// 통합 크롤러 인터페이스
export class UnifiedCrawler {
    private rakuten = new RakutenCrawler();
    private yahoo = new YahooCrawler();
    private amazon = new AmazonCrawler();
    private mercari = new MercariCrawler();

    async crawlAll(keyword: string): Promise<{ platform: string; products: CrawledProduct[] }[]> {
        const results = await Promise.allSettled([
            this.crawlPlatform('rakuten', keyword),
            this.crawlPlatform('yahoo', keyword),
            this.crawlPlatform('amazon', keyword),
            this.crawlPlatform('mercari', keyword),
        ]);

        return results
            .filter((r): r is PromiseFulfilledResult<{ platform: string; products: CrawledProduct[] }> =>
                r.status === 'fulfilled'
            )
            .map(r => r.value);
    }

    async crawlPlatform(platform: 'rakuten' | 'yahoo' | 'amazon' | 'mercari', keyword: string): Promise<{ platform: string; products: CrawledProduct[] }> {
        let products: CrawledProduct[] = [];

        switch (platform) {
            case 'rakuten':
                products = await this.rakuten.crawl(keyword);
                break;
            case 'yahoo':
                products = await this.yahoo.crawl(keyword);
                break;
            case 'amazon':
                products = await this.amazon.crawl(keyword);
                break;
            case 'mercari':
                products = await this.mercari.crawl(keyword);
                break;
        }

        return { platform, products };
    }
}

export const unifiedCrawler = new UnifiedCrawler();
