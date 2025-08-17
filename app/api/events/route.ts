import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Local event tracking endpoint
export async function POST(request: NextRequest) {
  try {
    // In production, avoid filesystem writes in serverless environments
    if (process.env.NODE_ENV !== 'development') {
      return new NextResponse(null, { status: 204 });
    }
    const body = await request.json();
    
    // Validate event data
    if (!body.event || !body.properties?.experiment || !body.properties?.variant) {
      return NextResponse.json(
        { error: 'Invalid event data' },
        { status: 400 }
      );
    }

    // Create events directory if it doesn't exist
    const eventsDir = join(process.cwd(), '.data');
    try {
      await mkdir(eventsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Format event as JSONL
    const eventLine = JSON.stringify({
      ...body,
      timestamp: body.timestamp || Date.now(),
      server_timestamp: Date.now(),
      user_agent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    }) + '\n';

    // Append to events file
    const eventsFile = join(eventsDir, 'events.ndjson');
    await writeFile(eventsFile, eventLine, { flag: 'a' });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve events (for dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const experiment = searchParams.get('experiment');
    const variant = searchParams.get('variant');
    const days = parseInt(searchParams.get('days') || '7');
    
    // In a real implementation, you'd read from the events file
    // For now, return mock data structure
    return NextResponse.json({
      message: 'Events endpoint ready',
      filters: { experiment, variant, days },
      note: 'Events are being logged to .data/events.ndjson'
    });
  } catch (error) {
    console.error('Event retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve events' },
      { status: 500 }
    );
  }
}
