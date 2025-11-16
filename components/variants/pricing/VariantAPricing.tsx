'use client';

interface PricingProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
}

export function VariantAPricing({ t, handleEngagement }: PricingProps) {
  return (
    <section id="pricing" className="py-20">
      <div className="desktop:p-16 rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 p-10 shadow-2xl backdrop-blur-sm">
        <div className="mb-12 text-center">
          <h3 className="text-fluid-3xl desktop:text-fluid-4xl mb-4 font-bold tracking-tight">
            Simple Pricing, Maximum Value
          </h3>
          <p className="text-fluid-lg text-gray-300">
            One tool. One price. Everything you need to optimize your menu profitability.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[#D925C7]/30 bg-gradient-to-br from-[#D925C7]/10 to-[#29E7CD]/10 p-8 text-center shadow-lg">
            <div className="mb-6">
              <p className="text-fluid-4xl bg-gradient-to-r from-[#D925C7] to-[#29E7CD] bg-clip-text font-extrabold tracking-tight text-transparent">
                AUD $29
              </p>
              <p className="text-fluid-lg mt-2 text-gray-300">One-time purchase</p>
              <p className="text-fluid-sm text-gray-500">Lifetime access · No recurring fees</p>
            </div>

            <div className="mb-8 grid gap-4 text-left">
              <div className="flex items-center gap-3">
                <span className="text-fluid-xl text-[#D925C7]">✓</span>
                <span className="text-gray-300">Complete Google Sheets template</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-fluid-xl text-[#D925C7]">✓</span>
                <span className="text-gray-300">Automated COGS calculations</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-fluid-xl text-[#D925C7]">✓</span>
                <span className="text-gray-300">Profit analysis & menu optimization</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-fluid-xl text-[#D925C7]">✓</span>
                <span className="text-gray-300">GST-ready for Australian businesses</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-fluid-xl text-[#D925C7]">✓</span>
                <span className="text-gray-300">AI-powered cooking insights</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-fluid-xl text-[#D925C7]">✓</span>
                <span className="text-gray-300">Setup guide & support resources</span>
              </div>
            </div>

            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fluid-base inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#D925C7] to-[#29E7CD] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#D925C7]/25"
            >
              Get PrepFlow Now
            </a>

            <div className="mt-6 text-center">
              <p className="text-fluid-sm text-gray-500">
                7-day refund policy · Secure checkout via Gumroad
              </p>
              <p className="text-fluid-xs mt-2 text-gray-400">🌍 Available in USD, EUR, GBP, AUD</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
