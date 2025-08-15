export const metadata = {
  title: "Thank You – PrepFlow",
  description: "Thank you for choosing PrepFlow. Your COGS & Menu Profit Tool is ready to transform your restaurant's profitability.",
};

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

          {/* Main Message */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
            Thank You for Choosing{" "}
            <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
              PrepFlow
            </span>
          </h1>
          
          <p className="text-xl leading-8 text-gray-300 max-w-3xl mb-8">
            Your COGS & Menu Profit Tool is ready to transform your restaurant's profitability. 
            You'll receive your download link and setup instructions via email within the next few minutes.
          </p>

          {/* What's Next Section */}
          <div className="w-full max-w-4xl mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-100">What happens next?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6">
                <div className="h-12 w-12 rounded-xl bg-[#29E7CD]/20 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#29E7CD]">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Download & Install</h3>
                <p className="text-gray-400 text-sm">Get your PrepFlow tool and follow the simple setup guide</p>
              </div>
              
              <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6">
                <div className="h-12 w-12 rounded-xl bg-[#D925C7]/20 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#D925C7]">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Import Your Menu</h3>
                <p className="text-gray-400 text-sm">Upload your current menu or start building from scratch</p>
              </div>
              
              <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6">
                <div className="h-12 w-12 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#3B82F6]">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">See Profit Insights</h3>
                <p className="text-gray-400 text-sm">Discover hidden opportunities to boost your margins</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <a
              href="mailto:support@prepflow.com"
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
            >
              Need Help? Contact Support
            </a>
            <a 
              href="/"
              className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 hover:border-[#29E7CD] hover:text-[#29E7CD] transition-all duration-300"
            >
              Back to Homepage
            </a>
          </div>

          {/* Additional Info */}
          <div className="text-center text-gray-500 max-w-2xl">
            <p className="mb-2">
              Check your email (including spam folder) for your download link and welcome guide.
            </p>
            <p className="text-sm">
              Having trouble? Email us at{" "}
              <a href="mailto:support@prepflow.com" className="text-[#29E7CD] hover:underline">
                support@prepflow.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
