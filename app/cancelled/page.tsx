export default function CancelledPage() {
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
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl border border-gray-700 bg-[#0a0a0a] p-0.5">
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-[#0a0a0a]">
                  {/* Main large cyan circle (upper left portion) */}
                  <div className="absolute top-1 left-1 h-6 w-6 rounded-full bg-[#29E7CD] opacity-90" />

                  {/* Overlapping organic shapes */}
                  <div className="absolute top-2 right-2 h-5 w-6 rounded-full bg-[#3B82F6] opacity-80" />
                  <div className="absolute bottom-2 left-2 h-4 w-5 rounded-full bg-[#D925C7] opacity-80" />

                  {/* Small accent circles */}
                  <div className="absolute top-0 left-0 h-2 w-2 rounded-full bg-[#29E7CD] opacity-80" />
                  <div className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-[#3B82F6] opacity-80" />
                  <div className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full bg-[#D925C7] opacity-80" />
                </div>
              </div>
            </div>
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

        {/* Cancelled Content */}
        <section className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-full max-w-2xl">
            {/* Icon */}
            <div className="mb-8">
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-br from-[#D925C7]/20 to-[#3B82F6]/20 blur-2xl" />
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[#D925C7] to-[#3B82F6]">
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message */}
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Order{' '}
              <span className="bg-gradient-to-r from-[#D925C7] to-[#3B82F6] bg-clip-text text-transparent">
                Cancelled
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-xl leading-8 text-gray-300">
              Your order was cancelled or the payment didn't go through. No worries - you haven't
              been charged.
            </p>

            {/* Help Section */}
            <div className="mb-8 rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 p-8 backdrop-blur-sm">
              <h2 className="mb-4 text-2xl font-bold">Need Help?</h2>
              <p className="mb-6 text-gray-400">
                If you believe this was an error or need assistance with your order, we're here to
                help.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <a
                  href="mailto:support@prepflow.org"
                  className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#29E7CD]/25"
                >
                  Contact Support
                </a>
                <a
                  href="/auth"
                  className="rounded-2xl border border-gray-600 px-6 py-3 text-base font-semibold text-gray-300 transition-all duration-300 hover:border-[#29E7CD] hover:text-[#29E7CD]"
                >
                  Try Again
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/"
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#29E7CD]/25"
              >
                Back to Homepage
              </a>
              <a
                href="/auth"
                className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 transition-all duration-300 hover:border-[#29E7CD] hover:text-[#29E7CD]"
              >
                Sign In
              </a>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center text-gray-500">
              <p className="text-sm">
                Questions? Email us at{' '}
                <a href="mailto:support@prepflow.org" className="text-[#29E7CD] hover:underline">
                  support@prepflow.org
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
