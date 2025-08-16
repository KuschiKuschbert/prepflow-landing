'use client';

import React from 'react';
import { useABTestWithTracking, useExperimentValue, useExperimentCondition } from '../lib/hooks/useABTest';

// Example 1: Hero Section with A/B Testing
export function ABTestHeroSection() {
  const { variant, trackConversion } = useABTestWithTracking('hero_section_v1');

  const handleCTAClick = () => {
    trackConversion('cta_click', { element: 'hero_cta' });
    // Your actual CTA logic here
  };

  const handleDemoClick = () => {
    trackConversion('demo_watch', { element: 'hero_demo' });
    // Your actual demo logic here
  };

  if (!variant) {
    return <div>Loading...</div>;
  }

  const { layout, ctaText, ctaColor, showDemoButton, showSocialProof } = variant.config;

  return (
    <section className={`py-20 ${layout === 'left_aligned' ? 'text-left' : 'text-center'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
          layout === 'left_aligned' ? 'lg:text-left' : 'lg:text-center'
        }`}>
          <div className={layout === 'left_aligned' ? 'order-2 lg:order-1' : 'order-1'}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Streamline Your Kitchen Operations
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              PrepFlow helps professional kitchens manage inventory, recipes, and staff scheduling 
              with AI-powered insights and real-time collaboration.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 ${
              layout === 'left_aligned' ? 'justify-start' : 'justify-center'
            }`}>
              <button
                onClick={handleCTAClick}
                className={`px-8 py-4 text-lg font-semibold rounded-lg transition-colors ${
                  ctaColor === 'primary' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : ctaColor === 'secondary'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {ctaText}
              </button>
              
              {showDemoButton && (
                <button
                  onClick={handleDemoClick}
                  className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Watch Demo
                </button>
              )}
            </div>

            {showSocialProof && (
              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-3">Example social section (demo content)</p>
              </div>
            )}
          </div>
          
          <div className={layout === 'left_aligned' ? 'order-1 lg:order-2' : 'order-2'}>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Hero Image/Video</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Example 2: CTA Button with A/B Testing
export function ABTestCTAButton() {
  const { variant, trackConversion } = useABTestWithTracking('cta_button_v1');

  const handleClick = () => {
    trackConversion('cta_click', { 
      element: 'cta_button',
      variant: variant?.id,
      text: variant?.config.text 
    });
    // Your actual CTA logic here
  };

  if (!variant) {
    return <button className="px-6 py-3 bg-gray-300 text-gray-600 rounded-lg">Loading...</button>;
  }

  const { text = 'Get Started', color = 'primary', size = 'large' } = variant.config as { text?: string; color?: 'primary' | 'secondary' | 'accent'; size?: 'small' | 'medium' | 'large' };

  const buttonClasses: Record<string, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-green-600 hover:bg-green-700 text-white',
    accent: 'bg-purple-600 hover:bg-purple-700 text-white'
  };

  const sizeClasses: Record<string, string> = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={handleClick}
      className={`font-semibold rounded-lg transition-colors ${buttonClasses[color]} ${sizeClasses[size]}`}
    >
      {text}
    </button>
  );
}

// Example 3: Conditional Content Rendering
export function ABTestConditionalContent() {
  const showSocialProof = useExperimentCondition('hero_section_v1', 
    (variant) => variant.config.showSocialProof === true
  );

  const ctaText = useExperimentValue('cta_button_v1', 'text', 'Get Started');

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Transform Your Kitchen?
        </h2>
        
        <p className="text-lg text-gray-600 mb-8">
          This is a demo section to show conditional rendering with A/B tests.
        </p>

        <div className="mb-8">
          <ABTestCTAButton />
        </div>

        {showSocialProof && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">What Our Customers Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">🍽️</div>
                <p className="text-gray-600">&quot;Reduced prep time by 40%&quot;</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⭐</div>
                <p className="text-gray-600">&quot;Intuitive and powerful&quot;</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🚀</div>
                <p className="text-gray-600">&quot;Game changer for our kitchen&quot;</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Example 4: Pricing Section with A/B Testing
export function ABTestPricingSection() {
  const { variant, trackConversion } = useABTestWithTracking('pricing_layout_v1');

  const handlePricingClick = (plan: string) => {
    trackConversion('pricing_view', { 
      element: 'pricing_card',
      plan,
      variant: variant?.id 
    });
  };

  // Default pricing if no variant is assigned
  const pricingVariant = variant?.config || {
    layout: 'cards',
    showFeatures: true,
    highlightPopular: true,
    ctaText: 'Get the Google Sheet'
  };

  const plans = [
    {
      name: 'PrepFlow Sheet',
      price: 'AUD $29',
      period: '',
      features: ['Google Sheet template', 'Setup guide', 'Sample data', '7-day refund'],
      popular: true
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Choose the plan that fits your kitchen&apos;s needs
          </p>
        </div>

        <div className={`grid gap-8 ${
          pricingVariant.layout === 'cards' 
            ? 'grid-cols-1 md:grid-cols-3' 
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border-2 transition-all cursor-pointer ${
                plan.popular && pricingVariant.highlightPopular
                  ? 'border-blue-500 bg-blue-50 scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
              }`}
              onClick={() => handlePricingClick(plan.name)}
            >
              {plan.popular && pricingVariant.highlightPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {plan.price}
                  <span className="text-lg text-gray-600">{plan.period}</span>
                </div>
              </div>

              {pricingVariant.showFeatures && (
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                plan.popular && pricingVariant.highlightPopular
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}>
                {pricingVariant.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
