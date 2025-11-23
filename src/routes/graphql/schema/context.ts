import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export interface GraphQlContext {
  prisma: PrismaClient;
}
