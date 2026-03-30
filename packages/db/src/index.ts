/**
 * @omnicalc/db
 *
 * Public API — re-exports Prisma client and generated types.
 */

import { PrismaClient } from '@prisma/client';
export type {
  User,
  Session,
  Account,
  Verification,
  Calculation,
  UserSettings,
} from '@prisma/client';

export { prisma } from './client.js';
export { PrismaClient };
