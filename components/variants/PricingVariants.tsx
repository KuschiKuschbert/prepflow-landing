'use client';

import React from 'react';

// Control Pricing (Original)
export function ControlPricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 shadow-2xl md:p-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-3xl font-bold tracking-tight md:text-4xl">Get Your Menu Clarity Tool</h3>
            <p className="mt-4 text-lg text-gray-300">Simple, powerful, and designed to give you the insights you need to make better decisions.</p>
            
            {/* Refund Policy */}
            <div className="mt-6 p-4 rounded-xl bg-[#29E7CD]/5 border border-[#29E7CD]/20">
              <div className="text-center">
                <h4 className="text-sm font-semibold text-[#29E7CD] mb-2">Our Refund Policy</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  PrepFlow is a digital product with instant access. That said, we want you to feel confident. 
                  If PrepFlow isn't what you expected, you can request a full refund within 7 days of purchase. 
                  No hoops, no hassle — just reply to your purchase email and let us know. After 7 days, all sales are final.
                </p>
              </div>
            </div>
              
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[#29E7CD]">✅</span>
                <span className="text-gray-300">Google Sheet template — ready to use immediately</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#29E7CD]">✅</span>
                <span className="text-gray-300">Automated COGS, GP%, GP$ per item</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#29E7CD]">✅</span>
                <span className="text-gray-300">Popularity & profit classes (Chef's Kiss etc.)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#29E7CD]">✅</span>
                <span className="text-gray-300">AI Method Generator for cooking optimization</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#29E7CD]">✅</span>
                <span className="text-gray-300">Comprehensive setup guide and resources</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#29E7CD]">✅</span>
                <span className="text-gray-300">7-day refund policy</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-600 bg-[#2a2a2a]/80 p-8 text-center shadow-lg">
            <p className="mt-2 text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
              AUD $29
            </p>
            <p className="text-sm text-gray-500">one-time purchase · Lifetime access</p>
            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
            >
              Start Now — Get Menu Clarity Today
            </a>
            <p className="mt-4 text-sm text-gray-500">Secure checkout via Gumroad</p>
            <p className="mt-2 text-xs text-gray-400">Not satisfied in 7 days? Full refund.</p>
            <p className="mt-2 text-xs text-[#29E7CD]">🌍 Global pricing available in USD, EUR, GBP, AUD</p>
            
            {/* Trust Indicators */}
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="text-green-500">🔒</span>
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-blue-500">🛡️</span>
                  <span>Privacy Focused</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-purple-500">✅</span>
                  <span>20 years of real kitchen experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Variant A - Value-Focused Pricing
export function VariantAPricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 shadow-2xl md:p-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Simple Pricing, Maximum Value</h3>
          <p className="text-lg text-gray-300">One tool. One price. Everything you need to optimize your menu profitability.</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-[#D925C7]/30 bg-gradient-to-br from-[#D925C7]/10 to-[#29E7CD]/10 p-8 text-center shadow-lg">
            <div className="mb-6">
              <p className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#D925C7] to-[#29E7CD] bg-clip-text text-transparent">
                AUD $29
              </p>
              <p className="text-lg text-gray-300 mt-2">One-time purchase</p>
              <p className="text-sm text-gray-500">Lifetime access · No recurring fees</p>
            </div>
            
            <div className="grid gap-4 mb-8 text-left">
              <div className="flex items-center gap-3">
                <span className="text-[#D925C7] text-xl">✓</span>
                <span className="text-gray-300">Complete Google Sheets template</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#D925C7] text-xl">✓</span>
                <span className="text-gray-300">Automated COGS calculations</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#D925C7] text-xl">✓</span>
                <span className="text-gray-300">Profit analysis & menu optimization</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#D925C7] text-xl">✓</span>
                <span className="text-gray-300">GST-ready for Australian businesses</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#D925C7] text-xl">✓</span>
                <span className="text-gray-300">AI-powered cooking insights</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#D925C7] text-xl">✓</span>
                <span className="text-gray-300">Setup guide & support resources</span>
              </div>
            </div>
            
            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#D925C7] to-[#29E7CD] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#D925C7]/25 transition-all duration-300"
            >
              Get PrepFlow Now
            </a>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">7-day refund policy · Secure checkout via Gumroad</p>
              <p className="text-xs text-gray-400 mt-2">🌍 Available in USD, EUR, GBP, AUD</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Variant B - Comparison Pricing
export function VariantBPricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 shadow-2xl md:p-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Why Choose PrepFlow?</h3>
          <p className="text-lg text-gray-300">Compare the cost and value of different solutions</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {/* Other Solutions */}
          <div className="rounded-2xl border border-gray-600 bg-[#2a2a2a]/80 p-6 text-center">
            <h4 className="text-xl font-semibold text-gray-300 mb-4">Other Restaurant Software</h4>
            <p className="text-3xl font-bold text-gray-400 mb-2">$500+</p>
            <p className="text-sm text-gray-500 mb-4">per month</p>
            <ul className="text-sm text-gray-400 space-y-2 text-left">
              <li>• Complex setup</li>
              <li>• Monthly fees</li>
              <li>• Learning curve</li>
              <li>• Limited customization</li>
            </ul>
          </div>
          
          {/* Consultants */}
          <div className="rounded-2xl border border-gray-600 bg-[#2a2a2a]/80 p-6 text-center">
            <h4 className="text-xl font-semibold text-gray-300 mb-4">Consultants</h4>
            <p className="text-3xl font-bold text-gray-400 mb-2">$2,000+</p>
            <p className="text-sm text-gray-500 mb-4">per project</p>
            <ul className="text-sm text-gray-400 space-y-2 text-left">
              <li>• Expensive</li>
              <li>• One-time analysis</li>
              <li>• No ongoing support</li>
              <li>• Limited availability</li>
            </ul>
          </div>
          
          {/* PrepFlow */}
          <div className="rounded-2xl border border-[#3B82F6]/30 bg-gradient-to-br from-[#3B82F6]/10 to-[#29E7CD]/10 p-6 text-center">
            <h4 className="text-xl font-semibold text-white mb-4">PrepFlow</h4>
            <p className="text-3xl font-bold text-[#3B82F6] mb-2">AUD $29</p>
            <p className="text-sm text-gray-300 mb-4">one-time</p>
            <ul className="text-sm text-gray-300 space-y-2 text-left">
              <li>• Simple setup</li>
              <li>• No monthly fees</li>
              <li>• Easy to use</li>
              <li>• Lifetime access</li>
            </ul>
            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#3B82F6]/25 transition-all duration-300"
            >
              Choose PrepFlow
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">7-day refund policy · Secure checkout · 20 years of kitchen experience</p>
        </div>
      </div>
    </section>
  );
}

// Variant C - Feature-Focused Pricing
export function VariantCPricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 shadow-2xl md:p-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-3xl font-bold tracking-tight md:text-4xl">Everything You Need</h3>
            <p className="mt-4 text-lg text-gray-300">One comprehensive tool for complete menu profitability analysis.</p>
            
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#29E7CD]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">📊</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Complete Dashboard</h4>
                  <p className="text-sm text-gray-400">COGS, GP%, profit analysis, and performance metrics</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#29E7CD]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">🧮</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Recipe Builder</h4>
                  <p className="text-sm text-gray-400">Automated calculations with yield and waste tracking</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#29E7CD]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">🇦🇺</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">GST Ready</h4>
                  <p className="text-sm text-gray-400">Australian tax compliance and multi-currency support</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#29E7CD]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">🤖</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">AI Insights</h4>
                  <p className="text-sm text-gray-400">Smart suggestions for margin improvement</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl border border-gray-600 bg-[#2a2a2a]/80 p-8 text-center">
            <p className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
              AUD $29
            </p>
            <p className="text-sm text-gray-500 mb-6">One-time purchase · Lifetime access</p>
            
            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
            >
              Get Complete Access
            </a>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">7-day refund policy</p>
              <p className="text-xs text-gray-400 mt-2">Secure checkout via Gumroad</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
