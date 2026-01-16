/**
 * Template action helpers for roster state.
 */
import type { RosterTemplate } from '../../../types';

import type { RosterStoreSet } from '../types';

export function createTemplateActions(set: RosterStoreSet) {
  return {
    setTemplates: (templates: RosterTemplate[]) => set({ templates }),
    setSelectedTemplateId: (templateId: string | null) => set({ selectedTemplateId: templateId }),
  };
}
