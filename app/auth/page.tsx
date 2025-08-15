'use client';

import { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import SignupForm from '../../components/auth/SignupForm';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

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
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-[#0a0a0a] p-0.5 border border-gray-700">
                <div className="h-full w-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
                  {/* Main large cyan circle (upper left portion) */}
                  <div className="absolute top-1 left-1 h-6 w-6 bg-[#29E7CD] rounded-full opacity-90" />
                  
                  {/* Overlapping organic shapes */}
                  <div className="absolute top-2 right-2 h-5 w-6 bg-[#3B82F6] rounded-full opacity-80" />
                  <div className="absolute bottom-2 left-2 h-4 w-5 bg-[#D925C7] rounded-full opacity-80" />
                  
                  {/* Small accent circles */}
                  <div className="absolute top-0 left-0 h-2 w-2 bg-[#29E7CD] rounded-full opacity-80" />
                  <div className="absolute bottom-0 right-0 h-2 w-2 bg-[#3B82F6] rounded-full opacity-80" />
                  <div className="absolute bottom-1 left-1 h-1.5 w-1.5 bg-[#D925C7] rounded-full opacity-80" />
                </div>
              </div>
            </div>
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

        {/* Auth Content */}
        <section className="flex flex-col items-center justify-center py-24">
          <div className="w-full max-w-md">
            {/* Tab Navigation */}
            <div className="flex rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-1 mb-8">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form Content */}
            <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-2xl">
              {activeTab === 'login' ? (
                <div>
                  <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
                  <p className="text-gray-400 text-center mb-8">
                    Sign in to access your PrepFlow dashboard
                  </p>
                  <LoginForm />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-center mb-6">Join PrepFlow</h2>
                  <p className="text-gray-400 text-center mb-8">
                    Create your account to start optimizing your restaurant's profitability
                  </p>
                  <SignupForm />
                </div>
              )}
            </div>

            {/* Additional Links */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-gray-400 hover:text-[#29E7CD] transition-colors"
              >
                ← Back to homepage
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
