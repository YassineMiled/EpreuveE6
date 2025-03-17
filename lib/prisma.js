import { PrismaClient } from '@prisma/client';

// Éviter de créer plusieurs instances de PrismaClient
const globalForPrisma = global;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}

export const prisma = globalForPrisma.prisma;