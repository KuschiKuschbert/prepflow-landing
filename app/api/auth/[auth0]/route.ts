import { auth0 } from '@/lib/auth0';
import { NextRequest } from 'next/server';

export const GET = (req: NextRequest) => (auth0 as unknown as { handler: (req: NextRequest) => Promise<Response> }).handler(req);
export const POST = (req: NextRequest) => (auth0 as unknown as { handler: (req: NextRequest) => Promise<Response> }).handler(req);
