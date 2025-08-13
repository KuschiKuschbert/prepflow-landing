export const metadata = {
  title: "PrepFlow – COGS & Menu Profit Tool",
  description: "See true dish costs, GP%, popularity and pricing opportunities in minutes. Built for Australian hospitality (GST-ready).",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-emerald-600" />
            <span className="text-lg font-semibold tracking-tight">PrepFlow</span>
          </div>
          <nav className="hidden gap-8 text-sm md:flex">
            <a href="#features" className="hover:text-emerald-700">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-700">How it works</a>
            <a href="#pricing" className="hover:text-emerald-700">Pricing</a>
            <a href="#faq" className="hover:text-emerald-700">FAQ</a>
          </nav>
          <div className="hidden md:block">
            <a
              href="https://your-store.lemonsqueezy.com/checkout/buy/YOUR_PRODUCT_HASH"
              className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Get Instant Access
            </a>
          </div>
        </header>

        {/* Hero */}
        <section className="grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Increase Your Restaurant’s Profit Margins in 24 Hours — {" "}
              <span className="text-emerald-700">No New Customers Needed</span>
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-700 md:text-lg">
              PrepFlow turns your menu into a profit map. Get true COGS, GP%, popularity and profit per item so you know exactly what to push, fix or remove.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              <Bullet>Australian GST-ready (set GST% in <em>Settings</em>)</Bullet>
              <Bullet>Real yields & trim/waste for accurate unit cost</Bullet>
              <Bullet>Automatic categories: Chef’s Kiss, Hidden Gem, Bargain Bucket</Bullet>
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://your-store.lemonsqueezy.com/checkout/buy/YOUR_PRODUCT_HASH"
                className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Get PrepFlow Now
              </a>
              <a href="#demo" className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold hover:border-slate-400">Watch 2‑min Demo</a>
              <p className="w-full text-xs text-slate-500">Instant download · Keep forever · No subscription</p>
            </div>
          </div>

          {/* Visual mock */}
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-emerald-50 blur-xl" />
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
              {/* Replace with real screenshots */}
              <div className="aspect-[16/10] w-full rounded-xl border border-slate-200 bg-gradient-to-tr from-slate-50 to-emerald-50" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="h-20 rounded-lg border border-slate-200 bg-white" />
                <div className="h-20 rounded-lg border border-slate-200 bg-white" />
                <div className="h-20 rounded-lg border border-slate-200 bg-white" />
              </div>
              <p className="mt-3 text-center text-xs text-slate-500">Swap with: Dashboard · Item Performance · COGS Recipes</p>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600 shadow-sm">
          Built for Australian hospitality. Works for restaurants, cafés, food trucks, caterers, and small groups.
        </div>

        {/* Features – tailored to the spreadsheet */}
        <section id="features" className="py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard title="Stock List (infinite)" body="Centralise ingredients with pack size, unit, supplier, storage, product code. Capture trim/waste and yields to get true cost per unit." />
            <FeatureCard title="COGS Recipes" body="Build recipes that auto‑pull ingredient costs (incl. yield/trim). See dish cost, COGS%, GP$ and GP% instantly." />
            <FeatureCard title="Item Performance" body="Paste sales. We calculate popularity, profit margin, total profit ex‑GST and classify items as Chef’s Kiss, Hidden Gem or Bargain Bucket." />
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <FeatureCard title="Dashboard KPIs" body="At a glance: average GP%, food cost %, average item profit and sale price, plus top performers by popularity and margin." />
            <FeatureCard title="GST & Currency" body="Set country and GST% in Settings. All outputs reflect Australian GST and AUD pricing conventions." />
            <FeatureCard title="Fast Onboarding" body="Start tab with step‑by‑step guidance. Pre‑loaded demo data to learn the flow in minutes." />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">How It Works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-5">
            <Step n={1} title="Open Start" body="Add your venue name, country and GST%." />
            <Step n={2} title="Fill Stock List" body="Ingredients, pack size, supplier, yields, trim/waste." />
            <Step n={3} title="Build Recipes" body="Select ingredients; tool auto‑calculates cost per UOM." />
            <Step n={4} title="Paste Sales" body="Drop in weekly/monthly item counts in Item Performance." />
            <Step n={5} title="Decide" body="Use Dashboard & Classes (Chef’s Kiss / Hidden Gem / Bargain Bucket) to price, push or remove items." />
          </div>
        </section>

        {/* Demo */}
        <section id="demo" className="py-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold tracking-tight md:text-3xl">2‑Minute Demo</h3>
              <p className="mt-3 text-slate-700">Watch us price a Double Cheese Burger and see how a $1 change shifts COGS% and GP$ immediately.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <Bullet>Find margin leaks in seconds</Bullet>
                <Bullet>Know your profit ex‑GST per item</Bullet>
                <Bullet>Make data‑driven price changes</Bullet>
              </ul>
              <div className="mt-6">
                <a
                  href="https://your-store.lemonsqueezy.com/checkout/buy/YOUR_PRODUCT_HASH"
                  className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Get the Tool
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/80" />
              <p className="mt-2 text-center text-xs text-slate-500">Embed your Loom/YouTube demo here</p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16">
          <div className="rounded-3xl border border-slate-200 p-8 shadow-sm md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-2xl font-bold tracking-tight md:text-3xl">Get Instant Access</h3>
                <p className="mt-3 text-slate-700">Download the PrepFlow COGS workbook, Quick Start, and demo dataset. Keep it forever. Use across locations.</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  <Bullet>Excel workbook (offline) — no monthly fee</Bullet>
                  <Bullet>Automated COGS, GP%, GP$ per item</Bullet>
                  <Bullet>Popularity & profit classes (Chef’s Kiss etc.)</Bullet>
                  <Bullet>7‑day money‑back guarantee</Bullet>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
                <p className="text-sm text-slate-500 line-through">AUD $147</p>
                <p className="mt-1 text-4xl font-extrabold tracking-tight">AUD $79</p>
                <p className="text-xs text-slate-500">Launch price · Limited to first 20 customers</p>
                <a
                  href="https://your-store.lemonsqueezy.com/checkout/buy/YOUR_PRODUCT_HASH"
                  className="mt-6 inline-flex w-full justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Buy Now
                </a>
                <p className="mt-3 text-xs text-slate-500">Secure checkout via Lemon Squeezy</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials (optional placeholders) */}
        <section className="py-16">
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">What early users say</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Testimonial quote="We raised prices on two dishes and added 6% GP in a week." author="Owner, Local Bistro" />
            <Testimonial quote="Finally know which items to push and which to retire." author="Head Chef, Beachside Café" />
            <Testimonial quote="Set up in under an hour — crystal clear numbers." author="Manager, Food Truck" />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16">
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">FAQ</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <FAQ q="Do I need advanced Excel skills?" a="No. Enter your ingredients, supplier costs and sales — the formulas and dashboards do the rest." />
            <FAQ q="Will this work for multiple locations?" a="Yes. Track each site separately or combine reports." />
            <FAQ q="Is my data private?" a="Your file stays on your computer — nothing is uploaded to the cloud." />
            <FAQ q="Does it handle Australian GST?" a="Yes. Set GST% in Settings and the tool will reflect ex‑GST and inc‑GST where relevant." />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-8 text-sm text-slate-500">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p>© {new Date().getFullYear()} PrepFlow. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-700">Terms</a>
              <a href="#" className="hover:text-slate-700">Privacy</a>
              <a href="#" className="hover:text-slate-700">Support</a>
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
    <li className="flex items-start gap-2">
      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
      {children}
    </li>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-slate-700">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">{n}</div>
        <h5 className="text-base font-semibold">{title}</h5>
      </div>
      <p className="mt-3 text-sm text-slate-700">{body}</p>
    </div>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm italic text-slate-800">“{quote}”</p>
      <p className="mt-3 text-xs font-medium text-slate-500">— {author}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{q}</p>
      <p className="mt-2 text-sm text-slate-700">{a}</p>
    </div>
  );
}
