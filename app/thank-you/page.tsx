

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#29E7CD]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#D925C7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between py-8">
          <div className="flex items-center gap-3">
            <Image 
              src="/images/prepflow-logo.png" 
              alt="PrepFlow Logo" 
              width={48}
              height={48}
              className="h-12 w-auto"
              priority
            />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
              PrepFlow
            </span>
          </div>
          <div className="hidden md:block">
            <a
              href="/"
              className="rounded-2xl border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-[#29E7CD] hover:text-[#29E7CD] transition-all duration-300"
            >
              Back to Home
            </a>
          </div>
        </header>

        {/* Thank You Content */}
        <section className="flex flex-col items-center justify-center py-24 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 blur-2xl" />
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] flex items-center justify-center">
                <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Message - Post-Purchase */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
            Welcome to PrepFlow!{" "}
            <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
              🎉
            </span>
          </h1>
          
          <p className="text-xl leading-8 text-gray-300 max-w-3xl mb-8">
            Your menu profit clarity tool is ready. Check your email for access and setup instructions.
          </p>

          {/* Access Box */}
          <div className="w-full max-w-2xl mb-12">
            <div className="rounded-2xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-8 shadow-2xl">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-semibold text-white">PrepFlow Tool Access</p>
                    <p className="text-gray-300">Your Google Sheet template is ready — check your email for the access link.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold text-white">Setup Guide</p>
                    <p className="text-gray-300">Complete setup instructions sent to your email — check spam if you don't see it.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Get Started CTA */}
          <div className="w-full max-w-3xl mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to see your menu's true margins?</h2>
            <p className="text-lg text-gray-300 mb-8">
              In 15 minutes you could be analyzing your menu profitability and making data-driven pricing decisions.
            </p>
            <a
              href="#"
              className="inline-flex rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
            >
              Get Started Now
            </a>
          </div>

          {/* Quick Wins Checklist */}
          <div className="w-full max-w-4xl mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-100">Quick Wins in 15 Minutes</h2>
            <div className="rounded-2xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-8 shadow-2xl">
              <p className="text-lg text-gray-300 mb-6">In your first 15 minutes with PrepFlow:</p>
              <div className="grid md:grid-cols-2 gap-4 text-left mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#29E7CD]/20 border border-[#29E7CD]/30 flex items-center justify-center">
                    <span className="text-[#29E7CD] text-sm font-bold">1</span>
                  </div>
                  <span className="text-gray-300">Toggle GST for AU settings</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#29E7CD]/20 border border-[#29E7CD]/30 flex items-center justify-center">
                    <span className="text-[#29E7CD] text-sm font-bold">2</span>
                  </div>
                  <span className="text-gray-300">Add 3 key ingredients + supplier costs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#29E7CD]/20 border border-[#29E7CD]/30 flex items-center justify-center">
                    <span className="text-[#29E7CD] text-sm font-bold">3</span>
                  </div>
                  <span className="text-gray-300">Paste last week's sales export</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#29E7CD]/20 border border-[#29E7CD]/30 flex items-center justify-center">
                    <span className="text-[#29E7CD] text-sm font-bold">4</span>
                  </div>
                  <span className="text-gray-300">See top 5 profit leaks → fix 1 price or portion today</span>
                </div>
              </div>
              <div className="text-center">
                <a
                  href="#"
                  className="inline-flex rounded-2xl bg-gradient-to-r from-[#D925C7] to-[#29E7CD] px-6 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#D925C7]/25 transition-all duration-300"
                >
                  Start Setup Now
                </a>
              </div>
            </div>
          </div>

          {/* Social Proof & Trust Strip */}
          <div className="w-full max-w-4xl mb-12">
            <div className="rounded-2xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/5 to-[#D925C7]/5 backdrop-blur-sm p-8 shadow-2xl">
              {/* Testimonial Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#29E7CD]/10 border border-[#29E7CD]/20">
                  <span className="text-[#29E7CD] text-sm">⭐</span>
                  <span className="text-[#29E7CD] text-sm font-medium">Real Results</span>
                </div>
                <div className="relative">
                  <span className="text-4xl text-[#29E7CD] absolute -left-4 -top-2">"</span>
                  <p className="text-xl text-gray-200 italic mb-4 px-8 leading-relaxed">
                    PrepFlow showed me exactly which menu items were killing my margins. I fixed pricing on 3 dishes and saw a 12% increase in gross profit within 2 weeks.
                  </p>
                  <span className="text-4xl text-[#29E7CD] absolute -right-4 -bottom-2">"</span>
                </div>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-[#29E7CD] text-lg">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  — <span className="text-[#29E7CD] font-medium">Sarah Chen</span>, Owner, <span className="text-gray-300">The Corner Café</span>, Brisbane
                </p>
              </div>
              
              {/* Trust Elements Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#29E7CD]/5 border border-[#29E7CD]/20 hover:border-[#29E7CD]/40 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#29E7CD]/20 border border-[#29E7CD]/30 flex items-center justify-center">
                    <span className="text-[#29E7CD] text-xl">🔒</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white mb-1">Your Data, Your Control</p>
                    <p className="text-xs text-gray-400">Stays in Google Drive. Cancel anytime.</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#D925C7]/5 border border-[#D925C7]/20 hover:border-[#D925C7]/40 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#D925C7]/20 border border-[#D925C7]/30 flex items-center justify-center">
                    <span className="text-[#D925C7] text-xl">✅</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white mb-1">7-Day Refund Policy</p>
                    <p className="text-xs text-gray-400">Not satisfied? Full refund within 7 days.</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#3B82F6]/5 border border-[#3B82F6]/20 hover:border-[#3B82F6]/40 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 flex items-center justify-center">
                    <span className="text-[#3B82F6] text-xl">🇦🇺</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white mb-1">Built for AU</p>
                    <p className="text-xs text-gray-400">GST-ready for Aussie hospitality.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support & Next Touch */}
          <div className="w-full max-w-3xl mb-12">
            <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 text-white">Support & What's Next</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-[#29E7CD] text-xl">📧</span>
                  <div>
                    <p className="text-gray-300">Need help? Email us at <a href="mailto:support@prepflow.org" className="text-[#29E7CD] hover:underline">support@prepflow.org</a></p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <a 
              href="/"
              className="rounded-2xl border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-[#29E7CD] hover:text-[#29E7CD] transition-all duration-300"
            >
              ← Back to Homepage
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
