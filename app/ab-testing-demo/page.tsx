'use client';

import React from 'react';

export default function ABTestingDemoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="flex items-center justify-between py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img 
            src="/images/prepflow-logo.png" 
            alt="PrepFlow Logo"
            className="h-12 w-auto"
            loading="eager"
            width="48"
            height="48"
          />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
            PrepFlow
          </span>
        </div>
        <a href="/" className="text-gray-300 hover:text-[#29E7CD] transition-colors">
          ← Back to Landing Page
        </a>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
            PrepFlow <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">Performance</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our landing page is continuously optimized using professional A/B testing to maximize your conversion rates and improve user experience.
          </p>
        </section>

        {/* Current Experiments */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Active Optimization Experiments</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Hero Section Test */}
            <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#29E7CD] to-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Hero Layout</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Control (Centered):</span>
                  <span className="text-[#29E7CD]">50%</span>
                </div>
                <div className="flex justify-between">
                  <span>Variant A (Left-aligned):</span>
                  <span className="text-[#29E7CD]">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Variant B (Social proof):</span>
                  <span className="text-[#29E7CD]">25%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Testing different hero section layouts for optimal engagement
              </p>
            </div>

            {/* CTA Button Test */}
            <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D925C7] to-[#29E7CD] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-white">CTA Buttons</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Control:</span>
                  <span className="text-[#29E7CD]">50%</span>
                </div>
                <div className="flex justify-between">
                  <span>Variant A:</span>
                  <span className="text-[#29E7CD]">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Variant B:</span>
                  <span className="text-[#29E7CD]">25%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Optimizing button text and colors for maximum clicks
              </p>
            </div>

            {/* Pricing Layout Test */}
            <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#D925C7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Pricing Layout</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Control (Cards):</span>
                  <span className="text-[#29E7CD]">70%</span>
                </div>
                <div className="flex justify-between">
                  <span>Variant A (Table):</span>
                  <span className="text-[#29E7CD]">30%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Testing different pricing presentations for better conversion
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">How Our Optimization Works</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#29E7CD] to-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Traffic Splitting</h3>
              <p className="text-gray-300 text-sm">
                Visitors are automatically assigned to different variants while maintaining consistency across sessions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D925C7] to-[#29E7CD] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-time Analytics</h3>
              <p className="text-gray-300 text-sm">
                We continuously monitor performance metrics to identify which variants drive better results
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#D925C7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Automatic Optimization</h3>
              <p className="text-gray-300 text-sm">
                Winning variants are automatically implemented to continuously improve your experience
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-10 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8">Why This Matters for You</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#29E7CD] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Better User Experience</h3>
                  <p className="text-gray-300 text-sm">We continuously optimize the interface to make it easier and more engaging for you to use</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#29E7CD] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Higher Conversion Rates</h3>
                  <p className="text-gray-300 text-sm">Optimized layouts and messaging help more visitors become customers</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#29E7CD] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Data-Driven Decisions</h3>
                  <p className="text-gray-300 text-sm">Every change is based on real user behavior, not guesswork</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#29E7CD] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Continuous Improvement</h3>
                  <p className="text-gray-300 text-sm">The landing page gets better over time, improving your experience</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Optimized PrepFlow?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Visit our main landing page to see the current optimization variants in action. 
            Each visit might show you a different, optimized version of the page.
          </p>
          <a
            href="/"
            className="inline-flex rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
          >
            Visit Landing Page
          </a>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-700 py-12 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PrepFlow. All rights reserved. | 
            <span className="text-[#29E7CD] ml-2">Continuously optimized for your success</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
