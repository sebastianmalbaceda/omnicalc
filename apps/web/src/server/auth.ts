/**
 * @omnicalc/web — Auth Configuration
 *
 * Better Auth setup with Prisma adapter.
 */

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@omnicalc/db';

const prisma = new PrismaClient();

const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  trustedOrigins: [
    'http://localhost:8081',
    'http://localhost:19006',
    'exp://localhost:8081',
    (process.env.APP_URL as string) || 'http://localhost:3000',
  ],
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: Object.keys(socialProviders).length > 0 ? socialProviders : undefined,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Auth = typeof auth;
