

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
                    <p className="text-gray-300">Your Google Sheet template is ready → <a href="#" className="text-[#29E7CD] hover:underline">[[access link]]</a></p>
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
            <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-2xl">
              <div className="text-center mb-6">
                <p className="text-lg text-gray-300 italic mb-4">
                  "[[testimonial placeholder or pilot feedback]]"
                </p>
                <p className="text-sm text-gray-400">— [[Name]], [[Venue]], [[City]]</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[#29E7CD] text-2xl">🔒</span>
                  <p className="text-sm text-gray-300">Data stays in your Google Drive. Cancel anytime.</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[#29E7CD] text-2xl">✅</span>
                  <p className="text-sm text-gray-300">30-day money-back guarantee.</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[#29E7CD] text-2xl">🇦🇺</span>
                  <p className="text-sm text-gray-300">Built for Aussie hospitality operators.</p>
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
                    <p className="text-gray-300">Need help? Email us at <a href="mailto:support@prepflow.org" className="text-[#29E7CD] hover:underline">support@prepflow.org</a> — reply in under 24h.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#29E7CD] text-xl">📬</span>
                  <div>
                    <p className="text-gray-300">Coming next: You'll get 3 onboarding emails (Demo recap, Profit leaks, Pricing tweaks).</p>
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
