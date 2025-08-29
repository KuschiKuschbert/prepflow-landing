# PrepFlow - AI Agent Instructions

## 🎯 **Project Overview**

PrepFlow is a restaurant profitability optimization tool that helps cafés, restaurants, and food trucks analyze their menu costs, calculate COGS, and optimize gross profit margins. The tool is built as a Google Sheets template with automated calculations and AI-powered insights.

**Target Market:** Independent restaurants, cafés, food trucks in Australia and globally
**Primary Goal:** Convert visitors into customers through lead generation and direct sales
**Business Model:** One-time purchase ($29 AUD) with 7-day refund policy

## 🏗️ **Technical Architecture**

### **Framework & Stack**
- **Frontend:** Next.js 15.4.6 with React 19
- **Styling:** Tailwind CSS 4 with custom CSS variables
- **Analytics:** Google Analytics 4, Google Tag Manager, Vercel Analytics
- **Deployment:** Vercel platform
- **Payment:** Gumroad integration

### **Key Components**
- **Analytics Stack:** ExitIntentTracker, ScrollTracker, PerformanceTracker
- **GTM Integration:** GoogleTagManager with data layer management
- **SEO Components:** Structured data, meta tags, OpenGraph
- **UI Components:** Custom Button, Card, and form components

### **File Structure**
```
app/
├── layout.tsx          # Root layout with metadata and analytics
├── page.tsx            # Main landing page
├── thank-you/          # Post-purchase page
├── cancelled/          # Cancelled purchase page
└── globals.css         # Global styles and CSS variables

components/
├── ui/                 # Reusable UI components
├── GoogleAnalytics.tsx # GA4 integration
├── GoogleTagManager.tsx # GTM integration
├── ExitIntentTracker.tsx # User exit detection
├── ScrollTracker.tsx   # Scroll depth tracking
└── PerformanceTracker.tsx # Core Web Vitals

lib/
├── analytics.ts        # Analytics service
├── analytics-config.ts # Analytics configuration
├── gtm-config.ts      # GTM configuration
└── ab-testing-analytics.ts # A/B testing system
```

## 📋 **Development Standards**

### **Code Quality Requirements**
- **TypeScript:** Strict typing, no `any` types without justification
- **React Patterns:** Functional components with hooks, proper error boundaries
- **Performance:** Lazy loading, image optimization, Core Web Vitals optimization
- **Accessibility:** ARIA labels, semantic HTML, keyboard navigation support
- **SEO:** Proper meta tags, structured data, semantic markup

### **Naming Conventions**
- **Files:** kebab-case (e.g., `exit-intent-tracker.tsx`)
- **Components:** PascalCase (e.g., `ExitIntentTracker`)
- **Functions:** camelCase with descriptive verbs (e.g., `trackUserEngagement`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `GTM_EVENTS`)
- **CSS Classes:** Tailwind utility classes with custom CSS variables

### **Testing Requirements**
- **Unit Tests:** All utility functions and components
- **Integration Tests:** Analytics integration and user flows
- **E2E Tests:** Critical user journeys (lead capture, purchase)
- **Performance Tests:** Core Web Vitals and loading times

## 🎨 **Design System**

### **Color Palette**
```css
--primary: #29E7CD      /* Electric Cyan */
--secondary: #3B82F6    /* Blue */
--accent: #D925C7       /* Vibrant Magenta */
--background: #0a0a0a   /* Dark background */
--foreground: #ffffff    /* White text */
--muted: #1f1f1f        /* Dark gray */
--border: #2a2a2a       /* Border gray */
```

### **Typography**
- **Primary Font:** Geist Sans (Google Fonts)
- **Monospace:** Geist Mono (for technical content)
- **Hierarchy:** H1 (4xl-6xl), H2 (3xl-4xl), H3 (2xl-3xl), Body (base-lg)

### **Component Guidelines**
- **Buttons:** Gradient backgrounds, rounded corners, hover effects
- **Cards:** Dark backgrounds with borders, backdrop blur effects
- **Forms:** Clean inputs with focus states, proper validation
- **Navigation:** Smooth scrolling, active states, mobile responsive

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

### **Git Strategy**
- **Main Branch:** Production-ready code
- **Feature Branches:** New features and improvements
- **Hotfix Branches:** Critical bug fixes
- **Commit Messages:** Conventional commits with descriptive messages

### **Deployment Process**
- **Development:** Local development with hot reload
- **Staging:** Vercel preview deployments
- **Production:** Automatic deployment from main branch
- **Monitoring:** Performance metrics, error tracking, analytics

### **Quality Assurance**
- **Code Review:** All changes require review
- **Testing:** Automated tests must pass
- **Performance:** Core Web Vitals monitoring
- **Accessibility:** WCAG 2.1 AA compliance

## 📱 **Mobile Optimization**

### **Responsive Design**
- **Breakpoints:** Mobile-first approach
- **Touch Targets:** Minimum 44px for interactive elements
- **Navigation:** Mobile-friendly menu and navigation
- **Forms:** Touch-optimized input fields

### **Performance**
- **Mobile Speed:** Optimized for slower connections
- **Image Sizing:** Appropriate sizes for mobile devices
- **Touch Interactions:** Smooth scrolling, proper touch events
- **Viewport:** Proper meta viewport configuration

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
1. **Lead Magnet Form:** Currently non-functional, needs email capture
2. **Image Optimization:** Large images without proper sizing
3. **Accessibility:** Missing form labels and focus management
4. **Legal Pages:** Privacy Policy and Terms of Service missing
5. **Performance:** Core Web Vitals optimization needed

### **Conversion Blockers**
1. **No Exit-Intent Capture:** Users leaving without lead capture
2. **Form Validation:** No error handling or success states
3. **Trust Indicators:** Missing security badges and company info
4. **Urgency Elements:** No real countdown or scarcity triggers

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

---

**Remember:** PrepFlow is a high-converting landing page that needs to balance technical excellence with conversion optimization. Every change should be measured and optimized for maximum impact on both user experience and business results.
