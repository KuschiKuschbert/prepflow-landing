## Auth, Allowlist, and Billing Setup

**📚 Complete Reference:** See `docs/AUTH0_STRIPE_REFERENCE.md` for comprehensive Auth0 and Stripe configuration, setup, testing, and troubleshooting guide.

### Auth (NextAuth + Auth0)

- Env:
  - `AUTH0_ISSUER_BASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`
  - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- Routes: `/api/auth/[...nextauth]`, `/api/me`
- Middleware enforces allowlist on `/webapp/**` and `/api/**` (except auth routes).
- **Documentation:** See `docs/AUTH0_STRIPE_REFERENCE.md` (Auth0 Configuration section) for complete setup guide

### Allowlist Configuration

- **Option 1: Development Mode** (Default)
  - In development (`NODE_ENV=development`), allowlist is automatically bypassed
  - All authenticated users are allowed
  - No configuration needed

- **Option 2: Disable Allowlist**
  - Set `DISABLE_ALLOWLIST=true` in environment variables
  - All authenticated users can access (useful for testing/friend access)
  - Works in both development and production

- **Option 3: Email Allowlist**
  - `ALLOWED_EMAILS` (comma-separated). Only allowlisted emails can access protected routes.
  - Format: `email1@example.com,email2@example.com,email3@example.com`
  - Unauthorized pages redirect to `/not-authorized`; APIs return 401/403.
  - Most secure option for production

### Shared Workspace

- **Current Configuration**: Shared workspace - all authenticated users access the same data
- **No User Isolation**: All users see and modify the same ingredients, recipes, menu dishes, etc.
- **User Display**: Current user's name/email is displayed in navigation header (desktop only)
- **Use Case**: Testing and friend access - not suitable for production with multiple customers
- **Documentation**: See `docs/FRIEND_ACCESS.md` for detailed configuration and usage instructions

### Billing (Stripe scaffolding)

- Env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER_MONTHLY`, `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_BUSINESS_MONTHLY`
- Endpoints: `/api/billing/create-checkout-session`, `/api/billing/create-portal-session`, `/api/webhook/stripe`
- Entitlements: `lib/tier-config.ts`, `lib/entitlements.ts`, `lib/feature-gate.ts`
- **Documentation:** See `docs/AUTH0_STRIPE_REFERENCE.md` (Stripe Configuration section) for complete setup guide

## Landing v2 (Sign‑in + Tour)

### IA

- Hero: concise value prop; CTAs: Sign in, Register, Tour
- Tour: 3–5 steps (Ingredients → Recipes → COGS → Performance → Temperature)
- Capabilities: 4 cards linking to tour anchors
- How it works: Add → Analyze → Act
- Security: Auth0, Supabase, privacy

### Components

- `app/components/landing/Hero.tsx` - Hero section
- `app/components/landing/TourModal.tsx` - Tour modal component
- `app/components/landing/HowItWorks.tsx` - Process explanation
- `app/components/landing/sections/` - Landing page sections:
  - `BenefitsSection.tsx` - Outcomes section
  - `FeaturesSection.tsx` - Features showcase
  - `FAQSection.tsx` - Frequently asked questions
  - `LeadMagnetSection.tsx` - Email capture form
  - `TrustSection.tsx` - Security and trust features
  - `HowItWorksSection.tsx` - Process explanation
  - `MyStorySection.tsx` - Founder story
  - `ProblemOutcomeSection.tsx` - Problem/solution presentation
  - `PracticeSection.tsx` - Practice examples
  - `ContributingMarginSection.tsx` - Margin contribution explanation
  - `GlobalFeaturesSection.tsx` - Global features showcase

### QA Checklist

- Auth: NextAuth + Auth0 working; allowlist enforced on `/webapp/**` routes
- Tour modal: focus trap, Escape closes, arrows navigate
- Performance: Lighthouse ≥ 90; CLS < 0.1; LCP < 2.5s
- Analytics: tour_open/close, step navigation, CTA clicks

### Landing Page Style System (Cyber Carrot)

**Style System Decision Tree:**

1. **Is this a public marketing page?** → Use landing page styles
2. **Is this an authenticated webapp page?** → Use webapp styles
3. **Is this a conversion-focused component?** → Use landing page styles
4. **Is this a data management interface?** → Use webapp styles

**Landing Page Style Resources:**

- **Style Guide:** `docs/LANDING_PAGE_STYLE_GUIDE.md` - Complete landing page style reference
- **Migration Guide:** `docs/LANDING_STYLE_MIGRATION.md` - Examples and best practices for applying landing styles
- **Style Utilities:** `lib/landing-styles.ts` - Centralized style constants and utilities
- **Design System:** `.cursor/rules/design.mdc` - Landing page style system documentation

**Key Landing Page Components:**

- `components/ui/MagneticButton.tsx` - Interactive button with magnetic hover effect
- `components/ui/GlowCard.tsx` - Card component with radial gradient glow effect
- `components/ui/ScrollReveal.tsx` - Scroll-triggered animation component
- `components/landing/LandingBackground.tsx` - Dynamic background effects system

**When to Use Landing Page Styles:**

- ✅ Marketing pages (`/`, `/pricing`, `/features`, etc.)
- ✅ Public-facing content (landing pages, marketing sections)
- ✅ Conversion-focused components (CTAs, hero sections, feature showcases)
- ✅ Marketing emails and promotional content

**When to Use Webapp Styles:**

- ✅ Authenticated webapp pages (`/webapp/**`)
- ✅ Data-heavy interfaces (tables, forms, dashboards)
- ✅ Internal tools and admin interfaces
- ✅ Functional components (navigation, settings, data management)

**Quick Reference:**

```typescript
// Import style utilities
import {
  LANDING_COLORS,
  LANDING_TYPOGRAPHY,
  LANDING_SPACING,
  getGlowColor,
  getSectionClasses,
} from '@/lib/landing-styles';

// Use landing page components
import { MagneticButton } from '@/components/ui/MagneticButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

// Apply fluid typography
<h2 className="text-fluid-3xl font-bold text-white">Title</h2>

// Structure sections
<section className={getSectionClasses({ padding: 'large' })}>
  <div className="mx-auto max-w-7xl px-6">
    <ScrollReveal variant="fade-up">
      {/* Content */}
    </ScrollReveal>
  </div>
</section>
```

**See Also:**

- `docs/LANDING_PAGE_STYLE_GUIDE.md` - Complete style guide with all patterns
- `docs/LANDING_STYLE_MIGRATION.md` - Migration examples and best practices
- `.cursor/rules/design.mdc` (Landing Page Style System - Cyber Carrot) - Design system documentation

## Development Utilities

- Reset and Seed (dev-only):
  - `POST /api/db/reset` — wipes domain tables in FK-safe order.
  - `POST /api/populate-clean-test-data` — single source of truth to generate all clean test data for the app (ingredients, recipes, suppliers, equipment, cleaning, compliance). Replaces existing data.
  - `POST /api/db/reset-self` — authenticated self-reset that deletes only the current user's data (`user_id` scoped). Supports `?dry=1`. No reseed.
  - Both require header `X-Admin-Key: $SEED_ADMIN_KEY` and are blocked in production.
  - Optional `?dry=1` for a dry-run plan.

### Supabase TypeScript Gotcha (Vercel Build)

- Do not chain `.catch()` on Supabase query builders; they are not Promises until awaited.
- Always use:
  - `const { data, error } = await supabase.from('table').insert(row);`
- Handle `error` explicitly; avoid `.catch()` which breaks type checks on Vercel.

### TypeScript Ref Types (React useRef)

- **MANDATORY**: Always use `RefObject<HTMLElement | null>` when declaring ref types in interfaces or function return types.
- When using `useRef<HTMLElement>(null)`, TypeScript infers the type as `RefObject<HTMLElement | null>`, not `RefObject<HTMLElement>`.
- **Correct pattern:**

  ```typescript
  interface MyHookReturn {
    elementRef: React.RefObject<HTMLDivElement | null>; // ✅ Correct
  }

  const elementRef = useRef<HTMLDivElement>(null); // Returns RefObject<HTMLDivElement | null>
  ```

- **Incorrect pattern:**
  ```typescript
  interface MyHookReturn {
    elementRef: React.RefObject<HTMLDivElement>; // ❌ Causes build errors
  }
  ```
- This prevents TypeScript build errors on Vercel: `Type 'RefObject<HTMLDivElement | null>' is not assignable to type 'RefObject<HTMLDivElement>'`.
- Always check ref types in hook return interfaces and component prop types.

# PrepFlow - AI Agent Instructions

## 🎯 **Project Overview**

PrepFlow is a unified restaurant profitability optimization platform that helps cafés, restaurants, and food trucks analyze their menu costs, calculate COGS, and optimize gross profit margins. The platform combines a marketing landing page with a comprehensive webapp featuring subscription-based access.

**Target Market:** Independent restaurants, cafés, food trucks in Australia and globally
**Primary Goal:** Convert visitors into customers through lead generation and subscription sales
**Business Model:** Subscription-based SaaS ($29/month AUD) with 7-day free trial
**Platform:** Unified Next.js webapp with future React Native mobile apps

## 🏗️ **Technical Architecture**

### **Framework & Stack**

- **Frontend:** Next.js 16.0.0 with React 19 (App Router)
- **Styling:** Tailwind CSS 4 with custom CSS variables
- **Analytics:** Google Analytics 4, Google Tag Manager, Vercel Analytics
- **Deployment:** Vercel platform
- **Payment:** Stripe integration
- **Database:** Supabase PostgreSQL
- **Authentication:** NextAuth + Auth0 (user authentication), Supabase (database only)
- **Email:** Resend integration
- **Mobile:** React Native + Expo (future)

### **Key Components**

- **Analytics Stack:** ScrollTracker, GoogleAnalytics, GoogleTagManager
- **GTM Integration:** GoogleTagManager with data layer management
- **SEO Components:** Structured data, meta tags, OpenGraph
- **UI Components:** Custom Button, Card, and form components
- **UX Components:** LoadingSkeleton, ModernNavigation, ScrollToTop, ScrollProgress

### **File Structure**

```
app/
├── layout.tsx          # Root layout with metadata and analytics
├── page.tsx            # Main landing page
├── components/landing/  # Landing page components
│   ├── Hero.tsx        # Hero section
│   ├── TourModal.tsx   # Tour modal component
│   ├── HowItWorks.tsx  # Process explanation
│   ├── LandingHeader.tsx # Landing page header
│   ├── LandingFooter.tsx # Landing page footer
│   ├── LandingSections.tsx # Section orchestrator
│   ├── FinalCTA.tsx   # Final call-to-action
│   ├── ExitIntentPopup.tsx # Exit intent lead capture
│   └── sections/       # Landing page sections
│       ├── BenefitsSection.tsx
│       ├── FeaturesSection.tsx
│       ├── FAQSection.tsx
│       ├── LeadMagnetSection.tsx
│       ├── TrustSection.tsx
│       ├── HowItWorksSection.tsx
│       ├── MyStorySection.tsx
│       ├── ProblemOutcomeSection.tsx
│       ├── PracticeSection.tsx
│       ├── ContributingMarginSection.tsx
│       └── GlobalFeaturesSection.tsx
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
│   ├── ArcadeMuteButton.tsx
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
├── ab-testing-analytics.ts # A/B testing system
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

## 🏗️ **Unified Architecture**

### **Platform Strategy**

- **Web-First Development:** Build for web with mobile-ready components
- **Universal Components:** Create components that work on web and mobile
- **Shared Business Logic:** Core functionality shared across platforms
- **Progressive Enhancement:** Start with web, add mobile capabilities

### **Authentication Flow**

- **NextAuth + Auth0:** User authentication via NextAuth with Auth0 provider
- **Supabase:** Database only (PostgreSQL) - not used for user authentication
- **Session Management:** Secure token storage and refresh via NextAuth
- **Allowlist Enforcement:** Middleware enforces email allowlist on `/webapp/**` and `/api/**` routes
- **Role-Based Access:** User and admin permissions managed via Auth0

### **Subscription Management**

- **Stripe Integration:** Payment processing and subscription management
- **Paywall System:** Protect premium features behind subscription
- **Trial Period:** 7-day free trial for new users
- **Billing Management:** User dashboard for subscription management

## 📋 **Development Standards**

### **Code Quality Requirements**

- **TypeScript:** Strict typing, no `any` types without justification
  - **Ref Types:** Always use `RefObject<HTMLElement | null>` in interfaces (see TypeScript Ref Types section above)
  - **useRef Pattern:** `useRef<HTMLElement>(null)` returns `RefObject<HTMLElement | null>`, always type accordingly
- **React Patterns:** Functional components with hooks, proper error boundaries
- **Performance:** Lazy loading, image optimization, Core Web Vitals optimization
- **Accessibility:** ARIA labels, semantic HTML, keyboard navigation support
- **SEO:** Proper meta tags, structured data, semantic markup
- **Universal Design:** Components that work on web and mobile

### **Naming Conventions**

- **Files:** kebab-case (e.g., `exit-intent-popup.tsx`)
- **Components:** PascalCase (e.g., `ExitIntentPopup`)
- **Functions:** camelCase with descriptive verbs (e.g., `trackUserEngagement`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `GTM_EVENTS`)
- **CSS Classes:** Tailwind utility classes with custom CSS variables

### **Voice & Tone Standards**

**MANDATORY:** All user-facing text (dialogs, dropdowns, input fields, error messages) must follow PrepFlow's cheeky kitchen humor voice.

**Key Principles:**

- Professional but friendly, kitchen-themed metaphors when appropriate
- Use contractions ("can't", "won't", "you'll") for natural speech
- Clear and direct, avoid technical jargon
- Add personality without being unprofessional

**See Also:**

- `docs/VOICE_ENHANCEMENT_GUIDE.md` - Comprehensive voice enhancement guide with examples for dialogs, dropdowns, and input fields (MANDATORY for all new code)
- `.cursor/rules/dialogs.mdc` - Dialog usage standards and PrepFlow voice guidelines
- `.cursor/rules/development.mdc` - Development standards including voice guidelines

### **Testing Requirements**

