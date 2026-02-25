'use client';

import dynamic from 'next/dynamic';

export const CatchTheDocketOverlay = dynamic(
  () => import('@/components/Loading/CatchTheDocketOverlay'),
  { ssr: false, loading: () => null },
);

export const SessionTimeoutWarning = dynamic(
  () =>
    import('@/components/webapp/SessionTimeoutWarning').then(mod => ({
      default: mod.SessionTimeoutWarning,
    })),
  { ssr: false, loading: () => null },
);

export const SafeAnimatedBackground = dynamic(
  () => import('@/app/components/landing/SafeAnimatedBackground'),
  { ssr: false, loading: () => null },
);

export const DraftRecovery = dynamic(
  () => import('./DraftRecovery').then(mod => ({ default: mod.DraftRecovery })),
  { ssr: false, loading: () => null },
);

export const PersonalityScheduler = dynamic(
  () =>
    import('./PersonalityScheduler').then(mod => ({
      default: mod.PersonalityScheduler,
    })),
  { ssr: false, loading: () => null },
);

export const AchievementToast = dynamic(
  () => import('./AchievementToast').then(mod => ({ default: mod.AchievementToast })),
  { ssr: false, loading: () => null },
);

export const MilestoneToast = dynamic(
  () =>
    import('@/components/gamification/MilestoneToast').then(mod => ({
      default: mod.MilestoneToast,
    })),
  { ssr: false, loading: () => null },
);

export const WebappBackground = dynamic(
  () => import('@/components/ui/WebappBackground').then(mod => ({ default: mod.WebappBackground })),
  { ssr: false, loading: () => null },
);

export const SafeGradientOrbs = dynamic(() => import('@/app/components/landing/SafeGradientOrbs'), {
  ssr: false,
  loading: () => null,
});

export const BackgroundLogo = dynamic(() => import('@/components/ui/BackgroundLogo'), {
  ssr: false,
  loading: () => null,
});

export const DemoWelcomeToast = dynamic(
  () =>
    import('@/components/demo/DemoWelcomeToast').then(mod => ({
      default: mod.DemoWelcomeToast,
    })),
  { ssr: false },
);
