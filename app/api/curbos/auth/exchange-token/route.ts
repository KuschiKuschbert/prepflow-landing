import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const AUTH0_JWKS_URL = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(AUTH0_JWKS_URL));

const itemSchema = z.object({
  id_token: z.string(),
});

/**
 * Exchange Auth0 ID Token for Supabase Session
 * @param req Request containing id_token
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = itemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        ApiErrorHandler.createError('Missing id_token', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const { id_token } = result.data;

    // 1. Verify Auth0 ID Token
    // Allow both canonical and custom domain issuers
    const acceptedIssuers = [
      `https://${process.env.AUTH0_DOMAIN}/`,
      'https://auth.prepflow.org/',
      'https://dev-7myakdl4itf644km.us.auth0.com/',
    ];

    const { payload } = await jwtVerify(id_token, JWKS, {
      issuer: acceptedIssuers,
      audience: process.env.AUTH0_CLIENT_ID,
    });

    const email = payload.email as string;
    const sub = payload.sub as string; // Auth0 User ID

    if (!email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Email missing from token', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    logger.info('[Auth Bridge] Exchanging token for:', { email, sub });

    const supabaseAdmin = createSupabaseAdmin();

    // 2. Ensure User Exists in Supabase auth.users
    const {
      data: { users },
      error: listLogsError,
    } = await supabaseAdmin.auth.admin.listUsers();

    if (listLogsError) throw listLogsError;

    let user: any = users.find(u => u.email === email);

    if (!user) {
      // Create user if they don't exist
      logger.info('[Auth Bridge] Creating new user for:', email);
      const {
        data: { user: newUser },
        error: createError,
      } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          auth0_sub: sub,
          full_name: payload.name as string,
          avatar_url: payload.picture as string,
        },
      });

      if (createError) throw createError;
      user = newUser;
    }

    // 3. Generate a magic link for established session
    const { data: otpData, error: otpError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (otpError) throw otpError;

    return NextResponse.json({
      success: true,
      email: email,
      user_id: user?.id,
      token_hash: otpData.properties.hashed_token,
      magic_link: otpData.properties.action_link,
    });
  } catch (error) {
    logger.error('[Auth Bridge] Exchange failed:', error);
    return NextResponse.json(
      ApiErrorHandler.fromException(error instanceof Error ? error : new Error(String(error))),
      { status: 500 },
    );
  }
}
