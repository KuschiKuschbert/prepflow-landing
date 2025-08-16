# PrepFlow A/B Testing Implementation

**Version:** 1.0  
**Date:** December 2024  
**Status:** Production Ready

## **Overview**

This document describes the comprehensive A/B testing implementation for the PrepFlow landing page, built using Next.js Edge Middleware and a professional experiment framework. The system provides enterprise-grade A/B testing capabilities with zero impact on user experience.

## **Architecture**

### **Core Components**

1. **Edge Middleware** (`middleware.ts`) - Server-side variant assignment
2. **Experiment Framework** (`lib/experiment.ts`) - Experiment configuration and management
3. **Tracking Library** (`lib/track.ts`) - Event tracking with PostHog fallback
4. **Variant Components** (`components/landing/variants/`) - Individual landing page variants
5. **Dashboard** (`/experiments`) - Real-time experiment monitoring
6. **API Endpoints** (`/api/events`) - Local event logging

### **Technology Stack**

- **Next.js 15** with App Router
- **Edge Middleware** for server-side processing
- **TypeScript** with strict mode
- **PostHog** (primary) + Local logging (fallback)
- **Cookie-based** user consistency
- **Statistical significance** calculations

## **Current Experiments**

### **landing_ab_001: Landing Page Conversion Optimization**

**Goal:** Improve primary CTA conversion rates  
**Traffic Split:** 25% each variant (control, v1, v2, v3)  
**Duration:** 2-4 weeks  
**Success Metrics:** Primary CTA clicks, purchases, scroll depth

#### **Variants**

- **Control:** Current landing page (baseline)
- **V1 (Clarity-first):** Simplified hero, 3 key benefits, single CTA
- **V2 (Trust-first):** Social proof above fold, refund policy near CTA
- **V3 (Action-first):** Pricing preview, prominent risk reduction

## **Setup Instructions**

### **1. Environment Variables**

Create `.env.local` with:

```bash
# PostHog Configuration (Primary)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Dashboard Access (Optional)
DASH_PASSWORD=your_dashboard_password
```

### **2. PostHog Setup**

