import { NextRequest, NextResponse } from 'next/server';
import { sendSampleDashboardEmail } from '../../../lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // Validate input
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Send the email
    const success = await sendSampleDashboardEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      type: 'sample_dashboard',
    });

    if (success) {
      return NextResponse.json(
        {
          success: true,
          message: 'Sample dashboard email sent successfully',
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
