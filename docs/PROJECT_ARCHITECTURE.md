# PrepFlow Project Architecture

## 🎯 Project Overview

PrepFlow is a unified restaurant profitability optimization platform that helps cafés, restaurants, and food trucks analyze their menu costs, calculate COGS, and optimize gross profit margins. The platform combines a marketing landing page with a comprehensive webapp featuring subscription-based access.

**Target Market:** Independent restaurants, cafés, food trucks in Australia and globally
**Primary Goal:** Convert visitors into customers through lead generation and subscription sales
**Business Model:** Subscription-based SaaS ($29/month AUD) with 7-day free trial
**Platform:** Unified Next.js webapp with future React Native mobile apps

## 🏗️ Technical Architecture

### Framework & Stack

- **Frontend:** Next.js 16.0.0 with React 19 (App Router)
- **Styling:** Tailwind CSS 4 with custom CSS variables
- **Analytics:** Google Analytics 4, Google Tag Manager, Vercel Analytics
- **Deployment:** Vercel platform
- **Payment:** Stripe integration
- **Database:** Supabase PostgreSQL
- **Authentication:** NextAuth + Auth0 (user authentication), Supabase (database only)
- **Email:** Resend integration
- **Mobile:** React Native + Expo (future)

### Key Components

- **Analytics Stack:** ScrollTracker, GoogleAnalytics, GoogleTagManager
- **GTM Integration:** GoogleTagManager with data layer management
- **SEO Components:** Structured data, meta tags, OpenGraph
- **UI Components:** Custom Button, Card, and form components
- **UX Components:** LoadingSkeleton, ModernNavigation, ScrollToTop, ScrollProgress

### File Structure

```
app/
├── layout.tsx          # Root layout with metadata and analytics
├── page.tsx            # Main landing page
├── components/landing/  # Landing page components
│   ├── Hero.tsx        # Hero section
│   ├── TourModal.tsx   # Tour modal component
│   ├── LandingHeader.tsx # Landing page header
│   ├── LandingFooter.tsx # Landing page footer
│   ├── LandingPageClient.tsx # Main landing page orchestrator
│   ├── Highlights.tsx # Key features
│   ├── CloserLook.tsx # Feature details
│   ├── Performance.tsx # Performance metrics
│   ├── TechnicalSpecs.tsx # Capabilities overview
│   ├── FinalCTA.tsx   # Final call-to-action
│   ├── ExitIntentPopup.tsx # Exit intent lead capture
│   └── sections/       # Landing page sections
│       └── HowItWorksSection.tsx # Add → Analyze → Act
├── webapp/             # Protected webapp area
│   ├── page.tsx        # Main dashboard
│   ├── layout.tsx      # WebApp layout with navigation
│   ├── ingredients/    # Stock management
│   ├── recipes/        # Recipe management
│   ├── cogs/           # COG calculator
│   ├── performance/    # Performance analysis
│   ├── temperature/    # Temperature monitoring
│   ├── cleaning/       # Cleaning management
│   ├── compliance/     # Compliance records
│   ├── suppliers/      # Supplier management
│   ├── sections/  # Menu sections
│   ├── dish-builder/   # Dish builder interface
│   ├── menu-builder/   # Menu builder interface
│   ├── par-levels/     # Par level management
│   ├── order-lists/    # Order lists
│   ├── prep-lists/     # Prep lists
│   ├── ai-specials/    # AI specials
│   ├── recipe-sharing/ # Recipe sharing
│   ├── settings/       # User settings
│   ├── setup/          # Database setup
│   └── components/     # WebApp components
│       ├── ModernNavigation.tsx # Main navigation
│       ├── DashboardStatsClient.tsx
│       ├── DraftRecovery.tsx
│       └── navigation/ # Navigation components
├── api/                # API routes
│   ├── auth/           # NextAuth authentication endpoints
│   ├── billing/        # Stripe billing
│   ├── ingredients/    # Ingredients CRUD
│   ├── recipes/        # Recipes CRUD
│   ├── dashboard/      # Dashboard APIs
│   ├── performance/    # Performance analysis
│   ├── temperature-*/  # Temperature endpoints
│   ├── cleaning-*/     # Cleaning endpoints
│   ├── compliance-*/   # Compliance endpoints
│   ├── suppliers/      # Supplier endpoints
│   ├── db/             # Database management
│   └── webhook/        # Webhook handlers
└── globals.css         # Global styles and CSS variables

components/
├── ui/                 # Universal UI components
│   ├── Button.tsx      # Universal button component
│   ├── Card.tsx        # Universal card component
│   ├── LoadingSkeleton.tsx # Loading skeleton components
│   ├── ErrorBoundary.tsx # Error boundary component
│   ├── ScrollToTop.tsx # Scroll to top button
│   ├── ScrollProgress.tsx # Scroll progress indicator
│   ├── Icon.tsx        # Standardized icon wrapper
│   ├── TablePagination.tsx # Table pagination component
│   ├── ExitIntentPopup.tsx # Exit intent lead capture
│   └── animated/       # Animated UI components
│       ├── AnimatedCard.tsx
│       ├── AnimatedButton.tsx
│       ├── AnimatedSkeleton.tsx
│       ├── AnimatedProgressBar.tsx
│       ├── AnimatedToast.tsx
│       └── AnimationShowcase.tsx
├── variants/           # A/B testing variant components
│   ├── HeroVariants.tsx # Hero section variants (orchestrator)
│   ├── HeroContent.tsx # Hero content rendering (title, subtitle)
│   ├── HeroBullets.tsx # Hero bullet points rendering
│   ├── HeroCTA.tsx     # Hero call-to-action buttons
│   ├── HeroImageGallery.tsx # Hero image gallery section
│   └── PricingVariants.tsx # Pricing section variants
├── GoogleAnalytics.tsx # GA4 integration
├── GoogleTagManager.tsx # GTM integration
├── ScrollTracker.tsx   # Scroll depth tracking
├── ExitIntentPopup.tsx # Exit intent lead capture popup
├── Arcade/             # Arcade/easter eggs
│   ├── GameScoreboard.tsx
│   ├── NavbarStats.tsx
│   └── WebAppBackground.tsx
├── EasterEggs/         # Easter egg games
│   ├── TomatoToss.tsx
│   ├── Confetti.tsx
│   └── useTomatoTossGame.ts
├── ErrorGame/          # Error page games
│   ├── KitchenOnFire.tsx
│   └── useKitchenFireGame.ts
└── Loading/            # Loading components
    ├── CatchTheDocket.tsx
    ├── CatchTheDocketOverlay.tsx
    └── useCatchTheDocket.ts

lib/
├── supabase.ts         # Supabase client (database only)
├── auth-options.ts    # NextAuth configuration
├── stripe.ts           # Payment integration
├── analytics.ts        # Analytics service
├── constants.ts        # Centralized app constants (SSOT)
├── rsi/                # Recursive Self-Improvement System
│   ├── architecture-analysis/ # Anti-pattern detection
│   ├── auto-refactoring/      # Automated code improvement
│   ├── predictive-analysis/   # Future debt prediction
│   └── error-learning/        # Runtime error learning
├── cache/              # Caching utilities
│   ├── data-cache.ts   # Generic data cache
│   ├── prefetch-config.ts # Prefetch configuration
│   └── recipe-cache.ts # Recipe-specific cache
├── api/                # API utilities
│   └── batch-utils.ts  # Batch fetching utilities
├── ingredients/        # Ingredient data normalization utilities
│   ├── normalizeIngredientData.ts      # Core parsing and unit normalization
│   ├── buildInsertData.ts              # Data builder for database inserts
│   └── normalizeIngredientDataMain.ts # Main orchestrator function
├── personality/        # Personality system
└── populate-helpers/    # Data population helpers

hooks/
├── useAutosave.ts      # Autosave hook
├── useParallelFetch.ts # Parallel fetching hook
├── useSessionTimeout.ts # Session timeout hook
└── ...                 # Additional hooks as needed

types/
├── auth.ts             # Authentication types
├── dashboard.ts        # Dashboard types
└── subscription.ts    # Subscription types

mobile/                 # React Native app (future)
├── App.tsx
├── components/
└── screens/
```

