import { PrismaClient } from '../generated/prisma'

// Reason: Global Prisma client instance for database operations
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Reason: Create Prisma client with connection pooling and error handling
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
})

// Reason: Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Reason: Graceful shutdown on process termination
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma
