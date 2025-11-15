/**
 * Animated Components - Re-export from animated directory
 * This file maintains backward compatibility while components are split into separate files
 */

export { AnimatedCard } from './animated/AnimatedCard';
export { AnimatedButton } from './animated/AnimatedButton';
export { AnimatedSkeleton } from './animated/AnimatedSkeleton';
export { AnimatedProgressBar } from './animated/AnimatedProgressBar';
export { AnimatedToast } from './animated/AnimatedToast';
export { AnimationShowcase } from './animated/AnimationShowcase';

import { AnimatedCard } from './animated/AnimatedCard';
import { AnimatedButton } from './animated/AnimatedButton';
import { AnimatedSkeleton } from './animated/AnimatedSkeleton';
import { AnimatedProgressBar } from './animated/AnimatedProgressBar';
import { AnimatedToast } from './animated/AnimatedToast';
import { AnimationShowcase } from './animated/AnimationShowcase';

const AnimatedComponents = {
  AnimatedCard,
  AnimatedButton,
  AnimatedSkeleton,
  AnimatedProgressBar,
  AnimatedToast,
  AnimationShowcase,
};

export default AnimatedComponents;
