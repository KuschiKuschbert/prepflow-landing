import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { generatePrintTemplate } from '@/lib/exports/print-template';
import { getLogoBase64 } from '@/lib/exports/pdf-template/helpers/getLogoServer';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import type { ExportTheme } from '@/lib/exports/themes';
import { buildRunsheetContent } from './helpers/buildRunsheetContent';
import { validateNotesAgainstRunsheet } from './helpers/validateNotesAgainstRunsheet';

const VALID_THEMES: ExportTheme[] = [
  'cyber-carrot',
  'electric-lemon',
  'phantom-pepper',
  'cosmic-blueberry',
];

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId, supabase } = await getAuthenticatedUser(req);

    const { searchParams } = new URL(req.url);
    const dayParam = searchParams.get('day');
    const themeParam = searchParams.get('theme');

    const theme: ExportTheme =
      themeParam && VALID_THEMES.includes(themeParam as ExportTheme)
        ? (themeParam as ExportTheme)
        : 'cyber-carrot';

    const { data: appFunction, error: funcError } = await supabase
      .from('functions')
      .select(
        `
        *,
        customers (first_name, last_name, company, phone, email)
      `,
      )
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (funcError || !appFunction) {
      return NextResponse.json({ error: 'Function not found' }, { status: 404 });
    }

    let itemsQuery = supabase
      .from('function_runsheet_items')
      .select(
        `
        *,
        menus ( id, menu_name, menu_type ),
        dishes ( id, dish_name, selling_price, is_vegetarian, is_vegan, allergens ),
        recipes ( id, recipe_name, is_vegetarian, is_vegan, allergens )
      `,
      )
      .eq('function_id', id)
      .order('day_number', { ascending: true })
      .order('position', { ascending: true });

    if (dayParam) {
      itemsQuery = itemsQuery.eq('day_number', parseInt(dayParam));
    }

    const { data: items, error: itemsError } = await itemsQuery;

    if (itemsError) {
      logger.error('Error fetching runsheet items for export:', { error: itemsError });
      return NextResponse.json({ error: 'Failed to fetch runsheet data' }, { status: 500 });
    }

    const validation = validateNotesAgainstRunsheet(appFunction.notes, items || []);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'allergen_notes_conflict',
          conflicts: validation.conflicts,
          message:
            'Event notes mention dietary/allergen requirements that conflict with runsheet meals. Please update your notes or change the menu to comply.',
        },
        { status: 422 },
      );
    }

    const dayNumber = dayParam ? parseInt(dayParam) : null;
    const { content, title, subtitle } = buildRunsheetContent(
      appFunction as Parameters<typeof buildRunsheetContent>[0],
      (items || []) as Parameters<typeof buildRunsheetContent>[1],
      dayNumber,
    );

    const html = generatePrintTemplate({
      title,
      subtitle,
      content,
      variant: 'runsheet',
      theme,
      logoSrc: getLogoBase64(),
    });

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    logger.error('Error in GET /api/functions/[id]/export:', { error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
