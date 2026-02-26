import { ApiErrorHandler } from '@/lib/api-error-handler';
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
      return NextResponse.json(
        ApiErrorHandler.createError('Function not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
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
      logger.error('[Functions Export] Error fetching runsheet items:', { error: itemsError });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch runsheet data', 'FETCH_ERROR', 500),
        { status: 500 },
      );
    }

    const validation = validateNotesAgainstRunsheet(appFunction.notes, items || []);
    if (!validation.valid) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Event notes mention dietary/allergen requirements that conflict with runsheet meals. Please update your notes or change the menu to comply.',
          'ALLERGEN_NOTES_CONFLICT',
          422,
          { conflicts: validation.conflicts },
        ),
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
    logger.error('[Functions Export] GET error:', { error });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal Server Error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
