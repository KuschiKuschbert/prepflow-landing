'use client';

import ProtectedRoute from '../../components/auth/ProtectedRoute';
import UserProfile from '../../components/auth/UserProfile';

export default function PortalPage() {
  return (
    <ProtectedRoute>
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
            <UserProfile />
          </header>

          {/* Portal Content */}
          <section className="py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
                Welcome to Your{" "}
                <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                  PrepFlow Dashboard
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Access your COGS calculations, menu analysis, and profitability insights
              </p>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Google Sheet Integration */}
              <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-[#29E7CD]/20 flex items-center justify-center">
                    <svg className="h-6 w-6 text-[#29E7CD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold">Your PrepFlow Sheet</h2>
                </div>
                <p className="text-gray-400 mb-6">
                  Your personalized Google Sheet with all your menu items, COGS calculations, and profit insights.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
                >
                  Open Google Sheet
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Tutorials & Resources */}
              <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-[#D925C7]/20 flex items-center justify-center">
                    <svg className="h-6 w-6 text-[#D925C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold">Tutorials & Resources</h2>
                </div>
                <p className="text-gray-400 mb-6">
                  Learn how to maximize PrepFlow's potential with step-by-step guides and best practices.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#D925C7] to-[#3B82F6] px-6 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#D925C7]/25 transition-all duration-300"
                >
                  View Tutorials
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="rounded-2xl border border-gray-600 bg-[#1f1f1f] p-4 text-left hover:border-[#29E7CD] hover:bg-[#1f1f1f]/80 transition-all duration-300">
                  <div className="h-8 w-8 rounded-lg bg-[#29E7CD]/20 flex items-center justify-center mb-3">
                    <svg className="h-5 w-5 text-[#29E7CD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Add New Item</h3>
                  <p className="text-sm text-gray-400">Create a new menu item</p>
                </button>

                <button className="rounded-2xl border border-gray-600 bg-[#1f1f1f] p-4 text-left hover:border-[#D925C7] hover:bg-[#1f1f1f]/80 transition-all duration-300">
                  <div className="h-8 w-8 rounded-lg bg-[#D925C7]/20 flex items-center justify-center mb-3">
                    <svg className="h-5 w-5 text-[#D925C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">View Reports</h3>
                  <p className="text-sm text-gray-400">Analyze performance data</p>
                </button>

                <button className="rounded-2xl border border-gray-600 bg-[#1f1f1f] p-4 text-left hover:border-[#3B82F6] hover:bg-[#1f1f1f]/80 transition-all duration-300">
                  <div className="h-8 w-8 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center mb-3">
                    <svg className="h-5 w-6 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Settings</h3>
                  <p className="text-sm text-gray-400">Configure your account</p>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
