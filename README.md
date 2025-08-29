This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Analytics Setup

This project includes Google Analytics 4 integration with measurement ID `G-W1D5LQXGJT`.

### Google Analytics Configuration
- **Measurement ID**: G-W1D5LQXGJT
- **Tracking**: Page views, user interactions, conversions, and performance metrics
- **Privacy**: Respects Do Not Track and includes GDPR compliance features

### Environment Variables
Create a `.env.local` file with:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-W1D5LQXGJT
```

### Testing Analytics
1. Open browser developer tools
2. Check Console for analytics events (in development mode)
3. Verify Google Analytics Real-Time reports
4. Test conversion tracking on CTA clicks and form submissions

## A/B Testing Analytics

This project includes comprehensive A/B testing analytics with Google Analytics 4 integration.

### Features
- **Variant Assignment**: Automatic traffic splitting (25% each for 4 variants)
- **Performance Tracking**: Conversion rates, engagement metrics, and statistical significance
- **Real-time Results**: Live dashboard with variant performance comparison
- **Google Analytics Integration**: All A/B test events sent to GA4 with variant context

### Usage

#### Basic A/B Testing Hook
```tsx
import { useLandingPageABTest } from '../components/useABTest';

function MyComponent() {
  const { variantId, isLoading, trackEngagement } = useLandingPageABTest();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {variantId === 'control' && <OriginalHero />}
      {variantId === 'variant_a' && <AlternativeHero />}
      {variantId === 'variant_b' && <PricingHero />}
      {variantId === 'variant_c' && <CTAHero />}
      
      <button onClick={() => trackEngagement('cta_click')}>
        Get Started
      </button>
    </div>
  );
}
```

#### A/B Test Dashboard
```tsx
import ABTestDashboard from '../components/ABTestDashboard';

function AnalyticsPage() {
  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <ABTestDashboard testId="landing_page_variants" />
    </div>
  );
}
```

### Default Test Configuration
- **Control**: Original landing page (25% traffic)
- **Variant A**: Alternative hero section (25% traffic)
- **Variant B**: Different pricing layout (25% traffic)
- **Variant C**: New CTA positioning (25% traffic)

### Tracking Events
- `variant_assigned`: When user gets assigned to a variant
- `page_view`: Page views with variant context
- `conversion`: Purchase/conversion events per variant
- `engagement`: User interactions (clicks, scrolls, etc.)

### Google Analytics Integration
All A/B test events include custom parameters:
- `custom_parameter_test_id`: Test identifier
- `custom_parameter_variant_id`: Variant identifier
- `custom_parameter_user_id`: User identifier
- `custom_parameter_session_id`: Session identifier
