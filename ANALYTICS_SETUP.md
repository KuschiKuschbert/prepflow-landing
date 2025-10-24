# PrepFlow Analytics Setup Guide

## 🚀 **ANALYTICS SYSTEM OVERVIEW**

Your PrepFlow landing page now has a **comprehensive analytics system** that tracks:

- ✅ **User Behavior**: Clicks, scrolls, time on page
- ✅ **Conversions**: CTA clicks, demo views, pricing engagement
- ✅ **Performance**: Page load times, Core Web Vitals
- ✅ **Business Metrics**: Conversion rates, user journeys

## 📊 **WHAT'S ALREADY IMPLEMENTED**

### **1. Vercel Analytics** ✅

- **Status**: Fully implemented and active
- **Tracks**: Page views, performance metrics, user behavior
- **Dashboard**: Available in Vercel dashboard
- **Privacy**: GDPR compliant, no cookies required

### **2. Custom Analytics Service** ✅

- **Status**: Fully implemented and active
- **Tracks**: Custom events, conversions, performance
- **Dashboard**: Real-time dashboard (click 📈 button)
- **Export**: JSON data export functionality

### **3. Performance Monitoring** ✅

- **Status**: Fully implemented and active
- **Tracks**: Core Web Vitals, custom metrics
- **Real-time**: Live performance tracking
- **Console**: Performance logging in browser console

## 🔧 **SETUP INSTRUCTIONS**

### **Step 1: Environment Variables (Optional)**

Create a `.env.local` file in your project root for additional analytics services:

```bash
# Google Analytics 4 (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Facebook Pixel (Optional)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=XXXXXXXXXX

# Google Ads Conversion Tracking (Optional)
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXXXX

# Custom Tracking Endpoint (Optional)
NEXT_PUBLIC_CUSTOM_TRACKING_ENDPOINT=https://your-api.com/track
NEXT_PUBLIC_CUSTOM_TRACKING_API_KEY=your-api-key
```

### **Step 2: Enable Additional Services**

Edit `lib/analytics-config.ts` to enable the services you want:

```typescript
export const defaultAnalyticsConfig: AnalyticsConfig = {
  vercel: {
    enabled: true, // ✅ Already enabled
  },

  googleAnalytics: {
    enabled: true, // 🔄 Set to true to enable
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    debugMode: process.env.NODE_ENV === 'development',
  },

  facebookPixel: {
    enabled: true, // 🔄 Set to true to enable
    pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  },

  // ... other services
};
```

## 📈 **ANALYTICS DASHBOARD**

### **Access the Dashboard**

1. **Click the 📈 button** in the bottom-left corner of your landing page
2. **View real-time data** including:
   - Session information
   - Event counts
   - Conversion rates
   - Performance metrics
   - Recent events and conversions

### **Dashboard Features**

- **Real-time Updates**: Data refreshes every second
- **Session Tracking**: Unique session IDs and user IDs
- **Conversion Metrics**: Click-through rates and engagement
- **Performance Data**: Page load times and Core Web Vitals
- **Data Export**: Download analytics data as JSON

## 🎯 **TRACKING EVENTS**

### **Automatic Tracking**

The system automatically tracks:

#### **Page Views**

- Every page visit
- Referrer information
- User agent data
- Timestamp and session ID

#### **User Interactions**

- CTA button clicks
- Navigation link clicks
- Scroll depth (every 25%)
- Demo section views
- Pricing section engagement

#### **Performance Metrics**

- Page load times
- Core Web Vitals
- Custom performance metrics
- Error tracking

### **Manual Event Tracking**

You can manually track custom events in your components:

```typescript
import { trackEvent, trackConversion } from '../lib/analytics';

// Track a custom event
trackEvent('feature_usage', 'engagement', 'recipe_calculator', 1);

// Track a conversion
trackConversion({
  type: 'form_submit',
  element: 'contact_form',
  page: '/contact',
  timestamp: Date.now(),
  sessionId: getSessionId(),
  metadata: { formType: 'contact' },
});
```

## 🔍 **CONVERSION GOALS**

### **Pre-configured Goals**

The system tracks these conversion goals automatically:

1. **Hero CTA Click** ($1.00 value)
   - Tracks when users click main CTA buttons
   - Micro-conversion indicator

2. **Demo Section View** ($2.50 value)
   - Tracks when users scroll to demo section
   - Shows interest in product

3. **Pricing Section View** ($5.00 value)
   - Tracks when users view pricing
   - High-intent indicator

4. **Purchase Complete** ($29.00 value)
   - Tracks successful purchases
   - Macro-conversion goal

   - User engagement metric