- **Unit Tests:** All utility functions and components
- **Integration Tests:** Analytics integration and user flows
- **E2E Tests:** Critical user journeys (lead capture, purchase)
- **Performance Tests:** Core Web Vitals and loading times

## 🔧 **Code Formatting & Quality Tools**

### **Prettier Configuration**

**Status:** ✅ Installed and configured

**Configuration File:** `.prettierrc`

**Settings:**

- **Semi:** `true` (semicolons required)
- **Trailing Comma:** `all` (trailing commas in objects/arrays)
- **Single Quote:** `true` (single quotes for strings)
- **Print Width:** `100` (line length)
- **Tab Width:** `2` (indentation)
- **Use Tabs:** `false` (spaces, not tabs)
- **Bracket Spacing:** `true` (spaces in object literals)
- **Arrow Parens:** `avoid` (omit parens when possible)
- **End of Line:** `lf` (Unix line endings)
- **Plugins:** `prettier-plugin-tailwindcss` (Tailwind class sorting)

**Scripts:**

- `npm run format` - Format entire project
- `npm run format:check` - Check formatting without modifying files
- `npm run format:staged` - Format staged files (via lint-staged)

**Integration:**

- Prettier runs automatically on commit via `lint-staged`
- CI pipeline checks formatting via `format:check`
- All files must be formatted before merging PRs

**Usage:**

```bash
# Format entire project
npm run format

# Check formatting (CI)
npm run format:check

# Format only staged files
npm run format:staged
```

### **ESLint Configuration**

**Configuration File:** `eslint.config.mjs`

**Extends:**

- `next/core-web-vitals` - Next.js recommended rules

**Custom Rules:**

- React compiler rules disabled (set-state-in-effect, purity, refs, preserve-manual-memoization)
- React hooks rules enforced
- Unescaped entities enforced (use `&apos;`, `&quot;`, etc.)

**Scripts:**

- `npm run lint` - Lint entire project
- CI pipeline runs lint on all PRs

## 🚀 **CI/CD & Automation**

### **GitHub Actions CI Workflow**

**File:** `.github/workflows/ci.yml`

**Triggers:**

- Pull requests to `main`
- Pushes to `main`

**Jobs:**

1. **Lint** - Runs `npm run lint`
2. **Type Check** - Runs `npm run type-check`
3. **Format Check** - Runs `npm run format:check`
4. **Build** - Runs `npm run build`

**Requirements:**

- All jobs must pass for PR merge
- Node.js 22 LTS
- Automatic npm cache

**Status:** ✅ Configured and active

### **PR Auto-Labeling**

**File:** `.github/workflows/pr-labels.yml`

**Configuration:** `.github/labeler.yml`

**Labels Applied Automatically:**

- `refactor` - Code refactoring changes
- `bugfix` - Bug fixes
- `ui` - UI/component changes
- `breakpoints` - Responsive/breakpoint changes
- `documentation` - Documentation updates
- `ci` - CI/CD changes
- `codemod` - Codemod transformations
- `config` - Configuration changes
- `api` - API route changes
- `hooks` - React hooks changes
- `types` - TypeScript type changes

**How It Works:**

- Analyzes changed files in PR
- Matches patterns in `.github/labeler.yml`
- Applies appropriate labels automatically
- Runs on PR open, sync, and reopen

**Status:** ✅ Configured and active

### **Automatic CHANGELOG Generation**

**Script:** `scripts/generate-changelog.js`

**Command:** `npm run changelog`

**How It Works:**

- Analyzes git commits since last tag (or all commits)
- Parses Conventional Commits format: `type(scope): subject`
- Groups commits by type (feat, fix, docs, etc.)
- Generates formatted CHANGELOG.md entry

**Commit Types:**

- 🚀 `feat:` - New features
- 🐛 `fix:` - Bug fixes
- 📚 `docs:` - Documentation
- 💎 `style:` - Code style changes
- ♻️ `refactor:` - Code refactoring
- ⚡ `perf:` - Performance improvements
- 🧪 `test:` - Test additions/changes
- 🔧 `chore:` - Maintenance tasks
- ⚙️ `ci:` - CI/CD changes
- 📦 `build:` - Build system changes
- ⏪ `revert:` - Reverted commits

**Output Format:**

```markdown
## [0.1.1] - 2025-01-XX

### 🚀 Features

- New feature description (abc1234)

### 🐛 Fixes

- Bug fix description (def5678)
```

**Usage:**

```bash
# Generate changelog from recent commits
npm run changelog
```

**Status:** ✅ Script created and ready

## 📝 **JSDoc Documentation Standards**

### **JSDoc Requirements**

**MANDATORY:** All public functions, components, and utilities must have JSDoc documentation.

### **JSDoc Template**

````typescript
/**
 * Brief description of what the function/component does.
 *
 * @param {Type} paramName - Description of parameter
 * @param {Type} [optionalParam] - Optional parameter description
 * @returns {ReturnType} Description of return value
 * @throws {ErrorType} When this error is thrown
 *
 * @example
 * ```typescript
 * const result = myFunction('example');
 * console.log(result); // Output description
 * ```
 */
````

### **Component JSDoc Template**

````typescript
/**
 * Component description.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 * @param {Function} props.onClick - Click handler
 * @returns {JSX.Element} Rendered component
 *
 * @example
 * ```tsx
 * <MyComponent title="Hello" onClick={() => {}} />
 * ```
 */
export function MyComponent({ title, onClick }: Props) {
  // ...
}
````

### **Hook JSDoc Template**

````typescript
/**
 * Hook description.
 *
 * @param {Type} param - Parameter description
 * @returns {Object} Hook return value
 * @returns {Type} returns.property - Property description
 *
 * @example
 * ```typescript
 * const { data, loading } = useMyHook('param');
 * ```
 */
export function useMyHook(param: string) {
  // ...
}
````

### **JSDoc Standards**

- **Always document:** Public functions, React components, custom hooks, utility functions
- **Optional:** Private/internal functions (but recommended)
- **Required fields:** Description, @param for all parameters, @returns for return values
- **Optional fields:** @throws, @example, @see, @since, @deprecated
- **Format:** Use TypeScript types in JSDoc (`{string}`, `{Object}`, `{Promise<string>}`)

**Status:** ⚠️ In Progress - Standardization ongoing

## 🔄 **Codemod Rules & Transformations**

### **Codemod System**

**Purpose:** Automated code transformations for deprecated components, patterns, and migrations.

**Implementation:** ✅ Fully implemented using jscodeshift with TypeScript/TSX parser support.

### **Available Codemods**

#### **1. Breakpoint Migration Codemod**

**File:** `scripts/codemods/breakpoint-migration.js`

**Transformations:**

- `sm:` → `tablet:` (481px+)
- `md:` → `tablet:` (481px+)
- `lg:` → `desktop:` (1025px+)

**Handles:**

- String literals in JSX attributes (`className="sm:text-lg"`)
- Template literals in JSX (`className={`sm:text-lg ${var}`}`)
- Object properties (`className: "sm:text-lg"`)
- String concatenations

**Usage:**

```bash
# Dry-run (preview changes)
npm run codemod:breakpoints

# Apply changes
npm run codemod:breakpoints:write
```

#### **2. Console Migration Codemod**

**File:** `scripts/codemods/console-migration.js`

**Transformations:**

- `console.log(...)` → `logger.dev(...)`
- `console.error(...)` → `logger.error(...)`
- `console.warn(...)` → `logger.warn(...)`
- `console.info(...)` → `logger.info(...)`
- `console.debug(...)` → `logger.debug(...)`

**Features:**

- Automatically adds `import { logger } from '@/lib/logger';` if not present
- Preserves all arguments and call structure
- Detects existing logger imports to avoid duplicates

**Usage:**

```bash
# Dry-run (preview changes)
npm run codemod:console

# Apply changes
npm run codemod:console:write
```

#### **3. Run All Codemods**

```bash
# Run both migrations in dry-run mode
npm run codemod:all
```

### **Codemod Execution Workflow**

**Step 1: Preview Changes**

```bash
npm run codemod:breakpoints
npm run codemod:console
```

**Step 2: Review Output**

- Check the diff/preview output
- Verify transformations look correct
- Note any files that will be modified

**Step 3: Apply Changes**

```bash
npm run codemod:breakpoints:write
npm run codemod:console:write
```

**Step 4: Verify & Test**

- Run `npm run lint` to check for issues
- Run `npm run type-check` to verify TypeScript
- Test affected functionality
- Format code: `npm run format`

**Step 5: Commit**

- Commit with `refactor:` prefix
- Example: `refactor: migrate breakpoints and console calls via codemod`

### **Technical Details**

**Dependencies:**

- `jscodeshift` - AST transformation tool
- `@types/jscodeshift` - TypeScript types

**Parser:** Uses `tsx` parser for TypeScript/TSX file support

**File Locations:**

- `scripts/codemods/breakpoint-migration.js`
- `scripts/codemods/console-migration.js`

### **Future Codemods (To Be Created)**

1. **Component Updates:** Update deprecated component names
2. **Error Handling:** Standardize error handling patterns
3. **Import Path Updates:** Migrate relative imports to alias imports

**Status:** ✅ Breakpoint and Console migrations fully implemented and tested

## 🎨 **Cyber Carrot Design System**

**Note:** This design system applies to the webapp (`/webapp/**`). For landing page styles, see the **Landing Page Style System (Cyber Carrot)** section above and `docs/LANDING_PAGE_STYLE_GUIDE.md`.

### **Color Palette**

```css
--primary: #29e7cd /* Electric Cyan - Primary Actions */ --secondary: #3b82f6
  /* Blue - Secondary Actions */ --accent: #d925c7 /* Vibrant Magenta - Accent Elements */
  --tertiary: #ff6b00 /* Cyber Orange - Warm Accents & Carrot Theme */ --background: #0a0a0a
  /* Dark background */ --foreground: #ffffff /* White text */ --muted: #1f1f1f
  /* Dark gray - Cards & Containers */ --border: #2a2a2a /* Border gray - Subtle borders */
  --surface: #2a2a2a /* Surface color - Elevated elements */ --surface-variant: #2a2a2a/30
  /* Surface variant - Subtle backgrounds */;
```

**Cyber Carrot Gradient Pattern:**

- **Gradient Borders:** `bg-gradient-to-r from-[#29E7CD]/20 via-[#FF6B00]/20 via-[#D925C7]/20 to-[#29E7CD]/20 p-[1px]`
- **Creates:** Glowing gradient border effect (Cyan → Orange → Magenta → Cyan)
- **Used In:** Popups, modals, dropdowns, elevated components

**Style System Decision Tree:**

- **Landing Page Styles:** Use for marketing pages, public content, conversion-focused components
  - See: `docs/LANDING_PAGE_STYLE_GUIDE.md` and `.cursor/rules/design.mdc` (Landing Page Style System - Cyber Carrot)
- **Webapp Styles (Cyber Carrot Design System):** Use for authenticated pages, data interfaces, functional components
  - See: `.cursor/rules/design.mdc` (Cyber Carrot Design System)

### **Cyber Carrot Typography**

- **Primary Font:** Geist Sans (Google Fonts)
- **Monospace:** Geist Mono (for technical content)
- **Hierarchy:**
  - Display Large: 4xl-6xl (Page titles)
  - Headline Large: 2xl-3xl (Section headers)
  - Title Large: xl-2xl (Card titles)
  - Body Large: base-lg (Main content)
  - Label Large: sm (Labels & metadata)
  - Label Small: xs (Captions & fine print)

### **Cyber Carrot Component Guidelines**

#### **Containers & Cards**

- **Border Radius:** `rounded-3xl` for main containers, `rounded-2xl` for cards
- **Elevation:** `shadow-lg` with `border border-[#2a2a2a]` for depth
- **Background:** `bg-[#1f1f1f]` for main containers, `bg-[#2a2a2a]/30` for cards
- **Gradients:** Subtle gradients for headers and accents

#### **Buttons & Actions**

- **Primary Buttons:** `bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7]` with `rounded-2xl` and `hover:shadow-[#FF6B00]/25` for orange glow
- **Secondary Buttons:** `bg-[#29E7CD]/10` with `hover:bg-[#29E7CD]/20`
- **Icon Buttons:** `rounded-full` with `p-2` and hover scaling
- **Hover Effects:** `hover:shadow-xl` and `transition-all duration-200`

#### **Data Tables**

- **Table Container:** `overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]`
- **Table Headers:** `sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20`
- **Header Cells:** `px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase`
- **Table Body:** `divide-y divide-[#2a2a2a] bg-[#1f1f1f]`
- **Table Rows:** `transition-colors hover:bg-[#2a2a2a]/20`
- **Table Cells:** `px-6 py-4 text-sm text-white` (or `text-gray-300` for secondary content)
- **Pagination:** Use `TablePagination` component from `components/ui/TablePagination.tsx` - place at both top and bottom of tables
- **Responsive:** Tables use `desktop:` (1025px) breakpoint - mobile/tablet (<1025px) shows card layout, desktop (≥1025px) shows table
- **Progress Bars:** Gradient bars for visual data representation
- **Chips:** `rounded-full` with `bg-[#29E7CD]/10` and `border border-[#29E7CD]/20`

**Standard Table Structure:**

