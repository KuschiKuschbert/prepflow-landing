import { PostgrestError } from '@supabase/supabase-js';
import { MenuItem } from '../../helpers/schemas';

export interface FetchResult {
  items: Partial<MenuItem>[];
  pricingError: PostgrestError | null;
  dietaryError: PostgrestError | null;
  descriptionError: PostgrestError | null;
}
