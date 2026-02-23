/**
 * Central configuration for PageTipsCard content.
 * Used on pages without natural empty states.
 *
 * Uses iconName (string) instead of icon components so config is serializable
 * from Server Components to Client Components.
 */
export {
  SECTION_ICON_NAMES,
  type PageTipsConfig,
  type PageTipsSection,
  type SectionIconName,
} from './page-tips-types';

import type { PageTipsConfig } from './page-tips-types';
import { PAGE_TIPS_GROUP_A } from './page-tips-config/group-a';
import { PAGE_TIPS_GROUP_B } from './page-tips-config/group-b';

export const PAGE_TIPS_CONFIG: Record<string, PageTipsConfig> = {
  ...PAGE_TIPS_GROUP_A,
  ...PAGE_TIPS_GROUP_B,
};
