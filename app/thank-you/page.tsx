'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#29E7CD]/10 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-[#D925C7]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 rounded-full bg-[#3B82F6]/10 blur-3xl" />
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
            <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-xl font-bold tracking-tight text-transparent">
              PrepFlow
            </span>
          </div>
          <div className="hidden md:block">
            <a
              href="/"
              className="rounded-2xl border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 transition-all duration-300 hover:border-[#29E7CD] hover:text-[#29E7CD]"
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
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6]">
                <svg
                  className="h-12 w-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Message - Post-Purchase */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to PrepFlow!{' '}
            <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
              🎉
            </span>
          </h1>

          <p className="mb-8 max-w-3xl text-xl leading-8 text-gray-300">
            Your menu profit clarity tool is ready. Check your email for access and setup
            instructions.
          </p>

          {/* Access Box */}
          <div className="mb-12 w-full max-w-2xl">
            <div className="rounded-2xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-8 shadow-2xl backdrop-blur-sm">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-semibold text-white">PrepFlow Tool Access</p>
                    <p className="text-gray-300">
                      Your Google Sheet template is ready — check your email for the access link.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold text-white">Setup Guide</p>
                    <p className="text-gray-300">
                      Complete setup instructions sent to your email — check spam if you don't see
                      it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Get Started CTA */}
          <div className="mb-12 w-full max-w-3xl">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Ready to see your menu's true margins?
            </h2>
            <p className="mb-8 text-lg text-gray-300">
              In 15 minutes you could be analyzing your menu profitability and making data-driven
              pricing decisions.
            </p>
            <a
              href="#"
              className="inline-flex rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#29E7CD]/25"
            >
              Get Started Now
            </a>
          </div>

          {/* Quick Wins Checklist */}
          <div className="mb-12 w-full max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-100">Quick Wins in 15 Minutes</h2>
            <div className="rounded-2xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-8 shadow-2xl backdrop-blur-sm">
              <p className="mb-6 text-lg text-gray-300">In your first 15 minutes with PrepFlow:</p>
              <div className="mb-8 grid gap-4 text-left md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/20">
                    <span className="text-sm font-bold text-[#29E7CD]">1</span>
                  </div>
                  <span className="text-gray-300">Toggle GST for AU settings</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/20">
                    <span className="text-sm font-bold text-[#29E7CD]">2</span>
                  </div>
                  <span className="text-gray-300">Add 3 key ingredients + supplier costs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/20">
                    <span className="text-sm font-bold text-[#29E7CD]">3</span>
                  </div>
                  <span className="text-gray-300">Paste last week's sales export</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/20">
                    <span className="text-sm font-bold text-[#29E7CD]">4</span>
                  </div>
                  <span className="text-gray-300">
                    See top 5 profit leaks → fix 1 price or portion today
                  </span>
                </div>
              </div>
              <div className="text-center">
                <a
                  href="#"
                  className="inline-flex rounded-2xl bg-gradient-to-r from-[#D925C7] to-[#29E7CD] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#D925C7]/25"
                >
                  Start Setup Now
                </a>
              </div>
            </div>
          </div>

          {/* Social Proof & Trust Strip */}
          <div className="mb-12 w-full max-w-4xl">
            <div className="rounded-2xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/5 to-[#D925C7]/5 p-8 shadow-2xl backdrop-blur-sm">
              {/* Testimonial Section */}
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-4 py-2">
                  <span className="text-sm text-[#29E7CD]">⭐</span>
                  <span className="text-sm font-medium text-[#29E7CD]">Real Results</span>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 -left-4 text-4xl text-[#29E7CD]">"</span>
                  <p className="mb-4 px-8 text-xl leading-relaxed text-gray-200 italic">
                    PrepFlow showed me exactly which menu items were killing my margins. I fixed
                    pricing on 3 dishes and saw a 12% increase in gross profit within 2 weeks.
                  </p>
                  <span className="absolute -right-4 -bottom-2 text-4xl text-[#29E7CD]">"</span>
                </div>
                <div className="mb-2 flex items-center justify-center gap-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg text-[#29E7CD]">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  — <span className="font-medium text-[#29E7CD]">Sarah Chen</span>, Owner,{' '}
                  <span className="text-gray-300">The Corner Café</span>, Brisbane
                </p>
              </div>

              {/* Trust Elements Grid */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center gap-3 rounded-xl border border-[#29E7CD]/20 bg-[#29E7CD]/5 p-4 transition-all duration-300 hover:border-[#29E7CD]/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/20">
                    <span className="text-xl text-[#29E7CD]">🔒</span>
                  </div>
                  <div className="text-center">
                    <p className="mb-1 text-sm font-medium text-white">Your Data, Your Control</p>
                    <p className="text-xs text-gray-400">Stays in Google Drive. Cancel anytime.</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 rounded-xl border border-[#D925C7]/20 bg-[#D925C7]/5 p-4 transition-all duration-300 hover:border-[#D925C7]/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D925C7]/30 bg-[#D925C7]/20">
                    <span className="text-xl text-[#D925C7]">✅</span>
                  </div>
                  <div className="text-center">
                    <p className="mb-1 text-sm font-medium text-white">7-Day Refund Policy</p>
                    <p className="text-xs text-gray-400">
                      Not satisfied? Full refund within 7 days.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 rounded-xl border border-[#3B82F6]/20 bg-[#3B82F6]/5 p-4 transition-all duration-300 hover:border-[#3B82F6]/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/20">
                    <span className="text-xl text-[#3B82F6]">🇦🇺</span>
                  </div>
                  <div className="text-center">
                    <p className="mb-1 text-sm font-medium text-white">Built for AU</p>
                    <p className="text-xs text-gray-400">GST-ready for Aussie hospitality.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support & Next Touch */}
          <div className="mb-12 w-full max-w-3xl">
            <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 p-8 shadow-2xl backdrop-blur-sm">
              <h3 className="mb-4 text-xl font-semibold text-white">Support & What's Next</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-xl text-[#29E7CD]">📧</span>
                  <div>
                    <p className="text-gray-300">
                      Need help? Email us at{' '}
                      <a
                        href="mailto:support@prepflow.org"
                        className="text-[#29E7CD] hover:underline"
                      >
                        support@prepflow.org
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <a
              href="/"
              className="rounded-2xl border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 transition-all duration-300 hover:border-[#29E7CD] hover:text-[#29E7CD]"
            >
              ← Back to Homepage
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
