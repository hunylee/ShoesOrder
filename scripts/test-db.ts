// Temporary test script for database connection
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing database connection...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL);

        const count = await prisma.product.count();
        console.log('Product count:', count);

        const products = await prisma.product.findMany({ take: 5 });
        console.log('Products:', products);

    } catch (error) {
        console.error('Database error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
