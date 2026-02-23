import { auth0 } from '@/lib/auth0';
import { NextRequest } from 'next/server';

/**
 * Auth0 SDK v4 uses middleware() to handle auth routes (login, callback, logout).
 * The middleware delegates to authClient.handler internally.
 * Route handlers must use middleware(), not handler (which is not on Auth0Client).
 */
export const GET = (req: NextRequest) => auth0.middleware(req);
export const POST = (req: NextRequest) => auth0.middleware(req);
