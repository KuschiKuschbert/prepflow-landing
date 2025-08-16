import React from 'react';
import ABTestingDashboard from '../../components/ABTestingDashboard';
import { ABTestHeroSection, ABTestConditionalContent, ABTestPricingSection } from '../../components/ABTestExamples';

export default function ABTestingDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🔬 PrepFlow A/B Testing Demo
          </h1>
          <p className="text-gray-600 mt-2">
            See how A/B testing can optimize your landing page conversions
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="#hero" className="py-4 px-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500">
              Hero Section
            </a>
            <a href="#content" className="py-4 px-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500">
              Content Variations
            </a>
            <a href="#pricing" className="py-4 px-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500">
              Pricing Layout
            </a>
            <a href="#dashboard" className="py-4 px-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500">
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section A/B Test */}
      <section id="hero" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hero Section A/B Test
            </h2>
            <p className="text-gray-600">
              Testing different hero section layouts: centered vs left-aligned with social proof
            </p>
          </div>
          <ABTestHeroSection />
        </div>
      </section>

      {/* Content Variations A/B Test */}
      <section id="content" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Content Variations A/B Test
            </h2>
            <p className="text-gray-600">
              Testing conditional content rendering and CTA button variations
            </p>
          </div>
          <ABTestConditionalContent />
        </div>
      </section>

      {/* Pricing Layout A/B Test */}
      <section id="pricing" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pricing Layout A/B Test
            </h2>
            <p className="text-gray-600">
              Testing different pricing section layouts and feature displays
            </p>
          </div>
          <ABTestPricingSection />
        </div>
      </section>

      {/* A/B Testing Dashboard */}
      <section id="dashboard" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              A/B Testing Dashboard
            </h2>
            <p className="text-gray-600">
              Monitor experiment performance and analyze results in real-time
            </p>
          </div>
          <ABTestingDashboard />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            How A/B Testing Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Traffic Splitting</h3>
              <p className="text-gray-600 text-sm">
                Visitors are randomly assigned to different variants while maintaining consistency across sessions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Data Collection</h3>
              <p className="text-gray-600 text-sm">
                Track impressions, conversions, and user behavior for each variant in real-time
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Winner Selection</h3>
              <p className="text-gray-600 text-sm">
                Statistical analysis determines the winning variant with 95% confidence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Ready to Start A/B Testing?</h3>
          <p className="text-gray-400 mb-6">
            Integrate this framework into your landing page and start optimizing conversions today
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Get Started
          </button>
        </div>
      </footer>
    </div>
  );
}
