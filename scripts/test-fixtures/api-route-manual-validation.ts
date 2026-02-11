import { NextResponse } from 'next/server';
import { z } from 'zod';

const db = { create: async (d: unknown) => d };

const postSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();

  const validation = postSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: 'Invalid data',
        details: validation.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  // Some other logic
  const user = await db.create({ email: body.email });

  return NextResponse.json({ success: true, user });
}

const putSchema = z.object({
  id: z.string(),
});

export async function PUT(req: Request) {
  const body = await req.json();

  const validation = putSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: 'Invalid data',
        details: validation.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json({ updated: true });
}
