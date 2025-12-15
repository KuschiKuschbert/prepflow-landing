/**
 * Template action helpers for roster state.
 */
import type { RosterTemplate } from '../../../types';

export function createTemplateActions(set: any) {
  return {
    setTemplates: (templates: RosterTemplate[]) => set({ templates }),
    setSelectedTemplateId: (templateId: string | null) => set({ selectedTemplateId: templateId }),
  };
}
