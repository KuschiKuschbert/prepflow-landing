export const metadata = {
  title: "PrepFlow – COGS & Menu Profit Tool",
  description: "See true dish costs, GP%, popularity and pricing opportunities in minutes. Built for Australian hospitality (GST-ready).",
};

export default function Page() {
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
            <img 
              src="/images/prepflow-logo.png" 
              alt="PrepFlow Logo"
              className="h-12 w-auto"
            />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
              PrepFlow
            </span>
          </div>
          <nav className="hidden gap-8 text-sm md:flex">
            <a href="#features" className="text-gray-300 hover:text-[#29E7CD] transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-[#29E7CD] transition-colors">How it works</a>
            <a href="#pricing" className="text-gray-300 hover:text-[#29E7CD] transition-colors">Pricing</a>
            <a href="#faq" className="text-gray-300 hover:text-[#29E7CD] transition-colors">FAQ</a>
          </nav>
          <div className="hidden md:block">
            <a
              href="https://www.prepflow.org/buy/0e6d865e-4ef3-437d-b92f-9a231e1e81e1"
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
            >
              Start Free Now
            </a>
          </div>
        </header>

        {/* Hero */}
        <section className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Your Menu Is Leaking Cash. PrepFlow Finds Every Cent — {" "}
              <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                in 24 Hours Flat.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
              See what's draining your profit. Fix it before the next lunch rush.
            </p>
            <ul className="mt-8 space-y-3 text-base text-gray-300">
              <Bullet>Know your real profit per dish — no more guesswork or gut feeling</Bullet>
              <Bullet>Classify menu items instantly: margin monsters vs dead weight</Bullet>
              <Bullet>See where your waste, yield, and prep time destroy profits</Bullet>
              <Bullet>Works with GST. Works fast. You'll feel the difference tomorrow</Bullet>
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-4">
                              <a
                  href="https://www.prepflow.org/buy/0e6d865e-4ef3-437d-b92f-9a231e1e81e1"
                  className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
                >
                  Start Your Profit Scan Now
                </a>
              <a href="#demo" className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 hover:border-[#29E7CD] hover:text-[#29E7CD] transition-all duration-300">
                Watch 2‑min Demo
              </a>
              <p className="w-full text-sm text-gray-500">No credit card · Results in 1 day · $29/month</p>
            </div>
          </div>

          {/* PrepFlow Dashboard Screenshot */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 blur-2xl" />
            <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 shadow-2xl">
              <div className="relative">
                <img 
                  src="/images/dashboard-screenshot.png" 
                  alt="PrepFlow Dashboard showing COGS metrics, profit analysis, and item performance charts"
                  className="w-full h-auto rounded-xl border border-gray-600"
                />
                {/* Action Overlay */}
                <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="bg-[#29E7CD] text-black px-4 py-2 rounded-lg font-semibold mb-2">
                      Live GP% Dashboard
                    </div>
                    <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      Play Demo
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <img 
                  src="/images/settings-screenshot.png" 
                  alt="PrepFlow Settings page with business configuration"
                  className="h-24 w-full object-cover rounded-lg border border-gray-600"
                />
                <img 
                  src="/images/recipe-screenshot.png" 
                  alt="PrepFlow Recipe costing for Double Cheese Burger"
                  className="h-24 w-full object-cover rounded-lg border border-gray-600"
                />
                <img 
                  src="/images/stocklist-screenshot.png" 
                  alt="PrepFlow Infinite Stock List with ingredient management"
                  className="h-24 w-full object-cover rounded-lg border border-gray-600"
                />
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">Dashboard · Settings · Recipe Costing · Stock Management</p>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 text-center text-base text-gray-300 shadow-lg">
          Built for Australian hospitality. Works for restaurants, cafés, food trucks, caterers, and small groups.
        </div>

        {/* Features – tailored to the spreadsheet */}
        <section id="features" className="py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard title="Stock List (infinite)" body="Centralise ingredients with pack size, unit, supplier, storage, product code. Capture trim/waste and yields to get true cost per unit." />
            <FeatureCard title="COGS Recipes" body="Build recipes that auto‑pull ingredient costs (incl. yield/trim). See dish cost, COGS%, GP$ and GP% instantly." />
            <FeatureCard title="Item Performance" body="Paste sales. We calculate popularity, profit margin, total profit ex‑GST and classify items as Chef's Kiss, Hidden Gem or Bargain Bucket." />
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <FeatureCard title="Dashboard KPIs" body="At a glance: average GP%, food cost %, average item profit and sale price, plus top performers by popularity and margin." />
            <FeatureCard title="GST & Currency" body="Set country and GST% in Settings. All outputs reflect Australian GST and AUD pricing conventions." />
            <FeatureCard title="Fast Onboarding" body="Start tab with step‑by‑step guidance. Pre‑loaded demo data and member portal resources to learn the flow in minutes." />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            How It Works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-5">
            <Step n={1} title="Load Recipes & Prices" body="Add your recipes & ingredient prices." />
            <Step n={2} title="Add Prep & Waste" body="Include prep time, yield, waste data." />
            <Step n={3} title="Upload Sales Data" body="Drop in your weekly/monthly sales." />
            <Step n={4} title="See Profit Reality" body="Watch the system expose profit traps per plate." />
            <Step n={5} title="Get Action Plan" body="Simple suggestions: raise this price, drop that item, swap that cut." />
          </div>
        </section>

        {/* Demo */}
        <section id="demo" className="py-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl">2‑Minute Demo</h3>
              <p className="mt-4 text-lg text-gray-300">Watch us price a Double Cheese Burger and see how a $1 change shifts COGS% and GP$ immediately.</p>
              <ul className="mt-6 space-y-3 text-base text-gray-300">
                <Bullet>Find margin leaks in seconds</Bullet>
                <Bullet>Know your profit ex‑GST per item</Bullet>
                <Bullet>Make data‑driven price changes</Bullet>
              </ul>
              <div className="mt-8">
                <a
                  href="https://www.prepflow.org/buy/0e6d865e-4ef3-437d-b92f-9a231e1e81e1"
                  className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
                >
                  Watch Demo
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6">
              <iframe
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                className="w-full aspect-video rounded-xl border border-gray-600"
                title="PrepFlow 2-Minute Demo - See how pricing changes affect COGS and profit margins"
                allowFullScreen
              />
              <p className="mt-4 text-center text-sm text-gray-500">Watch the full demo to see PrepFlow in action</p>
            </div>
          </div>
        </section>

        {/* Urgency Banner */}
        <div className="bg-gradient-to-r from-[#D925C7] to-[#29E7CD] p-4 text-center text-white font-semibold">
          🔥 60% launch discount ends this Friday. Don't miss the margin makeover.
        </div>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 shadow-2xl md:p-16">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h3 className="text-3xl font-bold tracking-tight md:text-4xl">Get Started Today</h3>
                <p className="mt-4 text-lg text-gray-300">Get access to the PrepFlow COGS Google Sheet template with member portal access for ongoing support and updates.</p>
                <ul className="mt-6 space-y-3 text-base text-gray-300">
                  <Bullet>Google Sheet template — ready to use immediately</Bullet>
                  <Bullet>Automated COGS, GP%, GP$ per item</Bullet>
                  <Bullet>Popularity & profit classes (Chef's Kiss etc.)</Bullet>
                  <Bullet>Member portal with exclusive resources</Bullet>
                </ul>
              </div>
              <div className="rounded-2xl border border-gray-600 bg-[#2a2a2a]/80 p-8 text-center shadow-lg">
                <p className="text-base text-gray-500 line-through">AUD $49</p>
                <p className="mt-2 text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                  AUD $29
                </p>
                <p className="text-sm text-gray-500">per month · Cancel anytime</p>
                <a
                  href="https://www.prepflow.org/buy/0e6d865e-4ef3-437d-b92f-9a231e1e81e1"
                  className="mt-8 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
                >
                  Start Now — Fix Your Margins Today
                </a>
                <p className="mt-4 text-sm text-gray-500">Secure checkout via Lemon Squeezy</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <h3 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            What early users say
          </h3>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Testimonial quote="We raised prices on two dishes and added 6% GP in a week." author="Owner, Local Bistro" />
            <Testimonial quote="Finally know which items to push and which to retire." author="Head Chef, Beachside Café" />
            <Testimonial quote="Set up in under an hour — crystal clear numbers." author="Manager, Food Truck" />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20">
          <h3 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            FAQ
          </h3>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <FAQ q="Do I need advanced Google Sheets skills?" a="No. Enter your ingredients, supplier costs and sales — the formulas and dashboards do the rest." />
            <FAQ q="Will this work for multiple locations?" a="Yes. Track each site separately or combine reports in your Google Sheet." />
            <FAQ q="Is my data private?" a="Your data stays in your Google account with enterprise-grade security and privacy controls." />
            <FAQ q="Does it handle Australian GST?" a="Yes. Set GST% in Settings and the tool will reflect ex‑GST and inc‑GST where relevant." />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-700 py-12 text-sm text-gray-500">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p>© {new Date().getFullYear()} PrepFlow. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-[#29E7CD] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#29E7CD] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#29E7CD] transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ---------- Small helper components ---------- */
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 h-3 w-3 rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7]" />
      {children}
    </li>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <h4 className="text-xl font-semibold text-white mb-3">{title}</h4>
      <p className="text-gray-300 leading-relaxed">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-sm font-bold text-white">
          {n}
        </div>
        <h5 className="text-lg font-semibold text-white">{title}</h5>
      </div>
      <p className="text-gray-300 leading-relaxed">{body}</p>
    </div>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <p className="text-base italic text-gray-200 leading-relaxed">"{quote}"</p>
      <p className="mt-4 text-sm font-medium text-[#29E7CD]">— {author}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <p className="text-base font-semibold text-white mb-3">{q}</p>
      <p className="text-gray-300 leading-relaxed">{a}</p>
    </div>
  );
}
