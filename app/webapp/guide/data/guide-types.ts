/**
 * Type definitions for the guide documentation system.
 * Supports multiple content formats: Three.js, interactive demos, screenshots, videos, and hybrids.
 */

export type GuideFormat = 'text' | 'threejs' | 'interactive' | 'screenshot' | 'video' | 'hybrid';

export type GuideCategory = 'onboarding' | 'workflow' | 'reference';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type HighlightType = 'pulse' | 'outline' | 'overlay';

export type ArrowDirection = 'up' | 'down' | 'left' | 'right';

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  format: GuideFormat;
  content: GuideContent;
  duration?: number; // Estimated time in seconds
}

export interface GuideContent {
  threejs?: ThreeJSContent;
  interactive?: InteractiveContent;
  screenshot?: ScreenshotContent;
  video?: VideoContent;
}

export interface ThreeJSContent {
  scene: string; // Scene file path or config
  camera?: { position: [number, number, number]; target: [number, number, number] };
  annotations?: Array<{ position: [number, number, number]; text: string }>;
}

export interface InteractiveContent {
  targetSelector: string; // CSS selector for element to highlight
  highlightType: HighlightType;
  actions?: Array<{ type: 'click' | 'type' | 'scroll'; target: string; value?: string }>;
}

export interface ScreenshotContent {
  image: string; // Image path
  annotations?: Array<{ x: number; y: number; text: string; arrow?: ArrowDirection }>;
  hotspots?: Array<{ x: number; y: number; radius: number; info: string }>;
}

export interface VideoContent {
  src: string; // Video URL
  poster?: string; // Thumbnail
  chapters?: Array<{ time: number; title: string }>;
}

/** Lucide icon names for guide cards. Must match GUIDE_ICON_MAP in GuideNavigation. */
export type GuideIconName =
  | 'Rocket'
  | 'FilePen'
  | 'DollarSign'
  | 'Thermometer'
  | 'ClipboardCheck'
  | 'Truck'
  | 'FileText'
  | 'ClipboardList'
  | 'Package2'
  | 'UtensilsCrossed'
  | 'Users'
  | 'Sparkles'
  | 'CalendarDays'
  | 'Settings'
  | 'LayoutPanelLeft';

export interface Guide {
  id: string;
  title: string;
  category: GuideCategory;
  description: string;
  iconName?: GuideIconName;
  steps: GuideStep[];
  estimatedTime?: number; // Estimated time in seconds
  difficulty?: Difficulty;
  relatedGuideIds?: string[];
}
