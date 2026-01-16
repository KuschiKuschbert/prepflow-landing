import { auth0 } from '@/lib/auth0';
import { NextRequest } from 'next/server';

export const GET = (req: NextRequest) => (auth0 as unknown).handler(req);
export const POST = (req: NextRequest) => (auth0 as unknown).handler(req);
