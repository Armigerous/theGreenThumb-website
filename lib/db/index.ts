// Reason: New database index file using Prisma ORM instead of Drizzle
export { prisma as db } from './prisma'
export { default as prisma } from './prisma'
export type { Prisma } from '../generated/prisma'
