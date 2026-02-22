/**
 * Populate functions (events) test data with runsheet items
 */

import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { addDays, format, subDays } from 'date-fns';
import type { PopulateResults } from './index';

function buildSampleFunctions(customerIds: string[]): Array<{
  name: string;
  type: string;
  start_date: string;
  start_time: string | null;
  end_date: string;
  end_time: string | null;
  same_day: boolean;
  attendees: number;
  customer_id: string | null;
  notes: string | null;
}> {
  const today = new Date();

  return [
    {
      name: 'Parker-Williams Wedding Reception',
      type: 'Wedding',
      start_date: format(addDays(today, 14), 'yyyy-MM-dd'),
      start_time: '14:00',
      end_date: format(addDays(today, 14), 'yyyy-MM-dd'),
      end_time: '23:00',
      same_day: true,
      attendees: 120,
      customer_id: customerIds[2] ?? null,
      notes:
        'Outdoor garden ceremony, indoor reception. 3 vegan + 2 GF guests. Cocktail hour 5-6pm, seated dinner 6:30pm.',
    },
    {
      name: 'Q1 2026 Strategy Summit',
      type: 'Other',
      start_date: format(addDays(today, 7), 'yyyy-MM-dd'),
      start_time: '08:00',
      end_date: format(addDays(today, 8), 'yyyy-MM-dd'),
      end_time: '17:00',
      same_day: false,
      attendees: 85,
      customer_id: customerIds[3] ?? null,
      notes: 'Day 1: Working lunch + afternoon tea. Day 2: Full breakfast, lunch, and gala dinner.',
    },
    {
      name: 'Annual Charity Gala Dinner',
      type: 'Other',
      start_date: format(addDays(today, 45), 'yyyy-MM-dd'),
      start_time: '18:00',
      end_date: format(addDays(today, 45), 'yyyy-MM-dd'),
      end_time: '23:30',
      same_day: true,
      attendees: 200,
      customer_id: customerIds[5] ?? null,
      notes: 'Black-tie event. 5-course degustation menu. Wine pairing required.',
    },
    {
      name: "Lisa's 40th Birthday Celebration",
      type: 'Birthday',
      start_date: format(addDays(today, 21), 'yyyy-MM-dd'),
      start_time: '17:00',
      end_date: format(addDays(today, 21), 'yyyy-MM-dd'),
      end_time: '22:00',
      same_day: true,
      attendees: 50,
      customer_id: customerIds[4] ?? null,
      notes: 'Cocktail party style. Grazing boards + canapes. Cake to be supplied by client.',
    },
    {
      name: 'Harbourview Team Building Weekend',
      type: 'Other',
      start_date: format(subDays(today, 12), 'yyyy-MM-dd'),
      start_time: '09:00',
      end_date: format(subDays(today, 10), 'yyyy-MM-dd'),
      end_time: '15:00',
      same_day: false,
      attendees: 35,
      customer_id: customerIds[1] ?? null,
      notes: 'Casual BBQ day 1, cooking workshop day 2, formal farewell lunch day 3.',
    },
  ];
}

interface RunsheetSeed {
  function_index: number;
  day_number: number;
  item_time: string | null;
  description: string;
  item_type: string;
  position: number;
}

