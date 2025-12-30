// Prisma Client Singleton
// 프리즈마 클라이언트 싱글톤

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// DEBUG: Log DATABASE_URL to verify it's loaded correctly
console.log('[Prisma] DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 60) + '...');

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;

