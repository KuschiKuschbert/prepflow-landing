# PrepFlow A/B Testing Framework Guide

## Overview

The PrepFlow A/B Testing Framework is a comprehensive solution for running experiments on your landing page to optimize conversions. It integrates seamlessly with your existing analytics system and provides real-time insights into experiment performance.

## Features

- **Real-time A/B Testing**: Test different UI variations with automatic traffic splitting
- **Statistical Significance**: Built-in confidence calculations and winner determination
- **Conversion Tracking**: Automatic tracking of user interactions and conversions
- **Dashboard**: Real-time monitoring of experiment performance
- **React Hooks**: Easy integration with React components
- **Session Consistency**: Users see the same variant across sessions

## Quick Start

### 1. Basic Usage

```tsx
import { useABTest } from '../lib/hooks/useABTest';

function MyComponent() {
  const { variant, trackConversion } = useABTest('my_experiment');
  
  if (!variant) return <div>Loading...</div>;
  
  return (
    <button 
      onClick={() => trackConversion('button_click')}
      className={variant.config.buttonStyle}
    >
      {variant.config.buttonText}
    </button>
  );
}
```

### 2. Advanced Usage with Tracking

```tsx
import { useABTestWithTracking } from '../lib/hooks/useABTest';

function HeroSection() {
  const { variant, trackConversion } = useABTestWithTracking('hero_section_v1');
  
  const handleCTAClick = () => {
    trackConversion('cta_click', { 
      element: 'hero_cta',
      position: 'above_fold'
    });
  };
  
  return (
    <section className={variant?.config.layout}>
      <h1>{variant?.config.headline}</h1>
      <button onClick={handleCTAClick}>
        {variant?.config.ctaText}
      </button>
    </section>
  );
}
```

## Experiment Configuration

### Creating Experiments

```typescript
import { abTesting } from '../lib/ab-testing';

abTesting.addExperiment({
  id: 'button_color_test',
  name: 'Button Color Optimization',
  description: 'Testing different CTA button colors',
  variants: [
    {
      id: 'control',
      name: 'Control (Blue)',
      weight: 50,
      config: {
        color: 'blue',
        text: 'Get Started'
      }
    },
    {
      id: 'variant_a',
      name: 'Green Button',
      weight: 50,
      config: {
        color: 'green',
        text: 'Get Started'
      }
    }
  ],
  trafficSplit: 100,
  startDate: new Date(),
  isActive: true,
  primaryMetric: 'cta_click',
  minimumSampleSize: 1000
});
```

### Experiment Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique identifier for the experiment |
| `name` | string | Human-readable experiment name |
| `description` | string | Detailed description of what's being tested |
| `variants` | Variant[] | Array of test variations |
| `trafficSplit` | number | Percentage of traffic to test (0-100) |
| `startDate` | Date | When the experiment should start |
| `endDate` | Date? | Optional end date for the experiment |
| `isActive` | boolean | Whether the experiment is currently running |
| `primaryMetric` | string | Main conversion metric to track |
| `minimumSampleSize` | number | Minimum impressions needed for statistical significance |

## React Hooks

### useABTest(experimentId)

Basic hook for A/B testing.

```tsx
const { variant, isLoading, error, trackConversion, isActive } = useABTest('experiment_id');
```

**Returns:**
- `variant`: The assigned variant configuration
- `isLoading`: Whether the variant is still loading
- `error`: Any error that occurred
- `trackConversion`: Function to track conversions
- `isActive`: Whether the experiment is active

### useExperimentValue(experimentId, key, defaultValue)

Hook for getting specific values from variants.

```tsx
const buttonText = useExperimentValue('button_test', 'text', 'Get Started');
```

### useExperimentCondition(experimentId, condition)

Hook for conditional rendering based on variant properties.

```tsx
const showSocialProof = useExperimentCondition('hero_test', 
  (variant) => variant.config.showSocialProof === true
);
```

### useExperimentStats(experimentId)

Hook for getting experiment statistics.

```tsx
const { stats, isLoading } = useExperimentStats('experiment_id');
```

## Conversion Tracking