const SAMPLE_RUNSHEET: RunsheetSeed[] = [
  // Wedding (index 0) — single day
  {
    function_index: 0,
    day_number: 1,
    item_time: '14:00',
    description: 'Ceremony begins',
    item_type: 'activity',
    position: 0,
  },
  {
    function_index: 0,
    day_number: 1,
    item_time: '15:00',
    description: 'Cocktail hour & canapes',
    item_type: 'meal',
    position: 1,
  },
  {
    function_index: 0,
    day_number: 1,
    item_time: '16:30',
    description: 'Bridal party photos',
    item_type: 'activity',
    position: 2,
  },
  {
    function_index: 0,
    day_number: 1,
    item_time: '18:00',
    description: 'Seated dinner service',
    item_type: 'meal',
    position: 3,
  },
  {
    function_index: 0,
    day_number: 1,
    item_time: '20:00',
    description: 'Cake cutting & dessert',
    item_type: 'meal',
    position: 4,
  },
  {
    function_index: 0,
    day_number: 1,
    item_time: '21:00',
    description: 'Dancing & bar service',
    item_type: 'activity',
    position: 5,
  },
  // Strategy Summit (index 1) — 2 days
  {
    function_index: 1,
    day_number: 1,
    item_time: '08:00',
    description: 'Registration & coffee',
    item_type: 'setup',
    position: 0,
  },
  {
    function_index: 1,
    day_number: 1,
    item_time: '09:00',
    description: 'Keynote presentation',
    item_type: 'activity',
    position: 1,
  },
  {
    function_index: 1,
    day_number: 1,
    item_time: '12:00',
    description: 'Working lunch',
    item_type: 'meal',
    position: 2,
  },
  {
    function_index: 1,
    day_number: 1,
    item_time: '15:00',
    description: 'Afternoon tea',
    item_type: 'meal',
    position: 3,
  },
  {
    function_index: 1,
    day_number: 2,
    item_time: '07:30',
    description: 'Breakfast buffet',
    item_type: 'meal',
    position: 0,
  },
  {
    function_index: 1,
    day_number: 2,
    item_time: '09:00',
    description: 'Breakout sessions',
    item_type: 'activity',
    position: 1,
  },
  {
    function_index: 1,
    day_number: 2,
    item_time: '12:30',
    description: 'Lunch service',
    item_type: 'meal',
    position: 2,
  },
  {
    function_index: 1,
    day_number: 2,
    item_time: '18:00',
    description: 'Gala dinner',
    item_type: 'meal',
    position: 3,
  },
  // Charity Gala (index 2) — single day
  {
    function_index: 2,
    day_number: 1,
    item_time: '17:00',
    description: 'Venue setup & sound check',
    item_type: 'setup',
    position: 0,
  },
  {
    function_index: 2,
    day_number: 1,
    item_time: '18:00',
    description: 'Guest arrival & drinks',
    item_type: 'activity',
    position: 1,
  },
  {
    function_index: 2,
    day_number: 1,
    item_time: '19:00',
    description: '5-course degustation service',
    item_type: 'meal',
    position: 2,
  },
  {
    function_index: 2,
    day_number: 1,
    item_time: '22:00',
    description: 'Charity auction',
    item_type: 'activity',
    position: 3,
  },
  // Birthday (index 3) — single day
  {
    function_index: 3,
    day_number: 1,
    item_time: '17:00',
    description: 'Setup grazing boards',
    item_type: 'setup',
    position: 0,
  },
  {
    function_index: 3,
    day_number: 1,
    item_time: '17:30',
    description: 'Guests arrive, drinks served',
    item_type: 'activity',
    position: 1,
  },
  {
    function_index: 3,
    day_number: 1,
    item_time: '18:30',
    description: 'Hot canapes round 1',
    item_type: 'meal',
    position: 2,
  },
  {
    function_index: 3,
    day_number: 1,
    item_time: '19:30',
    description: 'Hot canapes round 2',
    item_type: 'meal',
    position: 3,
  },
  {
    function_index: 3,
    day_number: 1,
    item_time: '20:30',
    description: 'Birthday cake (client supplied)',
    item_type: 'activity',
    position: 4,
  },
  // Team Building (index 4) — 3 days
  {
    function_index: 4,
    day_number: 1,
    item_time: '09:00',
    description: 'Welcome & icebreakers',
    item_type: 'activity',
    position: 0,
  },
  {
    function_index: 4,
    day_number: 1,
    item_time: '12:00',
    description: 'Casual BBQ lunch',
    item_type: 'meal',
    position: 1,
  },
  {
    function_index: 4,
    day_number: 1,
    item_time: '14:00',
    description: 'Team activities',
    item_type: 'activity',
    position: 2,
  },
  {
    function_index: 4,
    day_number: 2,
    item_time: '08:00',
    description: 'Breakfast service',
    item_type: 'meal',
    position: 0,
  },
  {
    function_index: 4,
    day_number: 2,
    item_time: '10:00',
    description: 'Cooking workshop',
    item_type: 'activity',
    position: 1,
  },
  {
    function_index: 4,
    day_number: 2,
    item_time: '12:30',
    description: 'Workshop meal',
    item_type: 'meal',
    position: 2,
  },
  {
    function_index: 4,
    day_number: 3,
    item_time: '08:00',
    description: 'Breakfast buffet',
    item_type: 'meal',
    position: 0,
  },
  {
    function_index: 4,
    day_number: 3,
    item_time: '10:00',
    description: 'Final presentations',
    item_type: 'activity',
    position: 1,
  },
  {
    function_index: 4,
    day_number: 3,
    item_time: '12:00',
    description: 'Formal farewell lunch',
    item_type: 'meal',
    position: 2,
  },
];

export async function populateFunctions(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
  customerIds: string[],
): Promise<void> {
  try {
    const sampleFunctions = buildSampleFunctions(customerIds);

    const { data: functions, error: funcError } = await supabaseAdmin
      .from('functions')
      .insert(sampleFunctions)
      .select('id');

    if (funcError) {
      logger.error('[Populate Functions] Error inserting functions:', {
        error: funcError.message,
        code: funcError.code,
      });
      results.errors.push({ table: 'functions', error: funcError.message });
      return;
    }

    const funcCount = functions?.length ?? 0;
    results.populated.push({ table: 'functions', count: funcCount });
    logger.dev(`✅ Populated ${funcCount} functions`);

    if (functions && functions.length > 0) {
      const runsheetToInsert = SAMPLE_RUNSHEET.map(seed => ({
        function_id: functions[seed.function_index].id,
        day_number: seed.day_number,
        item_time: seed.item_time,
        description: seed.description,
        item_type: seed.item_type,
        position: seed.position,
      }));

      const { error: runsheetError } = await supabaseAdmin
        .from('function_runsheet_items')
        .insert(runsheetToInsert);

      if (runsheetError) {
        logger.warn('[Populate Functions] Error inserting runsheet items:', {
          error: runsheetError.message,
        });
        results.errors.push({ table: 'function_runsheet_items', error: runsheetError.message });
      } else {
        results.populated.push({
          table: 'function_runsheet_items',
          count: runsheetToInsert.length,
        });
        logger.dev(`✅ Populated ${runsheetToInsert.length} runsheet items`);
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('[Populate Functions] Unexpected error:', { error: msg });
    results.errors.push({ table: 'functions', error: msg });
  }
}
