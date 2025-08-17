'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { getCurrentPrice, formatAud, getUpcomingChanges, daysUntil } from '../lib/pricing';
import Control from '../components/landing/variants/Control';
import V1 from '../components/landing/variants/V1';
import V2 from '../components/landing/variants/V2';
import V3 from '../components/landing/variants/V3';

function LandingPageContent() {
  // Get A/B testing variant from Edge Middleware
  const searchParams = useSearchParams();
  const variant = searchParams.get('variant') || 'control';
  
  // Performance monitoring - track page load time
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadTime = performance.now();
      console.log(`PrepFlow landing page loaded in ${loadTime.toFixed(2)}ms`);
      
      // Track A/B testing variant for analytics
      console.log('A/B Testing Variant:', variant);
    }
  }, [variant]);

  // Outcome section on-scroll animation
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const grid = document.getElementById('outcome-grid');
    if (!grid) return;
    const items = Array.from(grid.querySelectorAll('.outcome-observe')) as HTMLElement[];
    const headline = document.getElementById('outcome-headline');
    const headRect = headline ? headline.getBoundingClientRect() : null;
    const headCenterX = headRect ? headRect.left + headRect.width / 2 : window.innerWidth / 2;
    const headTop = headRect ? headRect.top : 0;
    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const dx = headCenterX - (rect.left + rect.width / 2);
      const dy = headTop - (rect.top + rect.height / 2) - 24;
      el.style.setProperty('--fromX', `${Math.round(dx)}px`);
      el.style.setProperty('--fromY', `${Math.round(dy)}px`);
    });
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !(window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver) {
      items.forEach((el) => el.classList.add('outcome-animate'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('outcome-animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -10% 0px' });
    const isLg = window.matchMedia && window.matchMedia('(min-width: 1024px)').matches;
    // On large screens: show 2nd & 3rd (inner) first, then 1st & 4th (outer)
    const baseDelays = isLg ? [140, 0, 0, 140] : [0, 120, 240, 360];
    items.forEach((el, idx) => {
      const delayMs = baseDelays[idx] ?? idx * 120;
      el.style.animationDelay = `${delayMs}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PrepFlow",
    "description": "COGS and menu clarity in a Google Sheet for small food businesses.",
    "url": "https://www.prepflow.org",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "AUD",
      "price": getCurrentPrice().price,
      "availability": "https://schema.org/InStock",
      "url": "https://www.prepflow.org/go/gumroad"
    }
  };

  // Render the appropriate variant
  const renderVariant = () => {
    switch (variant) {
      case 'v1':
        return <V1 />;
      case 'v2':
        return <V2 />;
      case 'v3':
        return <V3 />;
      case 'control':
      default:
        return <Control />;
    }
  };

  return (
    <>
      {/* Consent banner for EEA users */}
      <script dangerouslySetInnerHTML={{__html:`(function(){
        try{
          var isEea = document.cookie.split('; ').some(function(c){return c.indexOf('pf_eea=1')===0});
          if(!isEea) return;
          if(document.getElementById('pf-consent')) return;
          var bar=document.createElement('div');
          bar.id='pf-consent';
          bar.setAttribute('role','dialog');
          bar.setAttribute('aria-live','polite');
          bar.style.cssText='position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#111;color:#fff;border-top:1px solid #333;padding:12px 16px;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap';
          var text=document.createElement('span');
          text.textContent='We use cookies for analytics. You can accept or decline.';
          text.style.cssText='font-size:14px;color:#e5e7eb';
          var accept=document.createElement('button');
          accept.textContent='Accept';
          accept.style.cssText='background:#29E7CD;color:#000;padding:8px 12px;border-radius:10px;font-weight:600';
          var decline=document.createElement('button');
          decline.textContent='Decline';
          decline.style.cssText='background:#333;color:#e5e7eb;padding:8px 12px;border-radius:10px;font-weight:600;border:1px solid #555';
          var updateConsent=function(status){
            if(!window.gtag) return;
            if(status==='granted'){
              gtag('consent','update',{
                'ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted','analytics_storage':'granted'
              });
            } else {
              gtag('consent','update',{
                'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied'
              });
            }
          };
          accept.onclick=function(){
            document.cookie='pf_consent=granted; Max-Age='+(60*60*24*365)+'; Path=/; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');
            updateConsent('granted');
            // Load GA script on-demand if not loaded yet
            try{
              if(!window.gtag && ${process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? 'true' : 'false'}){
                var s=document.createElement('script'); s.async=true; s.src='https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}'; document.head.appendChild(s);
                var inline=document.createElement('script'); inline.innerHTML="window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}',{anonymize_ip:true});"; document.head.appendChild(inline);
              }
            }catch(e){}
            bar.remove();
          };
          decline.onclick=function(){
            document.cookie='pf_consent=denied; Max-Age='+(60*60*24*365)+'; Path=/; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');
            updateConsent('denied');
            bar.remove();
          };
          var prior=(document.cookie.match(/(?:^|; )pf_consent=([^;]+)/)||[])[1];
          if(!prior){
            bar.appendChild(text);bar.appendChild(accept);bar.appendChild(decline);document.body.appendChild(bar);
          } else {
            updateConsent(prior);
          }
        }catch(e){}
      })();`}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    <main 
      className="min-h-screen bg-[#0a0a0a] text-white" 
      style={{ 
        scrollBehavior: 'smooth',
        '--primary-color': '#29E7CD',
        '--secondary-color': '#3B82F6', 
        '--accent-color': '#D925C7',
        '--bg-color': '#0a0a0a',
        '--text-color': '#ffffff',
        '--gray-300': '#d1d5db',
        '--gray-400': '#9ca3af',
        '--gray-500': '#6b7280',
        '--gray-600': '#4b5563',
        '--gray-700': '#374151',
        '--gray-800': '#1f2937'
      } as React.CSSProperties}
    >
      {/* Sticky mobile CTA bar */}
      <StickyMobileCta />
      {/* Background gradient effects - optimized with CSS custom properties */}
      <style jsx global>{`
        .fade-in-up{opacity:0;transform:translateY(8px);animation:fadeUp .5s ease-out forwards}
        .delay-1{animation-delay:.1s}.delay-2{animation-delay:.2s}.delay-3{animation-delay:.3s}
        @keyframes fadeUp{to{opacity:1;transform:translateY(0)}}
        @media (prefers-reduced-motion: reduce){.fade-in-up{animation:none;opacity:1;transform:none}}
      `}</style>
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#29E7CD]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#D925C7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl" />
      </div>
      <style jsx global>{`
        .outcome-from{opacity:0;transform:translate(var(--fromX,0px), var(--fromY,10px))}
        .outcome-observe{opacity:0}
        .outcome-animate{animation:outFade .6s ease-out forwards}
        @keyframes outFade{to{opacity:1;transform:translate(0,0)}}
        @media (prefers-reduced-motion: reduce){.outcome-from,.outcome-observe{opacity:1;transform:none}.outcome-animate{animation:none}}
        .faq-observe-left{opacity:0;transform:translateY(-6px) translateX(40px)}
        .faq-observe-right{opacity:0;transform:translateY(-6px) translateX(-40px)}
        .faq-animate-left{animation:faqLeft .6s ease-out forwards}
        .faq-animate-right{animation:faqRight .6s ease-out forwards}
        @keyframes faqLeft{to{opacity:1;transform:translateY(0) translateX(0)}}
        @keyframes faqRight{to{opacity:1;transform:translateY(0) translateX(0)}}
        @media (prefers-reduced-motion: reduce){.faq-observe-left,.faq-observe-right{opacity:1;transform:none}.faq-animate-left,.faq-animate-right{animation:none}}
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between py-6 md:py-8 fade-in-up" role="banner">
          <div className="flex items-center gap-3">
            <Image src="/images/prepflow-logo.png" alt="PrepFlow Logo" className="h-12 w-auto" priority width={48} height={48} sizes="48px" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
              PrepFlow
            </span>
          </div>
          <nav className="hidden gap-6 text-sm md:flex" role="navigation" aria-label="Main navigation">
            <a href="#features" className="text-gray-300 hover:text-[#29E7CD] transition-colors" aria-label="View PrepFlow features">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-[#29E7CD] transition-colors" aria-label="Learn how PrepFlow works">How it works</a>
            <a href="#pricing" className="text-gray-300 hover:text-[#29E7CD] transition-colors" aria-label="View PrepFlow pricing">Pricing</a>
            <a href="#faq" className="text-gray-300 hover:text-[#29E7CD] transition-colors" aria-label="Frequently asked questions">FAQ</a>
          </nav>
          <div className="hidden md:block">
            <a
              href="/go/gumroad"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
              data-event="outbound_click_gumroad"
            >
              Get PrepFlow Now
            </a>
          </div>
        </header>

        {/* Render the appropriate variant */}
        <div className="fade-in-up delay-1">{renderVariant()}</div>

        {/* Compact trust chips removed per design feedback */}

        {/* Problem – 4 small boxes across */}
        <section className="py-14 md:py-16">
          <h3 className="text-center text-3xl font-bold tracking-tight md:text-4xl mb-8">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">The Problem</span>
          </h3>
          <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-5">
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-xl">✗</span>
                <p className="text-sm md:text-base text-gray-300">Hard to tell which dishes actually make money</p>
              </div>
            </div>
            <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-5">
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-xl">✗</span>
                <p className="text-sm md:text-base text-gray-300">COGS creep and waste chip away at profit</p>
              </div>
            </div>
            <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-5">
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-xl">✗</span>
                <p className="text-sm md:text-base text-gray-300">Pricing feels like guesswork — GST makes it fiddly</p>
              </div>
            </div>
            <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-5">
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-xl">✗</span>
                <p className="text-sm md:text-base text-gray-300">Reports are slow or stuck in someone else&apos;s system</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="py-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#29E7CD]/20 bg-[#101010]/80 p-6 text-center">
            <p className="text-lg md:text-xl text-gray-300">
              A Google Sheet that gives clear item‑level margins and GST‑ready pricing for small Aussie venues.
            </p>
          </div>
        </section>

        {/* Contributing Margin Highlight */}
        <section className="py-8 md:py-10" id="contributing-margin">
          <div className="rounded-2xl border border-[#29E7CD]/25 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-6 md:p-8 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold tracking-tight md:text-3xl mb-3">
                <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                  Contributing Margin
                </span> — The Real Profit Story
              </h3>
              <p className="text-base text-gray-300">See beyond gross profit to understand what each dish truly contributes to your business</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-2xl p-4 mb-3">
                  <span className="text-3xl">💰</span>
                  <h4 className="text-lg font-semibold text-white mt-2">Gross Profit</h4>
                  <p className="text-sm text-gray-300">What you think you&apos;re making</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-[#D925C7]/20 border border-[#D925C7]/30 rounded-2xl p-4 mb-3">
                  <span className="text-3xl">⚡</span>
                  <h4 className="text-lg font-semibold text-white mt-2">Contributing Margin</h4>
                  <p className="text-sm text-gray-300">What you&apos;re actually contributing</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-[#3B82F6]/20 border border-[#3B82F6]/30 rounded-2xl p-4 mb-3">
                  <span className="text-3xl">🎯</span>
                  <h4 className="text-lg font-semibold text-white mt-2">Action Plan</h4>
                  <p className="text-sm text-gray-300">What to do about it</p>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* All in one Google Sheet */}
      <section className="py-8 md:py-10">
        <div className="rounded-2xl border border-gray-700 bg-[#101010]/80 p-6">
          <h4 className="text-lg font-semibold text-center mb-4">All in one Google Sheet</h4>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-[#D925C7] to-[#29E7CD] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏛️</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Tax Systems</h4>
              <p className="text-sm text-gray-400">GST, VAT, Sales Tax, HST. Configure to your locale.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#D925C7] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Access via Google Sheets</h4>
              <p className="text-sm text-gray-400">Web and mobile where Sheets is available.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-[#29E7CD] to-[#D925C7] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Self‑Serve Setup</h4>
              <p className="text-sm text-gray-400">Set it up yourself. No consultants.</p>
            </div>
          </div>
          <p className="mt-6 text-center text-sm md:text-base text-gray-300">
            <strong>Example:</strong> A $15 burger might show 60% GP, but after prep time, waste and complexity, it could only contribute $2.50. A simple $8 side might contribute $4.00.
          </p>
        </div>
      </section>

        {/* Inside the sheet – features + screenshots */}
        <section id="features" className="py-12 md:py-14">
          <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 fade-in-up delay-2">
            <FeatureCard title="Recipe Costing" body="Build dishes from your ingredients and see dish cost, COGS%, GP$ and GP% directly in the sheet." />
            <FeatureCard title="Yield & Waste Aware" body="Include trim and prep yields so unit costs and margins reflect real kitchen conditions." />
            <FeatureCard title="Item Performance" body="Paste sales to see popularity, margin and total profit ex‑GST. Simple tags highlight winners and weak links." />
            <FeatureCard title="Daily Specials" body="Set today’s price on the fly and see GP$ and GP% instantly — GST‑aware." />
            <FeatureCard title="GST for Australia" body="Turn on GST; outputs reflect the AU 10% GST and show values in AUD." />
            <FeatureCard title="Built by Chefs for Chefs" body="Designed and refined with almost two decades of hands‑on kitchen and food ops experience." />
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <Image 
                src="/images/settings-screenshot.png" 
                alt="PrepFlow Settings page with business configuration"
                className="h-40 md:h-48 w-full object-cover rounded-lg border border-gray-600"
                loading="lazy"
                width={400}
                height={240}
              />
              <p className="text-xs text-gray-400 mt-2">Settings</p>
            </div>
            <div className="text-center">
              <Image 
                src="/images/recipe-screenshot.png" 
                alt="PrepFlow Recipe costing for Double Cheese Burger"
                className="h-40 md:h-48 w-full object-cover rounded-lg border border-gray-600"
                loading="lazy"
                width={400}
                height={240}
              />
              <p className="text-xs text-gray-400 mt-2">Recipe Costing</p>
            </div>
            <div className="text-center">
              <Image 
                src="/images/stocklist-screenshot.png" 
                alt="PrepFlow Infinite Stock List with ingredient management"
                className="h-40 md:h-48 w-full object-cover rounded-lg border border-gray-600"
                loading="lazy"
                width={400}
                height={240}
              />
              <p className="text-xs text-gray-400 mt-2">Stock List</p>
            </div>
          </div>
        </section>

        {/* Outcome – 4 small boxes across */}
        <section className="py-12 md:py-14">
          <h3 className="text-center text-3xl font-bold tracking-tight md:text-4xl mb-8" id="outcome-headline">
            <span className="bg-gradient-to-r from-green-400 to-[#29E7CD] bg-clip-text text-transparent">The Outcome</span>
          </h3>
          {/* Outcome animation styles declared globally at top-level; using class names only here */}
          <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="outcome-grid">
            <div className="rounded-xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-5 outcome-from outcome-observe" style={{['--fromX' as unknown as string]:'0px',['--fromY' as unknown as string]:'-24px'}}>
              <div className="flex items-start gap-3">
                <span className="text-[#29E7CD] text-xl">✓</span>
                <p className="text-sm md:text-base text-gray-300">Clear item‑level margins and profit</p>
              </div>
            </div>
            <div className="rounded-xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-5 outcome-from outcome-observe" style={{['--fromX' as unknown as string]:'-32px',['--fromY' as unknown as string]:'-24px'}}>
              <div className="flex items-start gap-3">
                <span className="text-[#29E7CD] text-xl">✓</span>
                <p className="text-sm md:text-base text-gray-300">See winners and profit leaks in seconds</p>
              </div>
            </div>
            <div className="rounded-xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-5 outcome-from outcome-observe" style={{['--fromX' as unknown as string]:'32px',['--fromY' as unknown as string]:'-24px'}}>
              <div className="flex items-start gap-3">
                <span className="text-[#29E7CD] text-xl">✓</span>
                <p className="text-sm md:text-base text-gray-300">Price with confidence (GST‑ready)</p>
              </div>
            </div>
            <div className="rounded-xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-5 outcome-from outcome-observe" style={{['--fromX' as unknown as string]:'0px',['--fromY' as unknown as string]:'-24px'}}>
              <div className="flex items-start gap-3">
                <span className="text-[#29E7CD] text-xl">✓</span>
                <p className="text-sm md:text-base text-gray-300">All in Google Sheets — no new software</p>
              </div>
            </div>
          </div>
          {/* outcome animation is handled via React effect above */}
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-14 md:py-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            How it works in 3 steps
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step n={1} title="Set up" body="Turn on GST, add ingredients, yields, and supplier costs." />
            <Step n={2} title="Import sales" body="Paste your POS export into the Sales tab." />
            <Step n={3} title="Decide & act" body="Dashboard ranks items by profit and popularity; fix pricing, portioning, or menu mix." />
          </div>
        </section>

        {/* Demo and lead magnet removed: sheet purchase only */}

        {/* Pricing */}
        <section id="pricing" className="py-14 md:py-16">
          <div className="mx-auto max-w-6xl grid items-start gap-12 lg:grid-cols-2">
              <div className="w-full max-w-2xl">
                <h3 className="text-3xl font-bold tracking-tight md:text-4xl">Get Your Menu Clarity Tool</h3>
                <p className="mt-4 text-lg text-gray-300">Simple, powerful, and designed to give you the insights you need to make better decisions.</p>
                
                {/* Refund Policy */}
                <div className="mt-6 p-4 rounded-xl bg-[#29E7CD]/5 border border-[#29E7CD]/20">
                  <div className="text-center">
                    <h4 className="text-sm font-semibold text-[#29E7CD] mb-2">7‑Day Refund</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">Try PrepFlow with confidence. If it isn’t right for you, reply to your receipt within 7 days for a full refund. Instant access; after 7 days, sales are final.</p>
                  </div>
                </div>
              </div>
              
              {/* Price Card */}
              <div className="self-center rounded-2xl border border-gray-600/50 bg-[#242424]/50 p-5 md:p-7 text-center shadow-md w-full sm:max-w-sm md:max-w-md mx-auto">
                <p className="mt-2 text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">{formatAud(getCurrentPrice().price)}</p>
                <p className="text-sm text-gray-400">one-time purchase · 7-day refund</p>
                <div className="mt-4 mx-auto max-w-xs text-left">
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1.5">
                    <li>Google Sheet template</li>
                    <li>Setup guide and sample data</li>
                    <li>Works with Google Sheets</li>
                  </ul>
                </div>
                <a
                  href="/go/gumroad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
                  data-event="outbound_click_gumroad"
                >
                  Get the Google Sheet
                </a>
                {(() => { const n = getUpcomingChanges()[0]; return n ? (
                  <p className="mt-3 text-xs text-gray-500">Next change: {formatAud(n.price)} on {n.date.toLocaleDateString()} (in {daysUntil(n.date)} days)</p>
                ) : null; })()}
                <p className="mt-4 text-sm text-gray-500">Secure checkout via Gumroad</p>
              </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-14 md:py-16">
          <h3 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            FAQ
          </h3>
          <div className="mt-12 grid gap-8 md:grid-cols-2" id="global-faq-grid">
            <div className="faq-observe-left" data-faq-arc>
              <FAQ q="Do I need tech skills?" a="Zero spreadsheet formulas required. If you can use Google Sheets, you&apos;re good." />
            </div>
            <FAQ q="Does it work in Australia?" a="Yes. It’s GST-aware and priced in AUD." />
            <FAQ q="What if it doesn&apos;t work for me?" a="If it&apos;s not what you expected, request a refund within 7 days." />
            <FAQ q="Will this slow me down?" a="Setup is straightforward. Add your data at your own pace." />
          </div>
          <script dangerouslySetInnerHTML={{__html:`(function(){
            var grid=document.getElementById('global-faq-grid'); if(!grid) return; var el=grid.querySelector('[data-faq-arc]'); if(!el) return;
            var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(reduce){el.classList.add('faq-animate-left');return;}
            var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
              el.classList.add('faq-animate-left'); obs.unobserve(el);
            }});},{threshold:.5}); obs.observe(el);
          })();`}}/>
        </section>

        {/* Final CTA */}
        <section className="py-12">
          <div className="text-center">
            <a
              href="/go/gumroad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
              data-event="outbound_click_gumroad"
            >
              Get the Google Sheet
            </a>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm text-gray-300">
              <div className="flex items-center gap-2 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1">
                <span className="text-[#29E7CD]">🧮</span>
                <span>GST-ready • AUD</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1">
                <span className="text-[#29E7CD]">🛡️</span>
                <span>7‑day refund</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1">
                <span className="text-[#29E7CD]">📄</span>
                <span>Works in Google Sheets</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-700 py-12 text-sm text-gray-500">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p>© {new Date().getFullYear()} PrepFlow. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <a href="/terms" className="hover:text-[#29E7CD] transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-[#29E7CD] transition-colors">Privacy</a>
              <a href="/support" className="hover:text-[#29E7CD] transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
    </>
  );
}

// Main Page component with Suspense wrapper
export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#29E7CD] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading PrepFlow...</p>
        </div>
      </div>
    }>
      <LandingPageContent />
    </Suspense>
  );
}

/* ---------- Small helper components ---------- */
function StickyMobileCta() {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [hasMinTime, setHasMinTime] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      const y = window.scrollY || 0;
      const viewport = typeof window !== 'undefined' ? window.innerHeight : 800;
      const threshold = Math.max(400, Math.floor(viewport * 1.25));
      const isDesktop = typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false;
      setVisible(!isDesktop && hasMinTime && y > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Initialize immediately on mount
    onScroll();
    const t = window.setTimeout(() => setHasMinTime(true), 6000);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(t);
    };
  }, [hasMinTime]);
  return (
    <div
      className={`fixed bottom-3 left-3 right-3 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-24'} motion-reduce:transition-none`}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-md md:max-w-lg rounded-2xl border border-gray-700 bg-[#1f1f1f]/90 backdrop-blur supports-[backdrop-filter]:bg-[#1f1f1f]/70 p-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-gray-300">
            <span className="block font-semibold">{formatAud(getCurrentPrice().price)}</span>
            <span className="text-xs text-gray-500">One-time • 7-day refund</span>
          </div>
          <a
            href="/go/gumroad"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-xs font-semibold text-white shadow-md hover:opacity-95"
            data-event="outbound_click_gumroad"
            aria-label="Get the Google Sheet"
          >
            Get Sheet
          </a>
        </div>
      </div>
    </div>
  );
}
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

function Testimonial({ quote, author, result }: { quote: string; author: string; result?: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <p className="text-base italic text-gray-200 leading-relaxed">&quot;{quote}&quot;</p>
      {result && (
        <div className="mt-3 inline-block bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-lg px-3 py-1">
          <span className="text-sm font-semibold text-[#29E7CD]">{result}</span>
        </div>
      )}
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
