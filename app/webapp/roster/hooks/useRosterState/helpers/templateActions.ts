/**
 * Template action helpers for roster state.
 */
import type { RosterTemplate } from '@/lib/types/roster';

import type { RosterStoreSet } from '@/lib/types/roster';

export function createTemplateActions(set: RosterStoreSet) {
  return {
    setTemplates: (templates: RosterTemplate[]) => set({ templates }),
    setSelectedTemplateId: (templateId: string | null) => set({ selectedTemplateId: templateId }),
  };
}
