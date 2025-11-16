'use client';

interface PricingProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
}

export function ControlPricing({ t, handleEngagement }: PricingProps) {
  return (
    <section id="pricing" className="py-20">
      <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 p-10 shadow-2xl backdrop-blur-sm lg:p-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h3 className="text-fluid-3xl font-bold tracking-tight lg:text-fluid-4xl">
              Get Your Menu Clarity Tool
            </h3>
            <p className="mt-4 text-fluid-lg text-gray-300">
              Simple, powerful, and designed to give you the insights you need to make better
              decisions.
            </p>

            {/* Refund Policy */}
            <div className="mt-6 rounded-xl border border-[#29E7CD]/20 bg-[#29E7CD]/5 p-4">
              <div className="text-center">
                <h4 className="mb-2 text-fluid-sm font-semibold text-[#29E7CD]">Our Refund Policy</h4>
                <p className="text-fluid-sm leading-relaxed text-gray-300">
                  PrepFlow is a digital product with instant access. That said, we want you to feel
                  confident. If PrepFlow isn&apos;t what you expected, you can request a full refund
                  within 7 days of purchase. No hoops, no hassle — just reply to your purchase email
                  and let us know. After 7 days, all sales are final.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[#29E7CD]">✅</span>
                <span className="text-gray-300">
                  Google Sheet template — ready to use immediately
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#29E7CD]">✅</span>
                <span className="text-gray-300">Automated COGS, GP%, GP$ per item</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#29E7CD]">✅</span>
                <span className="text-gray-300">
                  Popularity & profit classes (Chef&apos;s Kiss etc.)
                </span>
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
            <p className="mt-2 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-fluid-4xl font-extrabold tracking-tight text-transparent">
              AUD $29
            </p>
            <p className="text-fluid-sm text-gray-500">one-time purchase · Lifetime access</p>
            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-fluid-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#29E7CD]/25"
            >
              Start Now — Get Menu Clarity Today
            </a>
            <p className="mt-4 text-fluid-sm text-gray-500">Secure checkout via Gumroad</p>
            <p className="mt-2 text-fluid-xs text-gray-400">Not satisfied in 7 days? Full refund.</p>
            <p className="mt-2 text-fluid-xs text-[#29E7CD]">
              🌍 Global pricing available in USD, EUR, GBP, AUD
            </p>

            {/* Trust Indicators */}
            <div className="mt-4 border-t border-gray-600 pt-4">
              <div className="flex items-center justify-center gap-4 text-fluid-xs text-gray-400">
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
