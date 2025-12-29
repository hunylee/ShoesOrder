
import { unifiedCrawler } from '../lib/crawler';
import { syncAllProducts } from '../lib/naver/product-sync';
import { Product, CrawledProduct } from '../types';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    
    // Parse keyword argument
    let keyword = 'running shoes';
    const keywordIndex = args.indexOf('--keyword');
    if (keywordIndex !== -1 && args[keywordIndex + 1]) {
        keyword = args[keywordIndex + 1];
    }

    console.log(`🚀 Starting sourcing process...`);
    console.log(`🔍 Keyword: "${keyword}"`);
    console.log(`🛠 Mode: ${dryRun ? 'DRY-RUN (No upload)' : 'PRODUCTION (Upload to Naver)'}`);

    // 1. Crawl Products
    console.log('\nPlease wait, crawling products from Japanese platforms...');
    const crawlResults = await unifiedCrawler.crawlAll(keyword);
    
    const allCrawledProducts: CrawledProduct[] = [];
    crawlResults.forEach(result => {
        console.log(`✅ [${result.platform}] Found ${result.products.length} products`);
        allCrawledProducts.push(...result.products);
    });

    if (allCrawledProducts.length === 0) {
        console.log('❌ No products found. Exiting.');
        return;
    }

    console.log(`\n✨ Total products found: ${allCrawledProducts.length}`);

    // 2. Map to Application Product Type
    console.log('\n🔄 Mapping products...');
    const productsToSync: Product[] = allCrawledProducts.map((cp, index) => {
        // Exchange rate (Simple approximation, ideally fetch live rate)
        const YEN_TO_KRW = 9.2; 
        const priceKrw = Math.ceil((cp.priceJpy * YEN_TO_KRW) / 100) * 100; // Round to nearest 100
        
        // Commission logic (e.g., 20% + fixed fee)
        const commission = Math.ceil(priceKrw * 0.2);

        return {
            id: `temp-${Date.now()}-${index}`, // Temporary ID
            brand: cp.brand || 'Unknown',
            brandKr: cp.brand || '알수없음', // Translation needed ideally
            name: cp.name,
            nameJp: cp.nameJp,
            description: cp.description || `일본 직구 ${cp.name} 입니다.`,
            priceJpy: cp.priceJpy,
            priceKrw: priceKrw,
            commission: commission,
            isLimitedEdition: false,
            isWideWidth: false, // Detection logic needed
            sizes: cp.sizes || ['250', '260', '270', '280'], // Default sizes if missing
            colors: cp.colors || ['Black', 'White'],
            japanExclusive: false,
            category: 'neutral', // Default
            rating: 0,
            reviews: 0,
            imageUrl: cp.imageUrl,
            tags: ['러닝화', '일본직구', '운동화'],
            sourceUrl: cp.sourceUrl,
            sourcePlatform: cp.platform,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    });

    // 3. Upload to Naver (or Dry Run)
    if (dryRun) {
        console.log('\n🧪 [DRY-RUN] Skipping upload to Naver Smart Store.');
        console.log('Sample mapped product:', JSON.stringify(productsToSync[0], null, 2));
    } else {
        console.log('\n☁️ Uploading to Naver Smart Store...');
        const result = await syncAllProducts(productsToSync);
        
        if (result.success) {
            console.log(`\n✅ Upload Success! Synced: ${result.synced}`);
        } else {
            console.log(`\n⚠️ Upload Completed with Errors.`);
            console.log(`Synced: ${result.synced}, Failed: ${result.failed}`);
            console.log('Errors:', result.errors);
        }
    }
}

main().catch(console.error);
