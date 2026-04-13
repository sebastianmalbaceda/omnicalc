import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@omnicalc/db';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

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
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:19006',
    'http://localhost:8081',
    process.env.APP_URL as string,
    process.env.MARKETING_URL as string,
  ].filter(Boolean),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: Object.keys(socialProviders).length > 0 ? socialProviders : undefined,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
});

@Injectable()
export class AuthService {
  async proxyToAuthHandler(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    const url = this.buildWebUrl(req);
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value !== undefined) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    });

    const body = (req as unknown as Record<string, unknown>).body;
    const webReq = new Request(url.toString(), {
      method: req.method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const webRes = await auth.handler(webReq);

    res.status(webRes.status);
    webRes.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const buffer = await webRes.arrayBuffer();
    res.send(Buffer.from(buffer));
  }

  async getUserFromSession(req: ExpressRequest): Promise<Record<string, unknown> | null> {
    const url = new URL('http://localhost:3001/api/auth/get-session');
    const headers = new Headers();
    if (req.headers.cookie) headers.set('cookie', req.headers.cookie);
    if (req.headers.authorization)
      headers.set('authorization', req.headers.authorization as string);

    const webReq = new Request(url.toString(), { headers });
    const webRes = await auth.handler(webReq);

    if (webRes.status === 200) {
      const data = await webRes.json();
      return data?.user || null;
    }
    return null;
  }

  private buildWebUrl(req: ExpressRequest): URL {
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:3001';
    const path = req.originalUrl || req.url;
    return new URL(path, `${protocol}://${host}`);
  }
}
