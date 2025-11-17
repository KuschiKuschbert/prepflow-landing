import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

import { logger } from '../../lib/logger';
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Equipment ID is required' },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin.from('temperature_equipment').delete().eq('id', id);

    if (error) {
      logger.error('Error deleting temperature equipment:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete temperature equipment' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Server error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