1. Create PostHog account at [posthog.com](https://posthog.com)
2. Get your project API key
3. Add environment variables
4. Deploy to see events in real-time

### **3. Local Development**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## **How It Works**

### **Variant Assignment**

1. **User visits** landing page
2. **Edge Middleware** checks for existing user ID cookie (`pf_uid`)
3. **If new user:** Generates unique ID and assigns variant
4. **If returning user:** Retrieves assigned variant from cookie
5. **Variant cookie** (`pf_exp_landing_ab_001`) set for 30 days
6. **Page renders** appropriate variant component

### **User Consistency**

- **pf_uid cookie:** 1-year expiration, user identification
- **pf_exp_landing_ab_001 cookie:** 30-day expiration, variant assignment
- **Deterministic hashing:** Same user always sees same variant
- **Bot filtering:** Crawlers and bots always see control

### **Event Tracking**

#### **Primary Events**

- `page_view` - Page load with variant info
- `primary_cta_click` - Hero CTA button clicks
- `hero_cta_click` - Header CTA clicks
- `scroll_50` - 50% scroll depth reached
- `outbound_click_gumroad` - Gumroad outbound clicks
- `lead_magnet_submit` - Email form submissions

#### **Tracking Implementation**

```typescript
// Automatic tracking setup
import { initializeTracking } from '../lib/track';

// In variant component
React.useEffect(() => {
  initializeTracking('v1'); // or 'v2', 'v3', 'control'
}, []);
```

## **Variant Implementation**

### **Creating New Variants**

1. **Create component** in `components/landing/variants/V4.tsx`
2. **Add to experiment config** in `lib/experiment.ts`
3. **Update middleware** to handle new variant
4. **Add tracking** with `initializeTracking('v4')`

### **Variant Structure**

```typescript
'use client';

import React from 'react';
import { initializeTracking } from '../../../lib/track';

export default function V4() {
  React.useEffect(() => {
    initializeTracking('v4');
  }, []);

  return (
    // Your variant JSX here
  );
}
```

### **Modifying Existing Variants**

- **Keep changes minimal** and testable
- **Maintain brand voice** and visual identity
- **Test accessibility** and performance
- **Update documentation** for changes

## **Dashboard Usage**

### **Accessing Dashboard**

Visit `/experiments` to view real-time experiment data.

### **Key Metrics**

- **Variant Performance:** Impressions, CTR, conversion rates
- **Statistical Significance:** 95% confidence intervals
- **Conversion Funnel:** Views → CTA → Purchase
- **Recommendations:** Data-driven insights and next steps

### **Interpreting Results**

- **Statistical Significance:** 95% confidence level required
- **Sample Size:** Minimum 1,000 impressions per variant
- **Duration:** 2-4 weeks for reliable results
- **Winner Selection:** Based on primary metric (CTA clicks)

## **Monitoring & Analytics**

### **Real-time Monitoring**

- **PostHog Dashboard:** Live event tracking and funnels
- **Local Dashboard:** Basic metrics and variant comparison
- **Console Logs:** Development debugging and validation

### **Key Performance Indicators**

- **Primary CTA Click Rate:** Main conversion metric
- **Purchase Conversion:** Revenue impact measurement
- **Scroll Depth:** User engagement indicator
- **Time to CTA:** Speed of decision making

### **Alerting & Notifications**

- **Performance Monitoring:** Core Web Vitals tracking
- **Error Tracking:** Failed variant renders
- **Conversion Drops:** Significant performance declines

## **Best Practices**

### **Experiment Design**

1. **Clear Hypothesis:** Specific, testable predictions
2. **Minimal Changes:** One variable per variant
3. **Statistical Power:** Adequate sample sizes
4. **Duration Planning:** Sufficient time for significance

### **Implementation**

1. **User Consistency:** Same variant across sessions
2. **Performance Impact:** Minimal overhead
3. **Accessibility:** Maintain a11y standards
4. **Mobile Optimization:** Responsive variant design

### **Analysis**

1. **Statistical Rigor:** 95% confidence intervals
2. **Multiple Metrics:** Primary + secondary KPIs
3. **Context Consideration:** External factors and seasonality
4. **Actionable Insights:** Clear next steps and recommendations

## **Troubleshooting**

### **Common Issues**

#### **Variant Not Loading**

```bash
# Check middleware logs
npm run dev

# Verify cookie settings
# Check browser developer tools > Application > Cookies
```

#### **Tracking Not Working**

```bash
# Verify PostHog configuration
echo $NEXT_PUBLIC_POSTHOG_KEY

# Check console for tracking errors
# Verify event endpoint (/api/events)
```

#### **Performance Issues**

```bash
# Monitor Core Web Vitals
# Check bundle size impact
# Verify image optimization
```

### **Debug Mode**

Enable debug logging in development:

```typescript
// In lib/track.ts
if (process.env.NODE_ENV === 'development') {
  console.log('📊 Tracking Event:', { event, properties });
}
```

## **Deployment**

### **Vercel Deployment**

1. **Push to main branch**
2. **Vercel auto-deploys** with Edge Middleware
3. **Environment variables** configured in Vercel dashboard
4. **PostHog events** begin flowing immediately

### **Production Checklist**

- [ ] Environment variables set
- [ ] PostHog project configured
- [ ] Edge Middleware enabled
- [ ] Variant components tested
- [ ] Dashboard accessible
- [ ] Monitoring alerts configured

### **Rollback Procedure**

1. **Emergency rollback:** Set all traffic to control in middleware
2. **Gradual rollback:** Adjust traffic splits gradually
3. **Data preservation:** Maintain experiment data for analysis

## **Future Enhancements**

### **Planned Features**

1. **Multi-page Experiments:** Cross-page variant testing
2. **Personalization:** User segment-based variants
3. **Advanced Analytics:** Machine learning insights
4. **A/B Testing API:** External experiment management

### **Scalability Improvements**

1. **Redis Integration:** Distributed variant storage
2. **Real-time Updates:** Live variant switching
3. **Advanced Targeting:** Behavioral and demographic targeting
4. **Experiment Templates:** Reusable experiment configurations

## **Support & Resources**

### **Documentation**

- [Landing Page Audit](./landing-audit.md)
- [Experiment Configuration](./experiments.yaml)
- [Vercel Edge Middleware Docs](https://vercel.com/docs/functions/edge-middleware)
- [PostHog Documentation](https://posthog.com/docs)

### **Team Contacts**

- **Engineering Lead:** Senior Full-Stack Engineer
- **Product Owner:** PrepFlow Team
- **Analytics:** PostHog Implementation

### **Emergency Contacts**

- **Critical Issues:** Immediate rollback procedures
- **Performance Issues:** Core Web Vitals monitoring
- **Data Issues:** PostHog support escalation

---

**Last Updated:** December 2024  
**Next Review:** January 2025  
**Version:** 1.0
