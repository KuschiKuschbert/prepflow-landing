/**
 * UI Component Exports
 *
 * Centralized exports for reusable UI components.
 * This file makes it easier to import components throughout the application.
 */

// Landing Page Components (for webapp use)

// Standard UI Components

/**
 * Landing Page Components Usage in Webapp
 *
 * These components are designed for landing pages but can be used in the webapp
 * for enhanced user-facing elements (headers, CTAs, empty states).
 *
 * @example
 * ```tsx
 * import { MagneticButton, GlowCard, ScrollReveal, EmptyState, WebappBackground } from '@/components/ui';
 *
 * // Use WebappBackground for enhanced pages
 * <WebappBackground spotlight={true} grid={true} />
 *
 * // Use MagneticButton for primary CTAs
 * <MagneticButton onClick={handleClick}>Get Started</MagneticButton>
 *
 * // Use GlowCard for feature showcases
 * <GlowCard glowColor="#29E7CD">
 *   <FeatureContent />
 * </GlowCard>
 *
 * // Use ScrollReveal for entrance animations
 * <ScrollReveal variant="fade-up">
 *   <SectionContent />
 * </ScrollReveal>
 *
 * // Use EmptyState for user guidance
 * <EmptyState
 *   title="No items found"
 *   message="Start by adding your first item"
 *   useLandingStyles={true}
 * />
 * ```
 *
 * @see docs/WEBAPP_LANDING_STYLE_USAGE.md for detailed usage guidelines
 */

// Notification primitives
