/**
 * Types for PageTipsCard configuration.
 * Uses iconName (string) instead of icon components for serializability.
 */
export const SECTION_ICON_NAMES = ['BookOpen', 'Package', 'UtensilsCrossed'] as const;
export type SectionIconName = (typeof SECTION_ICON_NAMES)[number];

export interface PageTipsSection {
  title: string;
  iconName: SectionIconName;
  description: string;
}

export interface PageTipsConfig {
  pageKey: string;
  title?: string;
  tips?: string[];
  sections?: PageTipsSection[];
  guideId?: string;
  guideStepIndex?: number;
}