### Automatic Tracking

The framework automatically tracks:
- Page impressions
- User sessions
- Variant assignments

### Manual Conversion Tracking

```tsx
// Basic conversion
trackConversion('button_click');

// With metadata
trackConversion('form_submit', { 
  form_type: 'contact',
  page: 'landing'
});

// With value
trackConversion('purchase', { 
  product: 'premium_plan' 
}, 99.99);
```

## Dashboard

### Accessing the Dashboard

Navigate to `/ab-testing-demo` to see the A/B testing dashboard in action.

### Dashboard Features

- **Experiment Overview**: See all active experiments
- **Real-time Stats**: Monitor performance as it happens
- **Statistical Analysis**: Confidence levels and winner determination
- **Variant Comparison**: Side-by-side performance metrics

## Statistical Significance

### Confidence Calculation

The framework calculates confidence using:
- Sample size (impressions)
- Conversion rates
- Standard error calculations
- 95% confidence intervals

### Winner Determination

A variant is declared the winner when:
- It has the highest conversion rate
- Confidence level reaches 95% or higher
- Minimum sample size requirements are met

## Best Practices

### 1. Test One Variable at a Time

```typescript
// Good: Testing only button text
variants: [
  { config: { text: 'Get Started' } },
  { config: { text: 'Start Free Trial' } }
]

// Avoid: Testing multiple variables simultaneously
variants: [
  { config: { text: 'Get Started', color: 'blue', size: 'large' } },
  { config: { text: 'Start Free Trial', color: 'green', size: 'small' } }
]
```

### 2. Set Appropriate Sample Sizes

```typescript
// For high-traffic sites
minimumSampleSize: 1000

// For low-traffic sites
minimumSampleSize: 100
```

### 3. Monitor Statistical Significance

```tsx
const { stats } = useExperimentStats('experiment_id');
const winner = stats.find(stat => stat.isWinner);

if (winner) {
  console.log(`Winner: ${winner.variantId} with ${winner.confidence * 100}% confidence`);
}
```

### 4. Use Meaningful Metrics

```typescript
primaryMetric: 'cta_click'        // Good
primaryMetric: 'page_view'        // Avoid (too broad)
primaryMetric: 'form_submit'      // Good
primaryMetric: 'scroll_depth'     // Good
```

## Integration with Existing Analytics

The A/B testing framework integrates with your existing analytics system:

```typescript
// A/B test conversions are automatically tracked
trackConversion('cta_click');

// Also available in main analytics
analytics.trackEvent('conversion', 'business', 'cta_click');
```

## Performance Considerations

- **Client-side Rendering**: Variants are assigned on the client for real-time testing
- **Session Storage**: Variant assignments are cached for consistency
- **Minimal Overhead**: Framework adds minimal JavaScript bundle size
- **Lazy Loading**: Statistics are loaded on-demand

## Troubleshooting

### Common Issues

1. **Variant Not Loading**
   - Check if experiment is active
   - Verify experiment ID spelling
   - Check browser console for errors

2. **Conversions Not Tracking**
   - Ensure `trackConversion` is called
   - Check if variant is assigned
   - Verify experiment configuration

3. **Dashboard Not Updating**
   - Refresh page to see latest stats
   - Check if experiment has sufficient data
   - Verify minimum sample size requirements

### Debug Mode

Enable debug logging:

```typescript
// In browser console
localStorage.setItem('prepflow_debug', 'true');
```

## Advanced Features

### Custom Variant Assignment

```typescript
// Override default assignment logic
const customVariant = abTesting.getVariant('experiment_id', 'custom_session_id');
```

### Experiment Scheduling

```typescript
const experiment = {
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-02-01'),
  isActive: true
};
```

### Traffic Splitting

```typescript
// Test on 50% of traffic
trafficSplit: 50

// Test on all traffic
trafficSplit: 100
```

## Support

For questions or issues:
1. Check the demo page at `/ab-testing-demo`
2. Review browser console for error messages
3. Verify experiment configuration
4. Check statistical significance requirements

---

**Ready to start optimizing?** Visit `/ab-testing-demo` to see the framework in action!