### **Custom Conversion Goals**

Add your own conversion goals in `lib/analytics-config.ts`:

```typescript
export const conversionGoals: ConversionGoal[] = [
  // ... existing goals

  {
    id: 'newsletter_signup',
    name: 'Newsletter Signup',
    type: 'form_submit',
    target: '#newsletter-form',
    value: 150, // $1.50
    category: 'micro',
    description: 'User signed up for newsletter',
  },
];
```

## 📊 **DATA EXPORT & INTEGRATION**

### **Export Analytics Data**

1. **Open the analytics dashboard** (click 📈 button)
2. **Click "Export Analytics Data"**
3. **Download JSON file** with all tracking data
4. **Import to your analytics tools** (Google Sheets, Excel, etc.)

### **Data Format**

Exported data includes:

```json
{
  "sessionId": "session_1234567890_abc123",
  "userId": "user_123",
  "events": [...],
  "conversions": [...],
  "performance": [...]
}
```

### **Third-party Integration**

The system is designed to easily integrate with:

- **Google Analytics 4**
- **Facebook Pixel**
- **Google Ads**
- **Custom tracking endpoints**
- **CRM systems**
- **Marketing automation tools**

## 🚀 **PERFORMANCE OPTIMIZATION**

### **Analytics Performance**

- **Lightweight**: Minimal impact on page performance
- **Async Loading**: Non-blocking analytics initialization
- **Lazy Tracking**: Events are batched and sent efficiently
- **Privacy First**: Respects Do Not Track and privacy settings

### **Performance Monitoring**

Track these key metrics:

- **First Contentful Paint (FCP)**: < 1.8s target
- **Largest Contentful Paint (LCP)**: < 2.5s target
- **First Input Delay (FID)**: < 100ms target
- **Cumulative Layout Shift (CLS)**: < 0.1 target

## 🔒 **PRIVACY & COMPLIANCE**

### **Privacy Features**

- **Do Not Track**: Respects browser DNT settings
- **IP Anonymization**: Optional IP address anonymization
- **Cookie-Free**: No tracking cookies required
- **GDPR Compliant**: Built-in privacy controls

### **Data Retention**

- **Session-based**: Data stored for current session only
- **No Persistence**: No long-term data storage
- **User Control**: Users can export and delete their data
- **Transparency**: Clear data collection policies

## 🧪 **TESTING & DEBUGGING**

### **Development Mode**

In development, analytics events are logged to console:

```
📊 Analytics Event: { action: 'page_view', category: 'navigation', ... }
🎯 Conversion Event: { type: 'cta_click', element: 'Get Started', ... }
⚡ Performance Metrics: { pageLoadTime: 1250, ... }
```

### **Testing Checklist**

- [ ] Analytics dashboard loads correctly
- [ ] Events are tracked in console
- [ ] Conversions are recorded
- [ ] Performance metrics are captured
- [ ] Data export works properly

## 📈 **ANALYTICS INSIGHTS**

### **Key Metrics to Monitor**

1. **Conversion Rate**: CTA clicks / page views
2. **Engagement Rate**: Scroll depth and time on page
3. **Performance Score**: Page load times and Core Web Vitals
4. **User Journey**: Path from landing to conversion
5. **Drop-off Points**: Where users leave the funnel

### **Optimization Opportunities**

- **A/B Test CTAs**: Different button text and colors
- **Optimize Above-the-fold**: Improve hero section engagement
- **Reduce Friction**: Simplify conversion process
- **Performance Tuning**: Optimize page load times
- **Content Optimization**: Improve demo and pricing sections

## 🚀 **NEXT STEPS**

### **Immediate Actions**

1. **Test the analytics dashboard** (click 📈 button)
2. **Verify event tracking** in browser console
3. **Export sample data** to understand format
4. **Review conversion goals** and adjust if needed

### **Advanced Setup**

1. **Enable Google Analytics 4** for detailed insights
2. **Add Facebook Pixel** for retargeting campaigns
3. **Configure Google Ads** for conversion tracking
4. **Set up custom tracking** for specific business needs

### **Ongoing Optimization**

1. **Monitor conversion rates** weekly
2. **Analyze user behavior** patterns
3. **Optimize based on data** insights
4. **A/B test improvements** continuously

---

## 📞 **SUPPORT & QUESTIONS**

If you need help with analytics setup or have questions:

1. **Check the console** for error messages
2. **Review this documentation** for setup steps
3. **Test the dashboard** to verify functionality
4. **Export data** to validate tracking

**Your PrepFlow analytics system is now fully operational!** 🎉

Track conversions, optimize performance, and grow your restaurant software business with data-driven insights.
