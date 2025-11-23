import { PrismaClient } from '@prisma/client';
import { createLoaders, Loaders } from '../loader/loader.js';

export const prisma = new PrismaClient();

export interface GraphQlContext {
  prisma: PrismaClient;
  loaders: Loaders;
}

export function createContext(prisma: PrismaClient): GraphQlContext {
  return {
    prisma,
    loaders: createLoaders(prisma),
  };
}
