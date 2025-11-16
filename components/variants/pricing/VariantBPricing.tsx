'use client';

interface PricingProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
}

export function VariantBPricing({ t, handleEngagement }: PricingProps) {
  return (
    <section id="pricing" className="py-20">
      <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 p-10 shadow-2xl backdrop-blur-sm lg:p-16">
        <div className="mb-12 text-center">
          <h3 className="mb-4 text-fluid-3xl font-bold tracking-tight lg:text-fluid-4xl">
            Why Choose PrepFlow?
          </h3>
          <p className="text-fluid-lg text-gray-300">Compare the cost and value of different solutions</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Other Solutions */}
          <div className="rounded-2xl border border-gray-600 bg-[#2a2a2a]/80 p-6 text-center">
            <h4 className="mb-4 text-fluid-xl font-semibold text-gray-300">Other Restaurant Software</h4>
            <p className="mb-2 text-fluid-3xl font-bold text-gray-400">$500+</p>
            <p className="mb-4 text-fluid-sm text-gray-500">per month</p>
            <ul className="space-y-2 text-left text-fluid-sm text-gray-400">
              <li>• Complex setup</li>
              <li>• Monthly fees</li>
              <li>• Learning curve</li>
              <li>• Limited customization</li>
            </ul>
          </div>

          {/* Consultants */}
          <div className="rounded-2xl border border-gray-600 bg-[#2a2a2a]/80 p-6 text-center">
            <h4 className="mb-4 text-fluid-xl font-semibold text-gray-300">Consultants</h4>
            <p className="mb-2 text-fluid-3xl font-bold text-gray-400">$2,000+</p>
            <p className="mb-4 text-fluid-sm text-gray-500">per project</p>
            <ul className="space-y-2 text-left text-fluid-sm text-gray-400">
              <li>• Expensive</li>
              <li>• One-time analysis</li>
              <li>• No ongoing support</li>
              <li>• Limited availability</li>
            </ul>
          </div>

          {/* PrepFlow */}
          <div className="rounded-2xl border border-[#3B82F6]/30 bg-gradient-to-br from-[#3B82F6]/10 to-[#29E7CD]/10 p-6 text-center">
            <h4 className="mb-4 text-fluid-xl font-semibold text-white">PrepFlow</h4>
            <p className="mb-2 text-fluid-3xl font-bold text-[#3B82F6]">AUD $29</p>
            <p className="mb-4 text-fluid-sm text-gray-300">one-time</p>
            <ul className="space-y-2 text-left text-fluid-sm text-gray-300">
              <li>• Simple setup</li>
              <li>• No monthly fees</li>
              <li>• Easy to use</li>
              <li>• Lifetime access</li>
            </ul>
            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] px-6 py-3 text-fluid-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#3B82F6]/25"
            >
              Choose PrepFlow
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-fluid-sm text-gray-400">
            7-day refund policy · Secure checkout · 20 years of kitchen experience
          </p>
        </div>
      </div>
    </section>
  );
}
