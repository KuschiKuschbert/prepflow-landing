'use client';

interface PricingProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
}

export function VariantCPricing({ t, handleEngagement }: PricingProps) {
  return (
    <section id="pricing" className="py-20">
      <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 p-10 shadow-2xl backdrop-blur-sm desktop:p-16">
        <div className="grid items-center gap-12 desktop:grid-cols-2">
          <div>
            <h3 className="text-fluid-3xl font-bold tracking-tight desktop:text-fluid-4xl">Everything You Need</h3>
            <p className="mt-4 text-fluid-lg text-gray-300">
              One comprehensive tool for complete menu profitability analysis.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#29E7CD]/20">
                  <span className="text-fluid-xl text-[#29E7CD]">📊</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Complete Dashboard</h4>
                  <p className="text-fluid-sm text-gray-400">
                    COGS, GP%, profit analysis, and performance metrics
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#29E7CD]/20">
                  <span className="text-fluid-xl text-[#29E7CD]">🧮</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Recipe Builder</h4>
                  <p className="text-fluid-sm text-gray-400">
                    Automated calculations with yield and waste tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#29E7CD]/20">
                  <span className="text-fluid-xl text-[#29E7CD]">🇦🇺</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">GST Ready</h4>
                  <p className="text-fluid-sm text-gray-400">
                    Australian tax compliance and multi-currency support
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#29E7CD]/20">
                  <span className="text-fluid-xl text-[#29E7CD]">🤖</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">AI Insights</h4>
                  <p className="text-fluid-sm text-gray-400">Smart suggestions for margin improvement</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-600 bg-[#2a2a2a]/80 p-8 text-center">
            <p className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-fluid-4xl font-extrabold tracking-tight text-transparent">
              AUD $29
            </p>
            <p className="mb-6 text-fluid-sm text-gray-500">One-time purchase · Lifetime access</p>

            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 text-fluid-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#29E7CD]/25"
            >
              Get Complete Access
            </a>

            <div className="mt-6 text-center">
              <p className="text-fluid-sm text-gray-500">7-day refund policy</p>
              <p className="mt-2 text-fluid-xs text-gray-400">Secure checkout via Gumroad</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