```tsx
<div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
  <table className="min-w-full divide-y divide-[#2a2a2a]">
    <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
          Header
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
      <tr className="transition-colors hover:bg-[#2a2a2a]/20">
        <td className="px-6 py-4 text-sm text-white">Content</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Pagination Pattern:**

```tsx
<TablePagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} className="mb-4" />
<TableComponent data={paginatedData} />
<TablePagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} className="mt-4" />
```

#### **Forms & Inputs**

- **Input Fields:** `border border-[#2a2a2a]` with `focus:ring-2 focus:ring-[#29E7CD]`
- **Focus States:** Cyan ring with smooth transitions
- **Validation:** Color-coded feedback with Cyber Carrot styling

#### **Selection Controls & Checkboxes**

- **Modern Button-Style Toggle:** All selection checkboxes use a button-style toggle design, not native HTML checkboxes
- **Unselected State:** Empty box with `border border-[#2a2a2a]` and `bg-[#0a0a0a]`
- **Selected State:** Checkmark icon (`M5 13l4 4L19 7`) in cyan (`text-[#29E7CD]`)
- **Hover Effects:** Border highlights on hover (`hover:border-[#29E7CD]/50`)
- **Transitions:** Smooth 200ms transitions for all state changes
- **Accessibility:** Use `<button>` elements with proper `aria-label` attributes, not `<input type="checkbox">`
- **Implementation Pattern:**

```typescript
<button
  onClick={() => handleToggle(id)}
  className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
  aria-label={`${isSelected ? 'Deselect' : 'Select'} item ${name}`}
>
  {isSelected ? (
    <svg className="h-4 w-4 text-[#29E7CD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
  )}
</button>
```

- **Where Used:** Table row selection, bulk selection, card selection, import preview selection
- **Components Updated:** `IngredientTableWithFilters`, `IngredientTableRow`, `RecipeTable`, `RecipeCard`, `CSVImportModal`

#### **Icon Standards**

- **Icon Library:** Use Lucide React icons exclusively (no emoji icons)
- **Icon Component:** Use the standardized `Icon` component from `components/ui/Icon.tsx`
- **Icon Sizes:** `xs` (12px), `sm` (16px), `md` (20px - default), `lg` (24px), `xl` (32px)
- **Icon Colors:** Inherit from parent text color or use theme colors (`text-[#29E7CD]`, `text-gray-400`)
- **Implementation Pattern:**

```typescript
import { Icon } from '@/components/ui/Icon';
import { Zap, Store, MapPin } from 'lucide-react';

// Basic usage with size
<Icon icon={Zap} size="sm" className="text-[#29E7CD]" />

// With accessibility (decorative - auto-hides from screen readers)
<Icon icon={Store} size="md" aria-hidden="true" />

// With accessibility (interactive - includes label)
<Icon icon={MapPin} size="lg" aria-label="Filter by storage location" />
```

- **Automatic Accessibility:** The Icon component automatically sets `aria-hidden` when no `aria-label` is provided, and sets `role="img"` when `aria-label` is present
- **Common Icons:**
  - **Actions:** `Zap` (bulk actions), `Trash2` (delete), `Store` (supplier), `MapPin` (storage/location), `Target` (filter)
  - **Navigation:** `ChevronDown` (dropdowns), `Type` (sort by name), `Tag` (sort by brand), `DollarSign` (sort by cost), `Package` (sort by stock)
- **Migration Notes:**
  - **Bulk Actions Icons:** All bulk action buttons use Lucide icons (replaced emoji icons: ⚡→`Zap`, 🗑️→`Trash2`, 🏪→`Store`, 📍→`MapPin`, 🎯→`Target`)
  - **Filter Dropdown Icons:** Supplier filters use `Store`, Storage filters use `MapPin` (replaced emoji icons)
- **Component Location:** `components/ui/Icon.tsx` - Standardized wrapper for consistent sizing and accessibility
- **Migration Status:** All components use Icon wrapper - direct lucide-react imports are only for icon component references, not direct usage

#### **Z-Index Hierarchy**

- **Modals:** `z-[80]` - Highest priority overlays (delete confirmations, forms, etc.)
- **Search Modal:** `z-[75]` - Search interface overlay
- **FAB (Floating Action Button):** `z-[70]` - Mobile quick actions button
- **More Drawer:** `z-[65]` - Mobile drawer overlay
- **More Drawer Backdrop:** `z-[60]` - Backdrop behind drawer
- **Bottom Nav:** `z-[60]` - Mobile bottom navigation bar
- **Bulk Actions Dropdown:** `z-[60]` - Action menus above content
- **Sidebar:** `z-[60]` - Navigation drawer
- **Bulk Actions Backdrop:** `z-[55]` - Blocks interactions behind dropdowns
- **Sort/Filter Dropdowns:** `z-50` - Filter and sort menus
- **Header:** `z-50` - Fixed navigation header
- **Filter Bar:** `z-30` - Sticky filter bar above table content
- **Persistent Sidebar:** `z-40` - Desktop sidebar navigation

**Implementation Note:** Always ensure dropdowns and modals have proper z-index values to prevent clipping behind other elements. Use backdrop divs with appropriate z-index to block interactions when dropdowns are open.

### **Cyber Carrot Animation System**

```css
/* Keyframe Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### **Cyber Carrot Layout Patterns**

#### **Mobile-First Cards**

- **Card Structure:** Header with title/brand, content grid, action buttons
- **Staggered Animations:** `animationDelay: ${index * 50}ms`
- **Touch Targets:** Minimum 44px with proper spacing
- **Hover States:** `group-hover:text-[#29E7CD]` for interactive elements

#### **Desktop Data Tables**

- **Avatar Icons:** `w-10 h-10 rounded-full` with gradient backgrounds
- **Progress Indicators:** Visual bars for percentages and metrics
- **Action Buttons:** Circular buttons with icon scaling on hover
- **Row Interactions:** Smooth hover effects with color transitions

#### **Empty States**

- **Large Icons:** `w-20 h-20` with gradient backgrounds
- **Contextual Messaging:** Different messages for different states
- **Call-to-Actions:** Prominent buttons with Cyber Carrot styling

### **Cyber Carrot UX Guidelines**

- **Loading Skeletons:** Comprehensive skeleton system with multiple variants following Cyber Carrot design principles
- **Mobile Navigation:** Cyber Carrot navigation rail with proper spacing
- **Accessibility:** Focus rings, ARIA labels, keyboard navigation
- **Smooth Transitions:** 200-300ms transitions for all interactions
- **Touch Targets:** Minimum 44px for mobile, proper spacing
- **Visual Hierarchy:** Clear distinction between primary and secondary actions

### **Loading Skeleton System Architecture**

- **Base Component:** `LoadingSkeleton` with variant prop for different content types
- **Specialized Components:** `TableSkeleton`, `FormSkeleton`, `ChartSkeleton` for specific use cases
- **Page-Level:** `PageSkeleton` for full-page loading states
- **Landing Page:** `HeroSkeleton`, `PricingSkeleton` for marketing page
- **Dynamic Imports:** Proper skeleton components replace inline animate-pulse divs
- **Positioning:** All skeletons properly centered with `max-w-7xl mx-auto` and Cyber Carrot spacing
- **Styling:** Consistent colors (`bg-[#2a2a2a]`), border radius (`rounded-xl`, `rounded-2xl`, `rounded-3xl`), and animations (`animate-pulse`)

## 📊 **Analytics & Tracking**

### **Required Tracking Events**

- **Page Views:** All page loads with metadata
- **User Engagement:** Scroll depth, time on page, section views
- **Conversion Events:** CTA clicks, form submissions, purchases
- **Performance Metrics:** Core Web Vitals, loading times
- **A/B Testing:** Variant assignments, performance comparisons

### **Data Layer Structure**

```typescript
interface TrackingEvent {
  event: string;
  event_category: string;
  event_label?: string;
  event_value?: number;
  page_title: string;
  page_location: string;
  page_path: string;
  timestamp: number;
  user_id?: string;
  session_id: string;
}
```

### **GTM Configuration**

- **Container ID:** GTM-WQMV22RD
- **GA4 Measurement ID:** G-W1D5LQXGJT
- **Data Layer:** Automatic page tracking, custom event support
- **Triggers:** Page views, custom events, user interactions

## 🚀 **Performance Requirements**

### **Core Web Vitals Targets**

- **LCP (Largest Contentful Paint):** < 2.5 seconds
- **FID (First Input Delay):** < 100 milliseconds
- **CLS (Cumulative Layout Shift):** < 0.1

### **Loading Performance**

- **First Contentful Paint:** < 1.8 seconds
- **Time to Interactive:** < 3.8 seconds
- **Total Bundle Size:** < 200KB (gzipped)

### **Optimization Strategies**

- **Image Optimization:** next/image with proper sizing
- **Code Splitting:** Dynamic imports for non-critical components
- **Lazy Loading:** Images, components, and third-party scripts
- **Caching:** Static generation, CDN optimization

### **Speed Performance Improvements**

#### **Batch Fetching Infrastructure**

The application uses batch fetching and parallelization to eliminate N+1 query problems and sequential loading bottlenecks:

- **Batch Utilities**: `lib/api/batch-utils.ts` provides reusable batch fetching helpers
  - `chunkArray()`: Splits large arrays into manageable chunks
  - `fetchInParallel()`: Executes multiple requests in parallel with error handling
  - `fetchInBatches()`: Handles batched requests with automatic chunking
  - `groupBy()`: Groups results by key function
  - `MAX_BATCH_SIZE`: 100 items per batch (PostgreSQL IN clause limit)

- **Parallel Fetch Hook**: `hooks/useParallelFetch.ts` provides reusable parallel data fetching
  - Individual loading states per request
  - Error handling per request
  - Automatic retry and fallback mechanisms

#### **Caching & Prefetching Infrastructure**

The application uses sessionStorage-based caching and intelligent prefetching to dramatically improve perceived performance:

- **Generic Data Cache**: `lib/cache/data-cache.ts` provides reusable caching utilities
  - `cacheData(key, data, expiryMs)`: Cache any data type with configurable expiry (default 5 minutes)
  - `getCachedData(key)`: Retrieve cached data if valid (not expired)
  - `clearCache(key)`: Clear cache for specific key
  - `clearAllCaches()`: Clear all application caches
  - `prefetchApi(endpoint)`: Prefetch API endpoint using link prefetch
  - `prefetchApis(endpoints)`: Prefetch multiple endpoints in parallel

- **Prefetch Configuration**: `lib/cache/prefetch-config.ts` maps routes to API endpoints
  - Centralized configuration for all navigation routes
  - `prefetchRoute(route)`: Automatically prefetches all endpoints for a route
  - Prefetch triggers on navigation link hover for instant page loads

- **Page-Specific Caching**:
  - **Dashboard**: Caches stats, temperature logs, and equipment data
  - **Recipes**: Caches recipe list for instant display
  - **Ingredients**: Caches first page of ingredients
  - **Performance**: Caches performance analysis data
  - **Temperature Logs**: Caches first page with default filters

- **Instant Display Pattern**: All pages follow this pattern:
  1. Initialize state with cached data (if available) for instant display
  2. Fetch fresh data in background
  3. Update UI with fresh data when available
  4. Cache new data for next visit

- **Navigation Prefetching**:
  - Sidebar links prefetch on hover
  - Search modal links prefetch on hover
  - Routes automatically prefetch their configured API endpoints

#### **Performance Optimization Patterns**

1. **Optimistic Updates**: Update UI immediately when user performs actions
   - Store original state before mutations
   - Update UI immediately before API call completes
   - Revert on error, show success notification on success
   - Eliminates loading delays - perceived response time < 50ms
   - Never show loading states for mutations
   - Never call `fetchData()` after successful mutations
   - Use `lib/optimistic-updates.ts` utilities or `hooks/useOptimisticMutation.ts` hook
   - See `development.mdc` (Optimistic Updates Pattern) for detailed examples

2. **Batch API Endpoints**: Create batch endpoints for fetching multiple related items
   - Example: `/api/recipes/ingredients/batch` accepts multiple recipe IDs
   - Single Supabase query with `.in()` clause instead of N sequential queries
   - Groups results by key for easy consumption

3. **Parallel Fetching**: Use `Promise.all()` for independent requests
   - Dashboard fetches stats and temperature data in parallel
   - Recipe price calculations use parallel individual fetches as fallback
   - Reduces total fetch time from sequential (sum) to parallel (max)

4. **Non-Blocking Loading**: Show content immediately, calculate in background
   - Recipes page shows recipe list immediately
   - Price calculations happen asynchronously in background
   - Progressive loading: prices appear as they're calculated

5. **Fallback Mechanisms**: Always have fallback strategies
   - Batch fetch fails → fallback to parallel individual fetches
   - Parallel fetches fail → graceful error handling per item
   - Ensures functionality even if optimizations fail

6. **Caching Strategy**: Use sessionStorage for instant display
   - Cache first page of paginated data for instant display
   - Cache dashboard stats and frequently accessed data
   - Show cached data immediately, refresh in background
   - 5-minute default expiry (configurable per cache key)

7. **Prefetching Strategy**: Prefetch on user intent
   - Prefetch API endpoints on navigation link hover
   - Prefetch on mount for likely-to-be-accessed pages
   - Use link prefetch for browser-level optimization
   - Avoid prefetching when data changes frequently

#### **Performance Improvements Achieved**

- **CRUD Operations**: Near-instant perceived response time (< 50ms) with optimistic updates
  - Before: Loading states during mutations, full data reloads after operations
  - After: UI updates immediately, API calls happen in background
  - Implemented across: Menu Builder, Ingredients, Recipes, Dishes, Temperature Equipment, Order Lists, Prep Lists
  - Eliminates loading delays: Users see changes instantly, errors revert gracefully
  - See `development.mdc` (Optimistic Updates Pattern) and `operations.mdc` (Optimistic Updates Standard) for details

- **Recipes Page**: 80-90% reduction in load time (10s → 1-2s with 14 recipes)
  - Before: 14 sequential API calls (~10 seconds)
  - After: 1 batch API call or 14 parallel calls (~1-2 seconds)
  - Non-blocking: Recipes list displays immediately
  - Caching: Instant display from cache, then background refresh

- **Dashboard**: 50% reduction in load time (2 sequential → 1 parallel)
  - Before: Stats fetch → Temperature fetch (sequential)
  - After: Stats + Temperature fetch (parallel)
  - Caching: Instant display from cache, then background refresh

- **Perceived Performance**: Near-instant page loads with caching
  - Pages show cached data immediately (< 50ms)
  - Fresh data loads in background (~1-2 seconds)
  - Users see content instantly while data refreshes
  - Navigation prefetching makes subsequent page loads instant

#### **Best Practices for Future Development**

1. **Use optimistic updates for all CRUD operations** - Eliminate loading delays
2. **Never call `fetchData()` after successful mutations** - Rely on optimistic updates
3. Always batch related fetches using batch endpoints
4. Use parallel fetching with `Promise.all()` for independent requests
5. Show UI immediately, calculate expensive operations in background
6. Implement fallbacks for all optimizations
7. Cache first page data using sessionStorage for instant display
8. Prefetch API endpoints on navigation link hover
9. Initialize state with cached data using `getCachedData()` in useState
10. Cache after fetch: always call `cacheData()` after successful data fetch
11. Monitor performance using browser DevTools
12. Consider pagination for large datasets

**Implementation Guidelines:** Identify N+1 patterns, create batch endpoints, use parallel hooks, implement caching, add prefetching routes, implement optimistic updates, test performance, document patterns.

**Example Caching Pattern:**

```typescript
// Initialize with cached data
const [data, setData] = useState(() => getCachedData('my_data') || []);

useEffect(() => {
  // Fetch fresh data
  fetch('/api/my-data')
    .then(res => res.json())
    .then(newData => {
      setData(newData);
      cacheData('my_data', newData); // Cache for next visit
    });
}, []);
```

**Example Prefetching Pattern:**

```typescript
// In prefetch-config.ts
export const PREFETCH_MAP: Record<string, string[]> = {
  '/webapp/my-page': ['/api/my-data'],
};

// In navigation component
<Link href="/webapp/my-page" onMouseEnter={() => prefetchRoute('/webapp/my-page')}>
  My Page
</Link>
```

## 🔍 **SEO Requirements**

### **Meta Tags**

- **Title:** Under 60 characters, includes primary keyword
- **Description:** Under 160 characters, compelling and keyword-rich
- **Keywords:** Relevant long-tail keywords for restaurant profitability
- **Open Graph:** Social media optimization with proper images

### **Structured Data**

- **Software Application:** Main product schema
- **FAQ:** Question and answer markup
- **Organization:** Company information
- **Breadcrumb:** Navigation structure

### **Content Strategy**

- **Primary Keywords:** restaurant COGS, menu profitability, gross profit optimization
- **Long-tail Keywords:** Australian café profitability, food truck cost analysis
- **Content Types:** Blog posts, case studies, video content, resource guides

## 💰 **Conversion Optimization**

### **Lead Generation**

- **Primary CTA:** "Get PrepFlow Now" (purchase)
- **Secondary CTA:** "Watch the 2-min demo" (engagement)
- **Lead Magnet:** "Get the sample sheet (free)" (email capture)
- **Exit Intent:** Popup with lead magnet offer

### **Trust Elements**

- **Social Proof:** Customer testimonials with specific results
- **Risk Reversal:** 7-day refund policy, no lock-in
- **Security:** SSL certificates, secure checkout badges
- **Transparency:** Clear pricing, no hidden fees

### **Urgency & Scarcity**

- **Limited Time:** Launch discount countdown
- **Social Proof:** Real-time signup notifications
- **FOMO Triggers:** "Don't miss the margin makeover"
- **Exclusivity:** "Limited founder pricing"

## 🧪 **A/B Testing Strategy**

### **Test Variables**

- **Headlines:** Different value propositions
- **CTAs:** Button text, colors, positioning
- **Social Proof:** Testimonial placement, content
- **Pricing:** Price points, discount amounts
- **Layout:** Section ordering, content structure

### **Testing Framework**

- **Traffic Split:** 25% each for 4 variants
- **Statistical Significance:** 95% confidence level
- **Metrics:** Conversion rate, engagement, revenue
- **Duration:** Minimum 2 weeks for reliable results

## 🔧 **Development Workflow**

### **🚨 CRITICAL: Mandatory Development Practices (NON-NEGOTIABLE)**

#### **1. Git Best Practices (MANDATORY)**

**ALL development work MUST follow this workflow to prevent code destruction:**

1. Create feature branch: `git checkout -b improvement/feature-name`
2. Implement & test incrementally
3. Commit changes: `git add -A && git commit -m "feat: descriptive message"`
4. Test branch functionality
5. Merge to main: `git checkout main && git merge improvement/feature-name`
6. Test main branch
7. Push changes: `git push origin main`

**NEVER work directly on main branch for improvements!**

#### **2. File Refactoring Standards (MANDATORY)**

**ALL files MUST be refactored when they exceed size limits:**

**File Size Limits:**

- **Page Components:** Maximum 500 lines
- **Complex Components:** Maximum 300 lines
- **API Routes:** Maximum 200 lines
- **Utility Functions:** Maximum 150 lines
- **Hooks:** Maximum 120 lines (increased from 100 to accommodate coordination hooks)

**Mandatory Refactoring Triggers:**

- ✅ **Page exceeds 500 lines** → Split into smaller components
- ✅ **Component exceeds 300 lines** → Extract sub-components and hooks
- ✅ **API route exceeds 200 lines** → Split into multiple endpoints
- ✅ **Function exceeds 150 lines** → Break into smaller functions
- ✅ **Hook exceeds 120 lines** → Split into multiple specialized hooks

**Refactoring Requirements:**

1. **Component Splitting:** Break large components into logical sub-components
2. **Hook Extraction:** Extract reusable logic into custom hooks
3. **Type Definitions:** Create separate `.types.ts` files for complex interfaces
4. **Utility Functions:** Move helper functions to separate utility files
5. **Error Boundaries:** Wrap complex components with error boundaries
6. **Loading States:** Implement proper loading and error handling
7. **Documentation:** Update component documentation and prop interfaces

**Refactoring Workflow:**

1. Create refactoring branch: `git checkout -b refactor/component-name`
2. Analyze structure and identify separation points
3. Create new files (components, hooks, types, utilities)
4. Update imports and test thoroughly
5. Update documentation and merge to main

**Example Refactoring Pattern:**

```typescript
// Before: Large component (800+ lines)
// app/webapp/recipes/page.tsx

// After: Refactored structure
// app/webapp/recipes/
//   ├── page.tsx (160 lines - main page)
//   ├── types.ts (50 lines - TypeScript interfaces)
//   ├── components/
//   │   ├── RecipeCard.tsx (80 lines)
//   │   ├── RecipeTable.tsx (120 lines)
//   │   ├── RecipeForm.tsx (150 lines)
//   │   └── RecipePreviewModal.tsx (100 lines)
//   └── hooks/
//       ├── useRecipeManagement.ts (80 lines)
//       └── useAIInstructions.ts (60 lines)
```

**Code Quality Enforcement:**

- **Pre-commit hooks:** Automatically check file sizes via `scripts/check-file-sizes.js`
- **CI/CD pipeline:** Fail builds if files exceed limits
- **Code reviews:** Mandatory review of refactored code
- **Performance monitoring:** Track bundle size impact

**Recent Refactoring Examples (January 2025):**

#### **Ingredient Normalization Utilities Refactoring**

**Before:** Single large utility file (203 lines)

- `app/webapp/ingredients/hooks/utils/normalizeIngredientData.ts` (203 lines, exceeded 150-line utility limit)

**After:** Split into 3 focused utilities (all under 150 lines)

- `lib/ingredients/normalizeIngredientData.ts` (101 lines) - Core parsing and unit normalization utilities
- `lib/ingredients/buildInsertData.ts` (73 lines) - Data builder for database inserts
- `lib/ingredients/normalizeIngredientDataMain.ts` (76 lines) - Main orchestrator function

**Benefits:**

- ✅ Each file has a single, clear responsibility
- ✅ Easier to test individual utilities
- ✅ Better tree-shaking and code splitting
- ✅ Improved maintainability

#### **COGS Hooks Refactoring**

**Before:** Large hooks exceeding 100-line limit

- `useCOGSCalculations.ts`: 104 lines
- `useCOGSCalculationLogic.ts`: 105 lines
- `useRecipeIngredientLoading.ts`: 105 lines
- `useIngredientAddition.ts`: 127 lines

**After:** Trimmed and optimized hooks (all under 100 lines)

- `useCOGSCalculations.ts`: 81 lines - Orchestrator hook
- `useCOGSCalculationLogic.ts`: 86 lines - Core calculation logic
- `useRecipeIngredientLoading.ts`: 76 lines - Recipe ingredient loading
- `useIngredientAddition.ts`: 91 lines - Ingredient addition logic
- `useCOGSDataFetching.ts`: New hook for data fetching (extracted)
- `useIngredientConversion.ts`: New hook for unit conversions (extracted)

**Benefits:**

- ✅ All hooks meet 100-line limit
- ✅ Clear separation of concerns
- ✅ Improved code reusability
- ✅ Better testability

#### **Ingredient Management Hooks Refactoring**

**Before:** Large hooks exceeding 100-line limit (now 120-line limit)

- `useIngredientActions.ts`: 187+ lines (exceeded limit)
- `useIngredientCRUD.ts`: 158 lines
- `useIngredientCSV.ts`: 135 lines

**After:** Split into specialized hooks (all under 120 lines)

- `useIngredientActions.ts`: Orchestrator hook (delegates to specialized hooks)
- `useIngredientCRUD.ts`: 93 lines - Create, Read, Update, Delete operations
- `useIngredientCSV.ts`: 82 lines - CSV import/export functionality
- `useIngredientBulkActions.ts`: New hook for bulk operations (extracted)
- `useIngredientFormLogic.ts`: New hook for form state management (extracted)

**Benefits:**

- ✅ All hooks meet 120-line limit (increased from 100 to accommodate coordination hooks)
- ✅ Clear separation: CRUD, CSV, Bulk Actions, Form Logic
- ✅ Improved maintainability and testability
- ✅ Better code organization

#### **Hero Variants Component Refactoring**

**Before:** Large component file (342+ lines)

- `components/variants/HeroVariants.tsx`: Exceeded 300-line component limit

**After:** Split into focused components (all under 300 lines)

- `HeroVariants.tsx`: Main orchestrator component
- `HeroContent.tsx`: Content rendering (title, subtitle)
- `HeroBullets.tsx`: Bullet points rendering
- `HeroCTA.tsx`: Call-to-action buttons
- `HeroImageGallery.tsx`: Image gallery section

**Benefits:**

- ✅ Each component has single responsibility
- ✅ Easier to maintain and test
- ✅ Better code reusability
- ✅ Improved readability

**Refactoring Techniques Used:**

1. **Extract Helper Functions:** Moved complex logic to separate utility functions
2. **Split Large Hooks:** Broke down hooks into smaller, focused hooks
3. **Extract Constants:** Moved constants to module-level for reuse
4. **Consolidate Code:** Removed unnecessary blank lines and comments
5. **Inline Simple Functions:** Inlined small helper functions to save lines
6. **Extract Types:** Moved complex interfaces to separate type files when needed

**Benefits of Mandatory Refactoring:**

- ✅ **Maintainability:** Smaller files are easier to understand and modify
- ✅ **Debugging:** Easier to isolate and fix issues in smaller components
- ✅ **Testing:** Smaller components are easier to unit test
- ✅ **Performance:** Better tree-shaking and code splitting
- ✅ **Collaboration:** Multiple developers can work on different components
- ✅ **Reusability:** Extracted hooks and utilities can be reused across the app
- ✅ **Bundle Size:** Smaller, more focused bundles improve loading performance
- ✅ **Code Safety:** Git branching prevents code destruction during refactoring

### **Git Strategy**

- **Main Branch:** Production-ready code (protected)
- **Improvement Branches:** All new features and improvements (`improvement/feature-name`)
- **Hotfix Branches:** Critical bug fixes (`hotfix/bug-description`)
- **Commit Messages:** Conventional commits with descriptive messages

### **Deployment Process**

- **Development:** Local development with hot reload
- **Staging:** Vercel preview deployments
- **Production:** Automatic deployment from main branch
- **Monitoring:** Performance metrics, error tracking, analytics

### **🚨 CRITICAL: Vercel Compression Configuration**

**IMPORTANT:** To prevent `ERR_CONTENT_DECODING_FAILED` errors on production:

- **Set `compress: false`** in `next.config.ts` - Let Vercel handle compression automatically
- **Remove explicit Content-Encoding headers** - Vercel's automatic compression conflicts with manual settings
- **Never set `Content-Encoding: gzip, br`** manually - Causes browser decoding conflicts

**Configuration:**

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // Let Vercel handle compression automatically
  compress: false,
  // Remove explicit compression headers from headers() function
};
```

**Why:** Vercel automatically handles compression with optimal settings. Manual compression configuration causes conflicts and prevents proper content decoding in browsers.

### **Quality Assurance**

- **Code Review:** All changes require review
- **Testing:** Automated tests must pass
- **Performance:** Core Web Vitals monitoring
- **Accessibility:** WCAG 2.1 AA compliance

## 🎨 **UX Optimization & User Experience**

### **Comprehensive Loading Skeleton System ✅**

- **Unified LoadingSkeleton Component:** Single component with multiple variants (stats, table, form, chart, card, list, button)
- **Cyber Carrot Compliance:** All skeletons follow Cyber Carrot design principles with proper colors, spacing, and animations
- **Contextual Skeletons:** Appropriate skeleton variants for different content types (TableSkeleton, FormSkeleton, ChartSkeleton)
- **Consistent Positioning:** All skeletons properly centered and styled across the entire webapp
- **Dynamic Import Optimization:** Removed unnecessary dynamic imports from lightweight components to eliminate persistent skeleton placeholders
- **Performance Optimized:** Skeletons provide immediate visual feedback while content loads, improving perceived performance

### **Loading States & Performance**

- **Page-Level Skeletons:** PageSkeleton component for full-page loading states
- **Component-Level Skeletons:** Specialized skeletons for specific content types
- **A/B Test Loading:** Skeleton placeholders during variant assignment
- **Perceived Performance:** Reduce bounce rate with engaging loading states
- **Smooth Transitions:** 60fps animations and hover effects

### **Modern Navigation System**

- **Collapsible Sidebar:** ModernNavigation component with organized categories
- **Touch-Friendly:** Minimum 44px touch targets for mobile interactions

### **Mobile Long-Press Selection Mode ✅**

- **Long-Press to Enter:** Long press (500ms) on any table row enters selection mode
- **Tap to Select:** Once in selection mode, tap any row to toggle selection
- **Visual Feedback:** Selection mode banner with pulsing indicator, selected rows highlighted with `bg-[#29E7CD]/10`
- **Auto-Exit:** Exits automatically after bulk actions complete or on scroll
- **Manual Exit:** "Done" button in selection mode banner clears selections and exits
- **Implementation:**
  - Hook: `app/webapp/ingredients/hooks/useSelectionMode.ts` - Manages selection mode state
  - Component: `IngredientTableRow` - Handles touch events and long-press detection
  - Visual Indicator: Selection mode banner in `IngredientTableWithFilters`
- **Usage Pattern:**
  1. Long press any ingredient row → enters selection mode
  2. Tap other rows → selects/deselects them
  3. Use bulk actions → perform actions on selected items
  4. Tap "Done" or complete bulk action → exits selection mode
- **Touch Event Handling:** Uses `onTouchStart`, `onTouchMove`, `onTouchEnd` for mobile support
- **Movement Detection:** Cancels long-press if user moves finger during press
- **Cross-Platform:** Works on both mobile (touch) and desktop (click) devices
- **Smart Search:** Quick access to any feature with ⌘K shortcut
- **Keyboard Shortcuts:** ⌘B to toggle sidebar, ⌘K for search
- **Breadcrumb Navigation:** Context-aware navigation on desktop
- **Mobile-First:** Responsive design optimized for all screen sizes

### **Conversion Optimization**

- **Lead Generation:** ExitIntentPopup with lead magnet offer
- **Dual CTA Strategy:** Main purchase + free sample options
- **Strategic Placement:** CTAs positioned for maximum engagement
- **Engagement Tracking:** Analytics for CTA performance optimization

### **Navigation Enhancements**

- **Scroll-to-Top:** ScrollToTop button appears after 400px scroll
- **Progress Indicator:** ScrollProgress bar shows reading progress
- **Smooth Scrolling:** Enhanced scroll behavior throughout page
- **Section Navigation:** Smooth scroll to sections with header offset

### **Accessibility & Usability**

- **Focus Management:** Visible focus rings on all interactive elements
- **Keyboard Navigation:** Full keyboard accessibility support
- **ARIA Labels:** Proper screen reader and assistive technology support
- **WCAG Compliance:** WCAG 2.1 AA standards implementation

### **Visual Feedback & Interactions**

- **Hover Effects:** Scale animations and shadow effects on CTAs
- **Loading Animations:** Skeleton placeholders with pulse animations
- **Smooth Transitions:** 300ms transitions for all interactive elements
- **Visual Hierarchy:** Clear distinction between primary and secondary actions

### **Notification System Standardization ✅**

The PrepFlow application uses a standardized notification system with clear use case separation and consistent Cyber Carrot styling.

#### **Notification Types & Use Cases**

1. **Toast Notifications** (`NotificationContext` / `useNotification()`)
   - **Use for:** CRUD operation feedback, personality messages, temporary informational messages
   - **Duration:** 3 seconds default, 8 seconds for personality messages
   - **Position:** Fixed top-center (regular) or below header (personality)
   - **Types:** success, error, warning, info, personality
   - **Hook:** `useNotification()`
   - **Example:**
     ```typescript
     const { showSuccess, showError, showWarning, showInfo } = useNotification();
     showSuccess('Item saved successfully'); // 3s default
     // Personality messages automatically get 8s duration via personality:addToast event
     ```

2. **Banner Warnings** (`GlobalWarning` / `useGlobalWarning()`)
   - **Use for:** Critical system errors requiring immediate attention, temperature violations, system-wide warnings
   - **Duration:** Persistent until dismissed
   - **Position:** Fixed below header (full-width banner)
   - **Types:** error, warning, info, success
   - **Features:** Title + message, action buttons, dismissible
   - **Hook:** `useGlobalWarning()`
   - **Example:**
     ```typescript
     const { addWarning } = useGlobalWarning();
     addWarning({
       type: 'error',
       title: 'Temperature Violation',
       message: 'Freezer temperature above safe threshold',
       dismissible: true,
       action: {
         label: 'View Details',
         onClick: () => router.push('/webapp/temperature'),
       },
     });
     ```

3. **In-Page Alerts** (`KitchenAlerts`, `DashboardErrorAlert`)
   - **Use for:** Context-specific alerts (dashboard, kitchen operations), errors requiring retry actions, multiple related alerts
   - **Duration:** Persistent until dismissed
   - **Position:** In-page component (not fixed)
   - **Components:**
     - `KitchenAlerts` - Dashboard component for kitchen-specific operational alerts
     - `DashboardErrorAlert` - Dashboard-specific errors with retry functionality
   - **Example:**
     ```typescript
     <KitchenAlerts /> // Dashboard component
     <DashboardErrorAlert
       variant="critical"
       title="Failed to load data"
       message="Unable to fetch dashboard statistics"
       retryLabel="Retry"
       onRetry={handleRetry}
       disabled={loading}
     />
     ```

4. **Modals** (`SessionTimeoutWarning`)
   - **Use for:** Critical user actions requiring immediate response, session timeouts, confirmation dialogs
   - **Duration:** Until user action
   - **Position:** Centered modal with backdrop
   - **Example:** Session timeout warnings (handled automatically by `useSessionTimeout` hook)

#### **Personality Messages**

Personality messages are automatically enhanced with:

- **Longer Duration:** 8 seconds (vs 3 seconds for regular notifications)
- **Enhanced Visibility:** Larger size (`max-w-lg` vs `max-w-md`), larger text (`text-base` vs `text-sm`)
- **Better Positioning:** Below header with proper offset (accounts for header height)
- **Enhanced Styling:** Cyber Carrot gradient background (`from-[#29E7CD]/20 via-[#FF6B00]/20 via-[#D925C7]/20 to-[#29E7CD]/20`), pulse animation, Sparkles icon
- **Higher Z-Index:** `z-[60]` vs `z-50` for regular notifications

Personality messages are triggered via `personality:addToast` events and automatically receive enhanced styling.

#### **Standardized Styling**

All notification systems use consistent Cyber Carrot styling:

- **Success:** `bg-green-500/10` background, `text-green-400` text, `border-green-500/30` border
- **Error:** `bg-red-500/10` background, `text-red-400` text, `border-red-500/30` border
- **Warning:** `bg-yellow-500/10` background, `text-yellow-400` text, `border-yellow-500/30` border
- **Info:** `bg-[#29E7CD]/10` background, `text-[#29E7CD]` text, `border-[#29E7CD]/30` border
- **Personality:** Gradient background, white text, pulse animation, Sparkles icon

#### **Migration Notes**

- **SuccessMessage components** have been migrated to use `NotificationContext` instead of custom components
- **AnimatedToast** is deprecated (only used in AnimationShowcase demo)
- All notification systems maintain backward compatibility during migration

#### **Files**

- `contexts/NotificationContext.tsx` - Toast notification system
- `contexts/GlobalWarningContext.tsx` - Banner warning system
- `components/GlobalWarning.tsx` - GlobalWarning component
- `app/webapp/components/KitchenAlerts.tsx` - Kitchen alerts component
- `app/webapp/components/DashboardErrorAlert.tsx` - Dashboard error alert component
- `components/webapp/SessionTimeoutWarning.tsx` - Session timeout modal

## 📱 **Mobile Optimization**

### **Mobile Webapp Fixes ✅ (January 2025)**

Comprehensive mobile fixes ensuring the webapp works flawlessly on all mobile devices with full feature parity:

#### **Header Height Compensation**

- **CSS Variables:** `--header-height-mobile: 56px`, `--header-height-desktop: 64px`
- **Fixed Header:** Header positioned fixed at top with z-index 50
- **Dynamic Padding:** Main content uses `pt-[calc(var(--header-height-mobile)+var(--safe-area-inset-top))]` to prevent content hiding behind header
- **Responsive Heights:** Header height adapts between mobile and desktop breakpoints

#### **Touch Event Support**

- **Dual Event Handling:** Both `mousedown` and `touchstart` event listeners for full mobile compatibility
- **Sidebar Interactions:** Sidebar closes on touch outside, proper touch target handling
- **Touch Action:** `touch-action: manipulation` prevents double-tap zoom on buttons
- **Smooth Scrolling:** `-webkit-overflow-scrolling: touch` for native iOS scrolling

#### **Z-Index Layering**

- **Header:** z-50 (fixed navigation bar)
- **Sidebar Overlay:** z-55 (backdrop when sidebar is open)
- **Sidebar:** z-60 (navigation drawer)
- **Search Modal:** z-65 (search interface)
- **Proper Layering:** Ensures correct interaction blocking and visual hierarchy

#### **iOS Safe Area Support**

- **CSS Variables:** `--safe-area-inset-top`, `--safe-area-inset-bottom`, `--safe-area-inset-left`, `--safe-area-inset-right`
- **Viewport Configuration:** `viewport-fit=cover` in meta tag for iOS devices with notches
- **Applied to Header:** Header padding accounts for safe area insets
- **Applied to Content:** Main content padding includes safe area insets

#### **Mobile-Responsive Components**

- **DashboardStats:** Mobile text sizing (text-2xl → text-3xl), responsive padding (p-4 → p-6)
- **RecentActivity:** Mobile spacing (space-y-3 → space-y-4), smaller icons (h-8 w-8 → h-10 w-10)
- **PageHeader:** Responsive text sizing (text-2xl → text-4xl), mobile spacing adjustments
- **QuickActions:** Already responsive, verified mobile-friendly grid layout

#### **Overflow Prevention**

- **Horizontal Scrolling:** `overflow-x: hidden` on body, `max-width: calc(100% - 2rem)` for containers
- **Viewport Width:** All containers respect viewport width with proper box-sizing
- **Image Constraints:** Images, videos, iframes have `max-width: 100%` and `height: auto`

#### **Component Refactoring**

- **NavigationHeader:** Extracted from ModernNavigation to meet 300-line component limit
- **ModernNavigation:** Reduced from 319 to 176 lines
- **Type Safety:** Fixed TypeScript type for `menuButtonRef` (`RefObject<HTMLButtonElement | null>`)

#### **Implementation Files**

- `app/globals.css` - CSS variables, safe area support, mobile optimizations
- `app/layout.tsx` - Viewport configuration with `viewport-fit=cover`
- `app/webapp/layout.tsx` - Main content padding for header height
- `app/webapp/components/ModernNavigation.tsx` - Fixed header, touch events
- `app/webapp/components/navigation/NavigationHeader.tsx` - Extracted header component
- `app/webapp/components/navigation/Sidebar.tsx` - Header padding, z-index, performance
- `app/webapp/components/navigation/SearchModal.tsx` - Dynamic positioning
- `app/webapp/components/DashboardStats.tsx` - Mobile responsive sizing
- `app/webapp/components/RecentActivity.tsx` - Mobile spacing and touch targets
- `app/webapp/components/static/PageHeader.tsx` - Responsive text sizing

### **Responsive Design**

- **Breakpoints:** Mobile-first approach with **CUSTOM** Tailwind breakpoints (standard sm/md/lg are DISABLED)
- **Primary Breakpoint:** `desktop:` (1025px) - Desktop layout starts at 1025px
- **Tablet Behavior:** Tablets (481px-1024px) use mobile layout for better touch experience
- **Mobile Layout:** Below `desktop:` (1025px) → Mobile layout (phones + tablets)
- **Desktop Layout:** `desktop:` and above (1025px+) → Desktop layout
- **Touch Targets:** Minimum 44px for interactive elements
- **Navigation:** Mobile-friendly hamburger menu with backdrop blur
- **Forms:** Touch-optimized input fields with proper spacing

#### **Custom Breakpoint System (MANDATORY)**

**🚨 CRITICAL:** Standard Tailwind breakpoints (`sm:`, `md:`, `lg:`) are **DISABLED** and will not work. Always use the custom breakpoints below.

##### **Visual Breakpoint Map**

```
┌──────────────────┬────────────┬──────────────────────┬──────────────────────────────┬────────────────────────────┐
│ Breakpoint       │ px Value   │ Purpose              │ Target Devices               │ Usage Notes                │
├──────────────────┼────────────┼──────────────────────┼──────────────────────────────┼────────────────────────────┤
│ Base (default)   │ 0-480px    │ Mobile-first         │ Phones                       │ No prefix needed           │
│ tablet:          │ 481px+      │ Small tablets        │ Tablets, large phones        │ Replaces sm: and md:       │
│ desktop:         │ 1025px+     │ Primary desktop     │ Laptops, desktops            │ **PRIMARY** - Most layouts │
│ large-desktop:   │ 1440px+     │ Large desktop        │ Large monitors               │ Enhanced spacing           │
│ xl:              │ 1920px+     │ Extra-large          │ Ultra-wide monitors          │ Maximum content width      │
│ 2xl:             │ 2560px+     │ Ultra-wide           │ 4K+ displays                 │ Full dashboard expansion   │
└──────────────────┴────────────┴──────────────────────┴──────────────────────────────┴────────────────────────────┘
```

**Breakpoint Detection Results (January 2025):**

- ✅ **Active Breakpoints:** 5 (all defined breakpoints are in use)
  - `tablet:` - Used 108 times
  - `desktop:` - Used 124 times (PRIMARY)
  - `large-desktop:` - Used 40 times
  - `xl:` - Used 13 times
  - `2xl:` - Used 4 times
- ❌ **Unused Breakpoints:** 0 (all defined breakpoints are in use)
- ⚠️ **Rogue Breakpoints:** 3 (standard Tailwind breakpoints found but disabled)
  - `sm:` - Found in 5+ files (DISABLED - will not work)
  - `md:` - Found in 5+ files (DISABLED - will not work)
  - `lg:` - Found in 5+ files (DISABLED - will not work)

**Breakpoint Strategy:**

- **Base (default):** Mobile-first styles (0-480px) - no prefix needed
- **tablet:** Small tablets and large phones (481px+) - replaces `sm:` and `md:`
- **desktop:** **Primary desktop breakpoint** (1025px+) - replaces `lg:` - Most desktop layouts start here
- **large-desktop:** Large desktop screens (1440px+) - replaces some `xl:` usage
- **xl:** Extra-large desktop (1920px+) - for very large displays
- **2xl:** Ultra-wide displays (2560px+) - maximum content width and spacing

**⚠️ IMPORTANT:** Standard Tailwind breakpoints (`sm:`, `md:`, `lg:`) are **DISABLED** in `tailwind.config.ts`. Using them will have no effect. Always use the custom breakpoints above.

**Breakpoint Detection Script:**

Run `npm run detect-breakpoints` to analyze breakpoint usage across the codebase. This will identify:

- Active breakpoints (used in project)
- Unused breakpoints (defined but not used)
- Rogue breakpoints (used but not defined - standard Tailwind breakpoints)

#### **Responsive Patterns**

**Table Responsive Pattern:**

- Mobile/Tablet: `block desktop:hidden` for card layouts
- Desktop: `hidden desktop:block` for table layouts

**Grid Patterns:**

- Single column mobile: `grid-cols-1`
- Two columns tablet: `tablet:grid-cols-2`
- Three columns desktop: `desktop:grid-cols-3`
- Four columns large desktop: `large-desktop:grid-cols-4`
- Five columns extra-large: `xl:grid-cols-5`
- Example: `grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6`

**Text Size Patterns:**

- Mobile: `text-sm` or `text-base`
- Tablet: `tablet:text-base` or `tablet:text-lg`
- Desktop: `desktop:text-lg` or `desktop:text-xl`
- Large desktop: `large-desktop:text-xl` or `large-desktop:text-2xl`
- Extra-large: `xl:text-2xl` or `xl:text-3xl`
- Example: `text-sm tablet:text-base desktop:text-lg large-desktop:text-xl xl:text-2xl 2xl:text-3xl`

**Spacing Patterns:**

- Mobile: `p-4` or `p-6`
- Tablet: `tablet:p-6` or `tablet:p-8`
- Desktop: `desktop:p-8` or `desktop:p-10`
- Large desktop: `large-desktop:p-10` or `large-desktop:p-12`
- Extra-large: `xl:p-12` or `xl:p-16`
- Example: `p-4 tablet:p-6 desktop:p-8 large-desktop:p-10 xl:p-12 2xl:p-16`

**Container Width Patterns:**

- Mobile: `w-full` (no max-width)
- Tablet: `tablet:max-w-2xl` or `tablet:max-w-3xl`
- Desktop: `desktop:max-w-4xl` or `desktop:max-w-5xl`
- Large desktop: `large-desktop:max-w-6xl` or `large-desktop:max-w-7xl`
- Extra-large: `xl:max-w-7xl` or `xl:max-w-screen-2xl`
- Example: `w-full tablet:max-w-2xl desktop:max-w-4xl large-desktop:max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl`

### **Performance**

- **Mobile Speed:** Optimized for slower connections and limited bandwidth
- **Image Sizing:** Appropriate sizes for mobile devices with next/image
- **Touch Interactions:** Smooth scrolling, proper touch events
- **Viewport:** Proper meta viewport configuration for mobile devices

## 🌐 **Internationalization**

### **Language Support**

- **Primary:** English (Australian)
- **Secondary:** English (Global)
- **Currency:** AUD (primary), USD, EUR, GBP
- **Date Format:** DD/MM/YYYY (Australian standard)

### **Cultural Considerations**

- **GST:** Australian Goods and Services Tax support
- **Local Examples:** Australian café and restaurant references
- **Currency Display:** Clear pricing in multiple currencies
- **Regional Compliance:** GDPR, privacy laws, data protection

## 🚨 **Critical Issues to Address**

### **Immediate Fixes Required**

1. **Image Optimization:** Large images without proper sizing
2. **Performance:** Core Web Vitals optimization needed

### **Conversion Blockers**

1. **Form Validation:** Error handling and success states needed
2. **Trust Indicators:** Security badges and company info
3. **Urgency Elements:** Countdown or scarcity triggers

### **UX Improvements Completed ✅**

1. **UI Consistency Standardization (January 2025):**
   - **Table Formatting:** All tables use consistent styling (rounded-3xl, standard headers, consistent cell padding)
   - **Dual Pagination:** All paginated tables have pagination at both top and bottom using `TablePagination` component
   - **Responsive Breakpoints:** Standardized to `desktop:` (1025px) breakpoint - tablets use mobile layout for better UX
   - **Icon Standardization:** All icons use Icon wrapper component for consistent sizing and accessibility
   - **Table Components Updated:** PerformanceTable, IngredientTable, RecipeTable, DishTable, COGSTable, EquipmentTable, EquipmentListTable

2. **Comprehensive Loading Skeleton System:** Unified LoadingSkeleton component with multiple variants (stats, table, form, chart, card, list, button) following Cyber Carrot design principles
3. **Skeleton Positioning Fix:** Resolved skeleton positioning issues by removing unnecessary dynamic imports from dashboard components
4. **Dynamic Import Optimization:** Replaced inline animate-pulse divs with proper LoadingSkeleton components in dynamic imports
5. **Consistent Skeleton Styling:** All skeletons now appear properly centered with consistent Cyber Carrot styling across the entire webapp
6. **Modern Navigation System:** Collapsible sidebar with organized categories and smart search
7. **Lead Generation:** ExitIntentPopup with lead magnet offer
8. **Accessibility:** Focus management and keyboard navigation
9. **Smooth Scrolling:** Enhanced navigation with progress indicators
10. **Visual Feedback:** Hover effects and smooth transitions
11. **Recharts Integration:** Migrated from Chart.js to Recharts for 60% smaller bundle and better performance
12. **Chart Interactions:** Smooth SVG-based animations with Cyber Carrot styling
13. **Responsive Charts:** Auto-detection between desktop and mobile chart versions
14. **Chart Performance:** Optimized SVG rendering with efficient data filtering for large datasets
15. **Mobile Webapp Fixes:** Comprehensive mobile fixes ensuring full feature parity - header height compensation, touch event support, z-index layering, iOS safe area support, mobile-responsive components, overflow prevention, and component refactoring (January 2025)
16. **Dead Code Removal:** Removed unused components (MobileNavigation.tsx, ExitIntentTracker.tsx, PerformanceTracker.tsx, FloatingCTA.tsx) to reduce bundle size and improve maintainability (January 2025)
17. **Performance Infrastructure:** Comprehensive performance optimization system with batch fetching, parallel requests, caching, prefetching, and instant display patterns (January 2025)

## 🏗️ **Implementation Guide & Current Status**

### **Current Implementation Status ✅**

#### **✅ Completed Features (January 2025)**

**Core Infrastructure:**

1. **Unified Project Structure** - Next.js 16.0.0 with React 19 (App Router)
2. **Supabase Integration** - Database connection and API keys configured
3. **Authentication System** - NextAuth + Auth0 with allowlist enforcement
4. **Billing System** - Stripe integration with checkout and portal sessions
5. **Environment Configuration** - All API keys and settings configured

**WebApp Pages (All Implemented):**

1. **Dashboard** (`/webapp`) - Overview with statistics, quick actions, recent activity
2. **Ingredients Management** (`/webapp/ingredients`) - Full CRUD with CSV import/export, wizard, filtering
3. **Recipe Management** (`/webapp/recipes`) - Create, edit, delete recipes with ingredient lists, pricing
4. **COGS Calculator** (`/webapp/cogs`) - Cost analysis, labor/overhead, optimal pricing
5. **Performance Analysis** (`/webapp/performance`) - Menu profitability analysis with dynamic thresholds
6. **Temperature Monitoring** (`/webapp/temperature`) - Equipment tracking, logs, analytics, Queensland compliance
7. **Cleaning Management** (`/webapp/cleaning`) - Task tracking, area management, schedules
8. **Compliance Records** (`/webapp/compliance`) - Record keeping, type management, audit trails
9. **Suppliers** (`/webapp/suppliers`) - Supplier management, price lists, contact information
10. **Sections** (`/webapp/sections`) - Menu organization, section assignment
11. **Dish Builder** (`/webapp/dish-builder`) - Interactive dish building interface
12. **Menu Builder** (`/webapp/menu-builder`) - Menu creation and management interface
13. **Par Levels** (`/webapp/par-levels`) - Inventory par level management
14. **Order Lists** (`/webapp/order-lists`) - Purchase order management
15. **Prep Lists** (`/webapp/prep-lists`) - Kitchen prep list generation
16. **AI Specials** (`/webapp/ai-specials`) - AI-powered specials suggestions
17. **Recipe Sharing** (`/webapp/recipe-sharing`) - Share recipes with other users
18. **Settings** (`/webapp/settings`) - User settings, billing management
19. **Setup** (`/webapp/setup`) - Database setup, data reset, test data population

**Advanced Features:**

1. **Autosave System** - Global autosave with draft recovery, status indicators
2. **Session Timeout** - 4-hour timeout with 15-minute warning
3. **Personality System** - Dynamic UI personality with scheduler
4. **Arcade/Easter Eggs** - CatchTheDocket loading game, tomato toss, kitchen fire error game
5. **Loading Gate System** - 800ms loading gate with arcade overlay
6. **Modern Navigation** - Collapsible sidebar, search modal (⌘K), keyboard shortcuts
7. **Draft Recovery** - Smart draft recovery with suppression rules
8. **Performance Optimizations** - Batch fetching, caching, prefetching, parallel requests
9. **Mobile Optimization** - Full mobile support with safe area insets, touch events
10. **Error Boundaries** - Comprehensive error handling with user-friendly messages

#### **📊 Database Population Complete**

- **🧽 Cleaning Areas**: 24 areas
- **🚚 Suppliers**: 20 suppliers
- **🌡️ Temperature Equipment**: 76 pieces of equipment
- **🍽️ Menu Dishes**: 16 dishes (linked to recipes)
- **📖 Recipes**: 14 recipes with full instructions
- **🥬 Ingredients**: 95 ingredients with cost data

#### **🔧 Technical Improvements**

1. **Database Structure**: Fixed table schema and column naming issues
2. **API Endpoints**: All endpoints tested and working correctly (59 endpoints)
3. **Component Architecture**: Split large components (Recipes: 1,670 → 673 lines, COGS: 1,634 → 459 lines)
4. **Error Boundaries**: Implemented React error boundaries for better error handling
5. **Loading States**: Comprehensive skeleton system with Cyber Carrot compliance
6. **Modern Navigation Experience**: Touch-friendly navigation and responsive charts

#### **📋 Next Steps**

1. **Production Deployment** - Deploy to Vercel with custom domain
2. **Performance Monitoring** - Track Core Web Vitals in production
3. **SEO Enhancement** - Meta tags and structured data optimization
4. **User Testing** - Beta testing with restaurant owners
5. **File Size Compliance** - Refactor pages exceeding 500-line limit (prep-lists: 517, order-lists: 495, temperature: 493)

#### **🗑️ Dead Code Removed (January 2025)**

The following unused components have been removed to reduce bundle size and improve maintainability:

1. **components/ui/MobileNavigation.tsx** - Not imported anywhere (webapp uses ModernNavigation)
2. **components/ExitIntentTracker.tsx** - Commented out, not used
3. **components/PerformanceTracker.tsx** - Commented out, not used
4. **components/ui/FloatingCTA.tsx** - Commented out, not used

**Note:** `lib/cache/recipe-cache.ts` is actively used by `useRecipeManagement.ts` and should be kept.

#### **⚡ Performance Metrics & Optimizations**

**Current Performance Infrastructure:**

- **Optimistic Updates:** `lib/optimistic-updates.ts` utilities and `hooks/useOptimisticMutation.ts` hook for instant UI updates
- **Batch Fetching:** `lib/api/batch-utils.ts` provides utilities for batching API calls
- **Parallel Fetching:** `hooks/useParallelFetch.ts` for independent parallel requests
- **Caching System:** `lib/cache/data-cache.ts` with 5-minute default expiry
- **Prefetching:** `lib/cache/prefetch-config.ts` maps routes to API endpoints
- **Navigation Prefetching:** Prefetch on hover in NavItem, Sidebar, and SearchModal
- **Instant Display:** Pages initialize with cached data for <50ms perceived load time
- **See:** `development.mdc` (Optimistic Updates Pattern), `operations.mdc` (Optimistic Updates Standard), `implementation.mdc` (Optimistic Updates Implementation Pattern)

**Performance Improvements Achieved:**

- **CRUD Operations:** Near-instant perceived response time (< 50ms) with optimistic updates
  - Eliminates loading delays: UI updates immediately, API calls happen in background
  - Implemented across: Menu Builder, Ingredients, Recipes, Dishes, Temperature Equipment, Order Lists, Prep Lists
- **Recipes Page:** 80-90% reduction in load time (10s → 1-2s with 14 recipes)
- **Dashboard:** 50% reduction in load time (2 sequential → 1 parallel)
- **Perceived Performance:** Near-instant page loads with caching (<50ms)
- **Bundle Optimization:** Webpack chunk splitting for vendors, analytics, Supabase, React
- **Code Splitting:** Route-based code splitting with dynamic imports

**React Optimization:** React.memo (214 instances), useMemo/useCallback for expensive computations, proper dependency arrays and stable references

### **Print, Export, and Import Patterns**

**MANDATORY:** When adding print, export, or import functionality to any page, use the standardized patterns documented below.

**Quick Reference:**

- **Print Templates:** `docs/PRINT_EXPORT_IMPORT_PATTERNS.md` - Complete guide for print/export/import patterns
- **CSV Import:** `docs/CSV_IMPORT_INTEGRATION.md` - Detailed CSV import integration guide
- **Export Templates:** `docs/EXPORT_TEMPLATES.md` - Export template system documentation

**Key Components:**

- **Print:** `lib/exports/print-template.ts` - Unified print template with variants (`default`, `customer`, `supplier`, `compliance`, `kitchen`, `compact`)
- **Export:** `lib/exports/export-html.ts` - HTML/PDF export utilities
- **CSV:** `lib/csv/csv-utils.ts` - CSV parsing and export utilities
- **Import Modal:** `components/ui/CSVImportModal.tsx` - Reusable CSV import modal
- **Import Configs:** `lib/imports/*-import.ts` - Entity-specific import configurations

**UI Components:**

- `components/ui/PrintButton.tsx` - Standardized print button
- `components/ui/ExportButton.tsx` - Standardized export button (CSV/PDF/HTML dropdown)
- `components/ui/ImportButton.tsx` - Standardized import button

**Example Implementation:**
See `app/webapp/suppliers/page.tsx` for a complete example with print, export (CSV/PDF/HTML), and import functionality.

**Best Practices:**

1. Always use unified templates - Never create custom print/export templates
2. Reuse formatting functions - Use same formatting for print and export
3. Choose appropriate variant - Use `customer` for menus, `kitchen` for prep lists, etc.
4. Validate imports - Always validate data before importing
5. Show progress - Update progress state during import loops
6. Handle errors gracefully - Collect and display errors per row
7. Update cache - Cache imported data for instant display

**See Also:**

- `docs/PRINT_EXPORT_IMPORT_PATTERNS.md` - Complete patterns reference with code examples
- `docs/CSV_IMPORT_INTEGRATION.md` - Step-by-step CSV import integration guide

### **Development Workflow & Standards**

#### **Code Quality Standards**

- **TypeScript:** Strict typing, no `any` types without justification
- **Error Handling:** Comprehensive error handling with user-friendly messages
- **API Design:** RESTful APIs with proper HTTP status codes
- **Database:** Proper schema design with foreign key relationships
- **Testing:** Test all API endpoints and user flows

#### **Implementation Patterns**

- **API Routes:** Use Next.js App Router API routes (`/app/api/*`)
- **Database:** Use Supabase client with proper error handling
- **Components:** Client components with `"use client"` directive when needed
- **Environment:** Use `.env.local` for all configuration
- **Error Messages:** Provide clear, actionable error messages

#### **Database Schema Standards**

```sql
-- Standard table structure
CREATE TABLE table_name (
  id SERIAL PRIMARY KEY,
  -- Business fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **API Response Standards**

```typescript
// Success response
{
  success: true,
  message: "Operation completed successfully",
  data: resultData
}

// Error response
{
  error: "Error description",
  message: "User-friendly message",
  details?: errorDetails
}
```

### **Current Project Structure**

```
prepflow-landing/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout with analytics
│   ├── globals.css                 # Global styles and CSS variables
│   ├── providers.tsx               # React Query and context providers
│   ├── components/landing/         # Landing page components
│   │   ├── Hero.tsx               # Hero section
│   │   ├── TourModal.tsx          # Tour modal component
│   │   ├── HowItWorks.tsx         # Process explanation
│   │   ├── LandingHeader.tsx     # Landing page header
│   │   ├── LandingFooter.tsx     # Landing page footer
│   │   ├── LandingSections.tsx   # Section orchestrator
│   │   ├── FinalCTA.tsx          # Final call-to-action
│   │   ├── ExitIntentPopup.tsx   # Exit intent lead capture
│   │   └── sections/              # Landing page sections
│   │       ├── BenefitsSection.tsx
│   │       ├── FeaturesSection.tsx
│   │       ├── FAQSection.tsx
│   │       ├── LeadMagnetSection.tsx
│   │       ├── TrustSection.tsx
│   │       └── ... (other sections)
│   ├── webapp/                     # WebApp routes
│   │   ├── page.tsx               # Dashboard
│   │   ├── layout.tsx             # WebApp layout with navigation
│   │   ├── ingredients/           # Ingredients management
│   │   ├── recipes/               # Recipe management
│   │   ├── cogs/                  # COG calculator
│   │   ├── performance/           # Performance analysis
│   │   ├── temperature/           # Temperature monitoring
│   │   ├── cleaning/              # Cleaning management
│   │   ├── compliance/            # Compliance records
│   │   ├── suppliers/             # Supplier management
│   │   ├── sections/         # Menu sections
│   │   ├── dish-builder/          # Dish builder interface
│   │   ├── menu-builder/          # Menu builder interface
│   │   ├── par-levels/            # Par level management
│   │   ├── order-lists/           # Order lists
│   │   ├── prep-lists/            # Prep lists
│   │   ├── ai-specials/           # AI specials
│   │   ├── recipe-sharing/        # Recipe sharing
│   │   ├── settings/              # User settings
│   │   ├── setup/                 # Database setup
│   │   └── components/            # WebApp components
│   │       ├── ModernNavigation.tsx # Main navigation
│   │       ├── DashboardStatsClient.tsx
│   │       ├── DraftRecovery.tsx
│   │       └── navigation/         # Navigation components
│   └── api/                       # API routes (59 endpoints)
│       ├── auth/                  # Authentication
│       ├── billing/               # Stripe billing
│       ├── ingredients/           # Ingredients CRUD
│       ├── recipes/               # Recipes CRUD
│       ├── dashboard/             # Dashboard stats
│       ├── performance/           # Performance analysis
│       ├── temperature-*/         # Temperature endpoints
│       ├── cleaning-*/            # Cleaning endpoints
│       ├── compliance-*/          # Compliance endpoints
│       ├── suppliers/             # Supplier endpoints
│       ├── db/                    # Database management
│       └── webhook/               # Webhook handlers
├── components/
│   ├── ui/                        # Universal UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ...
│   ├── Arcade/                    # Arcade/easter eggs
│   ├── EasterEggs/                # Easter egg games
│   ├── ErrorGame/                 # Error page games
│   ├── Loading/                   # Loading components
│   ├── variants/                  # A/B testing variants
│   └── ...
├── lib/
│   ├── supabase.ts                # Supabase client (database only)
│   ├── auth-options.ts            # NextAuth configuration
│   ├── stripe.ts                  # Stripe integration
│   ├── analytics.ts               # Analytics service
│   ├── ab-testing-analytics.ts    # A/B testing system
│   ├── cache/                     # Caching utilities
│   │   ├── data-cache.ts          # Generic data cache
│   │   ├── prefetch-config.ts     # Prefetch configuration
│   │   └── recipe-cache.ts        # Recipe-specific cache
│   ├── api/                       # API utilities
│   │   └── batch-utils.ts         # Batch fetching utilities
│   ├── ingredients/               # Ingredient normalization
│   ├── personality/               # Personality system
│   ├── populate-helpers/          # Data population helpers
│   └── ...
├── hooks/
│   ├── useAutosave.ts             # Autosave hook
│   ├── useParallelFetch.ts       # Parallel fetching hook
│   ├── useSessionTimeout.ts      # Session timeout hook
│   └── ...                        # Additional hooks
└── .env.local                     # Environment variables
```

### **Environment Variables**

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

### **Database Tables Required**

1. **ingredients** - Ingredient inventory with cost data
2. **recipes** - Recipe management with instructions
3. **recipe_ingredients** - Recipe-ingredient relationships
4. **menu_dishes** - Menu items with selling prices
5. **users** - User management with subscriptions

### **API Endpoints Reference (59 Endpoints)**

**Authentication & User:**

- `GET /api/auth/[...nextauth]` - NextAuth authentication handlers
- `POST /api/auth/logout` - User logout
- `GET /api/me` - Current user information
- `GET /api/entitlements` - User subscription entitlements

**Account Management:**

- `DELETE /api/account/delete` - Delete user account
- `GET /api/account/export` - Export user data

**Billing:**

- `POST /api/billing/create-checkout-session` - Create Stripe checkout session
- `POST /api/billing/create-portal-session` - Create Stripe customer portal session
- `POST /api/webhook/stripe` - Stripe webhook handler

**Ingredients:**

- `GET /api/ingredients` - List ingredients (paginated)
- `POST /api/ingredients` - Create ingredient
- `PUT /api/ingredients` - Update ingredient
- `DELETE /api/ingredients` - Delete ingredient
- `GET /api/ingredients/exists` - Check if ingredient exists
- `PUT /api/ingredients/bulk-update` - Bulk update multiple ingredients (supplier, storage_location, wastage, etc.)

**Recipes:**

- `GET /api/recipes` - List recipes
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes` - Update recipe
- `DELETE /api/recipes` - Delete recipe
- `GET /api/recipes/exists` - Check if recipe exists
- `GET /api/recipes/[id]/ingredients` - Get recipe ingredients
- `POST /api/recipes/ingredients/batch` - Batch fetch recipe ingredients
- `POST /api/recipe-share` - Share recipe with user

**Dashboard:**

- `GET /api/dashboard/stats` - Dashboard statistics

**Performance:**

- `GET /api/performance` - Performance analysis data

**Temperature:**

- `GET /api/temperature-logs` - List temperature logs
- `POST /api/temperature-logs` - Create temperature log
- `GET /api/temperature-equipment` - List temperature equipment
- `POST /api/temperature-equipment` - Create temperature equipment
- `PUT /api/temperature-equipment/[id]` - Update equipment
- `DELETE /api/temperature-equipment/[id]` - Delete equipment
- `POST /api/generate-test-temperature-logs` - Generate test logs

**Cleaning:**

- `GET /api/cleaning-areas` - List cleaning areas
- `GET /api/cleaning-tasks` - List cleaning tasks

**Compliance:**

- `GET /api/compliance-records` - List compliance records
- `GET /api/compliance-types` - List compliance types

**Suppliers:**

- `GET /api/suppliers` - List suppliers
- `POST /api/supplier-price-lists` - Create supplier price list

**Operations:**

- `GET /api/prep-lists` - List prep lists
- `GET /api/order-lists` - List order lists
- `GET /api/order-lists/[id]` - Get order list details
- `POST /api/assign-dish-section` - Assign dish to section
- `POST /api/ai-specials` - Generate AI specials

**Menu & Dishes:**

- `GET /api/dishes` - List dishes (paginated)
- `POST /api/dishes` - Create dish
- `GET /api/dishes/[id]` - Get dish details
- `PUT /api/dishes/[id]` - Update dish
- `GET /api/dishes/[id]/cost` - Get dish cost calculation
- `GET /api/menus` - List menus
- `POST /api/menus` - Create menu
- `GET /api/menus/[id]` - Get menu details
- `PUT /api/menus/[id]` - Update menu
- `GET /api/menus/[id]/items` - Get menu items
- `POST /api/menus/[id]/items` - Add item to menu
- `PUT /api/menus/[id]/items/[itemId]` - Update menu item
- `DELETE /api/menus/[id]/items/[itemId]` - Remove item from menu
- `POST /api/menus/[id]/reorder` - Reorder menu items
- `GET /api/menus/[id]/statistics` - Get menu statistics

**Equipment:**

- `GET /api/equipment/[id]/qr-code` - Generate QR code for equipment

**Utilities:**

- `GET /api/detect-country` - Detect user country
- `POST /api/setup-menu-builder` - Setup menu builder tables

**Database Management (Dev Only):**

- `POST /api/db/reset` - Reset all domain tables
- `POST /api/db/reset-self` - Reset current user's data
- `POST /api/db/integrity` - Check database integrity
- `POST /api/setup-database` - Setup database tables
- `POST /api/populate-clean-test-data` - Populate clean test data
- `POST /api/populate-recipes` - Populate recipe data
- `POST /api/cleanup-test-data` - Cleanup test data
- `POST /api/dedupe/preview` - Preview deduplication
- `POST /api/dedupe/execute` - Execute deduplication

**Lead Generation:**

- `POST /api/leads` - Submit lead form

### **Testing Checklist**

- [ ] Database tables created in Supabase
- [ ] Sample data populated successfully
- [ ] All webapp routes accessible
- [ ] API endpoints responding correctly
- [ ] Error handling working properly
- [ ] Environment variables loaded
- [ ] Supabase connection established

### **Implementation Best Practices**

#### **Database Setup Process**

1. **Always check table existence** before data operations
2. **Use proper error handling** for database operations
3. **Provide clear error messages** with actionable instructions
4. **Test API endpoints** after any database changes

#### **Supabase Integration Patterns**

```typescript
// Standard Supabase client usage
import { supabaseAdmin } from '@/lib/supabase';

// Check table existence
const { data, error } = await supabaseAdmin.from('table_name').select('id').limit(1);

if (error) {
  // Handle table doesn't exist error
  return NextResponse.json(
    {
      error: 'Table does not exist',
      message: 'Please create tables first',
      instructions: 'Visit /api/create-tables for SQL script',
    },
    { status: 400 },
  );
}
```

#### **Error Handling Standards**

- **Always log errors** for debugging
- **Provide user-friendly messages** in API responses
- **Include actionable instructions** when possible
- **Use proper HTTP status codes** (400 for client errors, 500 for server errors)

#### **Development Workflow (MANDATORY)**

1. **🚨 MANDATORY: Create feature branch** - Never work directly on main
2. **🚨 MANDATORY: Check file sizes** - Refactor if any file exceeds limits
3. Test locally first, check environment variables, verify database connection
4. Test API endpoints, commit and test branch before merging
5. Merge to main, test, update documentation, clean up refactored files

#### **Current Known Issues & Solutions**

- **"supabaseKey is required"** - Fixed with complete service role key
- **"Invalid API key"** - Fixed with proper environment variables
- **"Could not find column"** - Requires database table creation
- **Client component errors** - Add `"use client"` directive when using hooks
- **ERR_CONTENT_DECODING_FAILED** - Fixed by setting `compress: false` in next.config.ts and removing explicit Content-Encoding headers

#### **File Organization Standards**

- **API routes** in `/app/api/` directory
- **WebApp pages** in `/app/webapp/` directory
- **Shared utilities** in `/lib/` directory
- **Environment config** in `.env.local`
- **Database schema** documented in AGENTS.md

#### **Code Review Checklist**

- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] API responses follow standards
- [ ] Database operations use proper patterns
- [ ] Environment variables properly configured
- [ ] Client components marked with `"use client"`
- [ ] Documentation updated

## 📈 **Success Metrics**

### **Primary KPIs**

- **Conversion Rate:** Target 3-5% (industry average 2-3%)
- **Lead Generation:** Target 100+ email captures per month
- **Revenue:** Target $10,000+ monthly recurring revenue
- **SEO Rankings:** Top 3 for primary keywords

### **Secondary Metrics**

- **Page Load Speed:** < 2 seconds
- **Bounce Rate:** < 40%
- **Time on Page:** > 3 minutes
- **Social Shares:** 50+ per month

## 🔮 **Future Roadmap**

### **Phase 1 (Month 1):** Critical fixes and optimization

### **Phase 2 (Month 2):** Content expansion and SEO

### **Phase 3 (Month 3):** Advanced features and personalization

### **Phase 4 (Month 4):** International expansion and scaling

## 📞 **Contact & Support**

### **Development Team**

- **Lead Developer:** [Your Name]
- **Design:** [Designer Name]
- **Marketing:** [Marketing Lead]
- **Analytics:** [Analytics Specialist]

### **Tools & Resources**

- **Design System:** Figma components and guidelines
- **Analytics Dashboard:** Google Analytics and GTM
- **Performance Monitoring:** Vercel Analytics and Core Web Vitals
- **A/B Testing:** Built-in framework with GTM integration

## 🧭 **Modern Navigation System**

### **Architecture Overview**

The PrepFlow webapp uses a modern, space-efficient navigation system designed for optimal screen real estate usage and user experience.

### **Key Features**

- **Collapsible Sidebar**: 320px width, hidden by default to maximize content space
- **Organized Categories**: Core, Operations, Inventory, Kitchen, Tools
- **Smart Search**: Real-time filtering with ⌘K shortcut
- **Keyboard Shortcuts**: ⌘B to toggle sidebar, ⌘K for search
- **Breadcrumb Navigation**: Context-aware navigation on desktop
- **Touch-Optimized**: 44px minimum touch targets for mobile
- **Responsive Design**: Adapts to all screen sizes

### **Implementation Details**

- **Component**: `app/webapp/components/ModernNavigation.tsx`
- **Layout Integration**: Used in `app/webapp/layout.tsx`
- **Search Modal**: Full-screen search with category filtering
- **Active States**: Visual feedback for current page
- **Accessibility**: Full keyboard and screen reader support

### **Benefits**

- **50% more screen space** for content
- **Organized navigation** with clear hierarchy
- **Quick access** to any feature via search
- **Mobile-first** design approach
- **Smooth animations** and transitions

## 🎯 **PrepFlow COGS Dynamic Methodology**

### **Performance Analysis Implementation**

The PrepFlow performance analysis system uses a **dynamic approach** that automatically adapts to your menu data, ensuring accurate categorization that reflects your actual business performance.

#### **Dynamic Profit Thresholds**

- **Formula**: `profitThreshold = averageProfitMargin` (calculated from all menu items)
- **Logic**: HIGH if above menu average, LOW if below
- **Purpose**: Identifies items that are "making you smile at the bank" vs. underperformers

#### **Dynamic Popularity Thresholds**

- **Formula**: `popularityThreshold = averagePopularity * 0.8` (80% of average)
- **Logic**: HIGH if ≥ 80% of average popularity, LOW if below
- **Purpose**: Identifies items that are "selling like hot chips" vs. slow movers

#### **Menu Item Classifications**

Based on the combination of profit and popularity categories:

1. **Chef's Kiss** (High Profit + High Popularity)
   - Profitable and popular
   - Keep it, flaunt it, feature it

2. **Hidden Gem** (High Profit + Low Popularity)
   - Profitable but overlooked
   - Market it, plate it better, get it noticed

3. **Bargain Bucket** (Low Profit + High Popularity)
   - Popular but slim profit
   - Adjust price or portion before it eats your margins

4. **Burnt Toast** (Low Profit + Low Popularity)
   - Not profitable, not popular
   - Bin it. No ceremony needed

#### **Implementation Details**

- **API Endpoint**: `/api/performance`
- **Methodology**: `PrepFlow COGS Dynamic`
- **Real-time Adaptation**: Thresholds automatically adjust as menu changes
- **GST Exclusion**: Gross profit calculations exclude 10% GST (Australian standard)
- **Data Filtering**: Only items with sales data (number_sold > 0) are analyzed

#### **Key Benefits**

- ✅ **Accurate Categorization**: Reflects actual business performance
- ✅ **Automatic Adaptation**: No manual threshold adjustments needed
- ✅ **Real-time Updates**: Categories update as menu evolves
- ✅ **Industry Standard**: Follows PrepFlow COGS methodology exactly

## 🇦🇺 **Queensland Food Safety Standards Integration**

### **Automatic Temperature Threshold Application**

PrepFlow automatically applies Queensland food safety regulations to all temperature monitoring equipment, ensuring full compliance with local health standards.

#### **Queensland Food Safety Standards**

Based on Queensland Health regulations and official government standards:

- **Cold Storage**: 0°C to 5°C (optimal range for fridges and walk-in coolers to prevent bacterial growth)
- **Hot Holding**: ≥60°C (maintains safe hot food temperatures)
- **Temperature Danger Zone**: 5°C to 60°C (where bacteria multiply rapidly - must be avoided)
- **Freezer Standards**: -24°C to -18°C (optimal range for frozen food safety and quality)

#### **2-Hour/4-Hour Rule Implementation**

Queensland's time-in-danger-zone management:

- **<2 hours**: Food can be used immediately or refrigerated
- **2-4 hours**: Food should be consumed immediately, not refrigerated
- **>4 hours**: Food must be discarded

#### **Automatic Equipment Classification**

The system intelligently categorizes equipment based on naming:

- **Freezer Equipment**: Contains "freezer" or "frozen" → min_temp_celsius: -24°C, max_temp_celsius: -18°C (optimal -24°C to -18°C range)
- **Hot Holding Equipment**: Contains "hot", "warming", or "steam" → ≥60°C
- **Cold Storage Equipment**: All other equipment → min_temp_celsius: 0°C, max_temp_celsius: 5°C (optimal 0-5°C range)

#### **Implementation Details**

- **API Integration**: `/api/temperature-equipment` automatically applies Queensland standards
- **Real-time Compliance**: All equipment thresholds updated automatically
- **No Manual Configuration**: Standards applied globally without user intervention
- **Audit Trail**: System logs all threshold applications for compliance tracking

#### **Compliance Benefits**

- ✅ **Queensland Compliant**: Meets all local food safety regulations
- ✅ **Automatic Application**: No manual threshold configuration needed
- ✅ **Risk Mitigation**: Prevents temperature danger zone violations
- ✅ **Audit Ready**: Full compliance documentation and logging
- ✅ **Health Inspector Approved**: Meets Logan City Council standards

## 📊 **Temperature Analytics Chart System**

### **Recharts Implementation (Latest Update)**

The temperature analytics system uses **Recharts** for optimal performance and user experience:

#### **Why Recharts**

- ✅ **60% smaller bundle** than Chart.js (~200KB vs ~500KB)
- ✅ **Native React components** - no wrapper needed
- ✅ **Smooth SVG animations** - better performance than Canvas
- ✅ **React Native ready** - perfect for future mobile app
- ✅ **Cyber Carrot Design System compatible** - seamless integration
- ✅ **Tree-shakable** - only import what you use

#### **Chart Features**

- **Smooth Line Drawing**: 1-second Cyber Carrot animations
- **Responsive Design**: Auto-adapts to all screen sizes
- **Touch Support**: Full mobile gesture support
- **Real-time Updates**: Optimized for live temperature data
- **Accessibility**: Built-in screen reader support

#### **Performance Optimizations**

- **SVG Rendering**: Smooth, scalable graphics
- **Data Filtering**: Only renders visible data points
- **Memory Efficient**: Proper cleanup and optimization
- **Mobile Optimized**: Touch-first interactions

#### **Technical Implementation**

- **Component**: `RechartsTemperatureChart.tsx`
- **Library**: Recharts (recharts)
- **Styling**: Cyber Carrot Design System with Tailwind CSS
- **Responsive**: Auto-detection between desktop and mobile
- **Accessibility**: Full keyboard and screen reader support

#### **Key Benefits**

- ✅ **Faster Loading**: 60% smaller bundle size
- ✅ **Better Animations**: Smooth SVG-based transitions
- ✅ **Mobile Ready**: Perfect for React Native migration
- ✅ **Performance**: Optimized for large datasets
- ✅ **Developer Experience**: Declarative React components

---

**Remember:** PrepFlow is a high-converting landing page that needs to balance technical excellence with conversion optimization. Every change should be measured and optimized for maximum impact on both user experience and business results.

## Data & Schema Standards

- Canonical ingredient field name: `ingredient_name`.
- Historical references to `ingredients.name` may exist; when reading, alias or normalize to `ingredient_name`.
- Prefer the server endpoint `GET /api/recipes/[id]/ingredients` for normalized joins.

## Next.js 16 Route Handlers

- In App Router, `context.params` is a Promise. Handlers must await it:
  - `export async function GET(req, context: { params: Promise<{ id: string }> }) { const { id } = await context.params; }`
- Prefer proxy over middleware per deprecation notice. Middleware is still present for prod allowlist, but should be migrated to proxy when feasible.

## Autosave & Drafts (Global)

- Standardize IDs: Use `deriveAutosaveId(entityType, serverId?, keyFields)` for new entities to avoid `"new"` key churn.
- Flush Behavior: Autosave flushes on data change debounce, visibility change, pagehide, and beforeunload.
- Global Indicator: Header shows Saving/Saved/Error via a global event (`autosave:status`).
- Draft Recovery: Suppresses prompts for drafts younger than 10 minutes, empty drafts, and drafts without minimal signal (e.g., missing `ingredient_name` or `name`).
- Purge Policy: Client migration purges drafts older than 7 days and re-keys `"new"`/`tmp_*` entries to stable IDs on startup.
- Server Parity: Demo saves clear drafts; production keeps drafts on 4xx/5xx and surfaces an error.
- UI Contracts:
  - Forms using autosave must pass a stable `entityId` (prefer server ID; otherwise `deriveAutosaveId`).
  - After successful save, drafts must be cleared (handled centrally in `useAutosave`).

### Implemented

- `hooks/useAutosave.ts`: status broadcasting + flush on lifecycle.
- `lib/autosave-id.ts`: stable ID derivation.
- `app/providers.tsx`: one-time migration (purge/re-key) on startup.
- `app/webapp/components/DraftRecovery.tsx`: prompt suppression and purge of >24h drafts.
- `app/webapp/components/ModernNavigation.tsx` + `AutosaveGlobalIndicator`: global status.
- Key forms updated to stable IDs: `RecipeForm`, `IngredientForm`.

### Action Items for New Forms

- Import and use `deriveAutosaveId` with meaningful key fields.
- Avoid passing `"new"` as `entityId` to `useAutosave`.
- Ensure minimal field validation so autosave is only enabled when meaningful.

## 🧹 **Unified Cleanup System**

**Status:** ✅ Fully Implemented

**Purpose:** Comprehensive automated enforcement of ALL code quality and standards.

**Documentation:** See `.cursor/rules/cleanup.mdc` for complete cleanup standards and enforcement details.

**Quick Start:**

- Check all standards: `npm run cleanup:check`
- Auto-fix available issues: `npm run cleanup:fix`
- Generate detailed report: `npm run cleanup:report`
- Check staged files only: `npm run cleanup:staged`

**Standards Enforced:**

- File size limits (pages: 500, components: 300, API: 200, utils: 150, hooks: 120)
- Breakpoint standards (custom breakpoints only, detects rogue breakpoints)
- Console.log migration (360 instances → logger.dev())
- Unused imports (via ESLint)
- TypeScript ref types (RefObject patterns)
- JSDoc documentation (public functions/components/hooks)
- Icon standards (Lucide icons with Icon wrapper)
- Naming conventions (files, components, functions, constants)
- Prettier formatting (semicolons, quotes, width)
- ESLint violations (hooks rules, unescaped entities)
- Dead code detection (unused exports)
- Security patterns (input validation, rate limiting)
- Performance standards (bundle size, API response times)

**Integration:**

- Pre-commit hook: Automatically runs on staged files
- CI pipeline: Runs on all PRs, generates report artifacts
- Exit codes: 0 (pass), 1 (critical violations), 2 (warnings only)

**Cross-References:**

- All standards reference source MDC files (development.mdc, design.mdc, etc.)
- All MDC files reference cleanup.mdc for automated enforcement
- Violation reports include standard references for easy navigation

**See Also:**

- `.cursor/rules/cleanup.mdc` - Complete cleanup standards documentation
- `scripts/cleanup.js` - Main cleanup script
- `scripts/cleanup/checks/` - Individual check modules
- `scripts/cleanup/fixes/` - Individual fix modules

## 📋 **Enterprise Cleanup & Standards Summary**

### **✅ Completed (January 2025)**

1. **Error Fixes:**
   - ✅ Fixed all TypeScript errors (null checks, missing imports, type annotations)
   - ✅ Fixed ESLint errors (unescaped entities, hook rules)
   - ✅ Added missing imports (`ApiErrorHandler`, `logger`)

2. **Breakpoint System:**
   - ✅ Detected all breakpoint usage (205 files analyzed)
   - ✅ Identified active breakpoints (5 in use)
   - ✅ Identified rogue breakpoints (3 standard Tailwind breakpoints - disabled)
   - ✅ Created breakpoint detection script (`npm run detect-breakpoints`)

3. **Code Formatting:**
   - ✅ Prettier installed and configured
   - ✅ Entire project formatted
   - ✅ Prettier integrated with lint-staged

4. **CI/CD Infrastructure:**
   - ✅ GitHub Actions CI workflow created (`.github/workflows/ci.yml`)
   - ✅ PR auto-labeling workflow created (`.github/workflows/pr-labels.yml`)
   - ✅ Labeler configuration created (`.github/labeler.yml`)

5. **Documentation:**
   - ✅ Automatic CHANGELOG generation script created
   - ✅ Visual breakpoint map added to AGENTS.md
   - ✅ Comprehensive standards documentation in AGENTS.md

### **📋 Remaining Tasks**

1. **JSDoc Standardization:**
   - ⚠️ In Progress - Apply JSDoc templates across codebase
   - Target: All public functions, components, hooks documented
   - Enforcement: `npm run cleanup:check` (jsdoc check)

2. **Codemod Scripts:**
   - ✅ Breakpoint migration codemod created
   - ✅ Console.log migration codemod created
   - 📋 Future: Component updates, error handling standardization

3. **Rogue Breakpoint Removal:**
   - ⚠️ Pending user confirmation
   - Standard Tailwind breakpoints (`sm:`, `md:`, `lg:`) found in files
   - Action: Run `npm run cleanup:fix` to auto-migrate via codemod

### **📊 Current Status**

- **TypeScript Errors:** ✅ 0 errors
- **ESLint Errors:** ⚠️ 26 violations found (use `npm run cleanup:check` to see details)
- **Prettier:** ✅ Configured and formatted
- **CI/CD:** ✅ Fully configured (includes cleanup-check job)
- **Breakpoints:** ✅ Documented and detected (use `npm run cleanup:check`)
- **Documentation:** ✅ Comprehensive standards in AGENTS.md and cleanup.mdc
- **Cleanup System:** ✅ Fully implemented with automated enforcement

<!-- redeploy: noop update at 2025-11-03 23:55Z -->