## 🏗️ Unified Architecture

### Platform Strategy

- **Web-First Development:** Build for web with mobile-ready components
- **Universal Components:** Create components that work on web and mobile
- **Shared Business Logic:** Core functionality shared across platforms
- **Progressive Enhancement:** Start with web, add mobile capabilities

### Authentication Flow

- **NextAuth + Auth0:** User authentication via NextAuth with Auth0 provider
- **Supabase:** Database only (PostgreSQL) - not used for user authentication
- **Session Management:** Secure token storage and refresh via NextAuth
- **Allowlist Enforcement:** Middleware enforces email allowlist on `/webapp/**` and `/api/**` routes
- **Role-Based Access:** User and admin permissions managed via Auth0

### Subscription Management

- **Stripe Integration:** Payment processing and subscription management
- **Paywall System:** Protect premium features behind subscription
- **Trial Period:** 7-day free trial for new users
- **Billing Management:** User dashboard for subscription management

## Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dulkrqgjfohsuxhsmofo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email Service
RESEND_API_KEY=re_hpumY9K8_HhSnL3T4DMXqsnHZpkNGzjQv
FROM_EMAIL=hello@prepflow.org
FROM_NAME=PrepFlow Team
```

## Database Tables Required

1. **ingredients** - Ingredient inventory with cost data
2. **recipes** - Recipe management with instructions
3. **recipe_ingredients** - Recipe-ingredient relationships
4. **menu_dishes** - Menu items with selling prices
5. **users** - User management with subscriptions

## See Also

- [API Endpoints Reference](API_ENDPOINTS.md) - Complete API documentation
- [Feature Implementation Guide](FEATURE_IMPLEMENTATION.md) - Implementation details
- [Auth & Billing Setup](AUTH0_STRIPE_REFERENCE.md) - Authentication and billing configuration
- [Development Standards](.cursor/rules/development.mdc) - Development guidelines
