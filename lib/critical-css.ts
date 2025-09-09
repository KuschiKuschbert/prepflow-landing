// Critical CSS Implementation for PrepFlow
// Inlines critical CSS for above-the-fold content to improve LCP

// Critical CSS for above-the-fold content
export const CRITICAL_CSS = `
/* Critical CSS for PrepFlow Landing Page */
/* Above-the-fold content only */

/* Reset and base styles */
*,*::before,*::after{box-sizing:border-box}
html{line-height:1.15;-webkit-text-size-adjust:100%}
body{margin:0;font-family:var(--font-geist-sans),system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.6;color:#ffffff;background-color:#0a0a0a}

/* Critical layout styles */
.min-h-screen{min-height:100vh}
.bg-\\[\\#0a0a0a\\]{background-color:#0a0a0a}
.text-white{color:#ffffff}
.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}

/* Critical container styles */
.container{margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem}
@media (min-width:640px){.container{max-width:640px}}
@media (min-width:768px){.container{max-width:768px}}
@media (min-width:1024px){.container{max-width:1024px}}
@media (min-width:1280px){.container{max-width:1280px}}

/* Critical header styles */
.header{position:fixed;top:0;left:0;right:0;z-index:50;background-color:rgba(10,10,10,0.95);backdrop-filter:blur(10px);border-bottom:1px solid #2a2a2a}
.header-content{display:flex;align-items:center;justify-content:space-between;height:4rem;padding:0 1rem}

/* Critical hero section styles */
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem 1rem;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 100%)}
.hero-content{max-width:1200px;width:100%;text-align:center}
.hero-title{font-size:3rem;font-weight:700;line-height:1.1;margin-bottom:1.5rem;background:linear-gradient(135deg,#29E7CD 0%,#D925C7 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
@media (min-width:768px){.hero-title{font-size:4rem}}
@media (min-width:1024px){.hero-title{font-size:5rem}}

/* Critical button styles */
.btn{display:inline-flex;align-items:center;justify-content:center;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:600;text-decoration:none;transition:all 0.2s;border:none;cursor:pointer}
.btn-primary{background:linear-gradient(135deg,#29E7CD 0%,#D925C7 100%);color:#000000}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(41,231,205,0.3)}
.btn-secondary{background-color:rgba(41,231,205,0.1);color:#29E7CD;border:1px solid rgba(41,231,205,0.2)}
.btn-secondary:hover{background-color:rgba(41,231,205,0.2)}

/* Critical image styles */
.hero-image{width:100%;height:auto;border-radius:0.75rem;border:1px solid #2a2a2a;margin-top:2rem}
@media (min-width:768px){.hero-image{max-width:800px}}

/* Critical navigation styles */
.nav{display:flex;align-items:center;gap:2rem}
.nav-link{color:#ffffff;text-decoration:none;font-weight:500;transition:color 0.2s}
.nav-link:hover{color:#29E7CD}

/* Critical mobile navigation */
.mobile-nav-toggle{display:none;background:none;border:none;color:#ffffff;cursor:pointer;padding:0.5rem}
@media (max-width:767px){.mobile-nav-toggle{display:block}}

/* Critical loading states */
.loading-skeleton{background:linear-gradient(90deg,#1f1f1f 25%,#2a2a2a 50%,#1f1f1f 75%);background-size:200% 100%;animation:loading 1.5s infinite}
@keyframes loading{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* Critical typography */
.text-4xl{font-size:2.25rem;line-height:2.5rem}
.text-5xl{font-size:3rem;line-height:1}
.text-6xl{font-size:3.75rem;line-height:1}
.font-bold{font-weight:700}
.font-semibold{font-weight:600}
.leading-tight{line-height:1.25}
.leading-relaxed{line-height:1.625}

/* Critical spacing */
.mb-4{margin-bottom:1rem}
.mb-6{margin-bottom:1.5rem}
.mb-8{margin-bottom:2rem}
.mt-4{margin-top:1rem}
.mt-6{margin-top:1.5rem}
.mt-8{margin-top:2rem}
.p-4{padding:1rem}
.p-6{padding:1.5rem}
.p-8{padding:2rem}

/* Critical responsive utilities */
@media (max-width:767px){
  .hero-title{font-size:2.5rem}
  .hero{padding:1rem}
  .container{padding-left:0.5rem;padding-right:0.5rem}
}

/* Critical animations */
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.animate-fade-in-up{animation:fadeInUp 0.6s ease-out}
.animate-fade-in{animation:fadeIn 0.6s ease-out}

/* Critical focus styles */
.focus\\:ring-2:focus{outline:2px solid transparent;outline-offset:2px;box-shadow:0 0 0 2px #29E7CD}
.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}

/* Critical accessibility */
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
`;

// Non-critical CSS that can be loaded asynchronously
export const NON_CRITICAL_CSS = `
/* Non-critical CSS for PrepFlow */
/* Loaded asynchronously after initial render */

/* Detailed component styles */
.card{background-color:#1f1f1f;border-radius:1rem;padding:1.5rem;border:1px solid #2a2a2a;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)}
.card:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(0,0,0,0.2)}

/* Form styles */
.form-input{width:100%;padding:0.75rem;border:1px solid #2a2a2a;border-radius:0.5rem;background-color:#1f1f1f;color:#ffffff;font-size:1rem}
.form-input:focus{border-color:#29E7CD;box-shadow:0 0 0 2px rgba(41,231,205,0.2)}

/* Button variants */
.btn-lg{padding:1rem 2rem;font-size:1.125rem}
.btn-sm{padding:0.5rem 1rem;font-size:0.875rem}

/* Grid layouts */
.grid{display:grid}
.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
@media (min-width:768px){
  .md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
  .md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
}

/* Flexbox utilities */
.flex{display:flex}
.items-center{align-items:center}
.justify-center{justify-content:center}
.justify-between{justify-content:space-between}
.gap-4{gap:1rem}
.gap-6{gap:1.5rem}
.gap-8{gap:2rem}

/* Text utilities */
.text-center{text-align:center}
.text-left{text-align:left}
.text-right{text-align:right}

/* Spacing utilities */
.space-y-4 > * + *{margin-top:1rem}
.space-y-6 > * + *{margin-top:1.5rem}
.space-y-8 > * + *{margin-top:2rem}

/* Border utilities */
.border{border-width:1px}
.border-gray-600{border-color:#4b5563}
.rounded{border-radius:0.25rem}
.rounded-lg{border-radius:0.5rem}
.rounded-xl{border-radius:0.75rem}

/* Shadow utilities */
.shadow{box-shadow:0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06)}
.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)}
.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)}

/* Hover effects */
.hover\\:scale-105:hover{transform:scale(1.05)}
.hover\\:shadow-xl:hover{box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)}
.hover\\:text-\\[\\#29E7CD\\]:hover{color:#29E7CD}

/* Transition utilities */
.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
.duration-200{transition-duration:200ms}
.duration-300{transition-duration:300ms}

/* Responsive utilities */
@media (max-width:767px){
  .sm\\:hidden{display:none}
  .sm\\:block{display:block}
  .sm\\:text-sm{font-size:0.875rem}
  .sm\\:px-4{padding-left:1rem;padding-right:1rem}
}

@media (min-width:768px){
  .md\\:block{display:block}
  .md\\:hidden{display:none}
  .md\\:text-lg{font-size:1.125rem}
  .md\\:px-6{padding-left:1.5rem;padding-right:1.5rem}
}

@media (min-width:1024px){
  .lg\\:block{display:block}
  .lg\\:hidden{display:none}
  .lg\\:text-xl{font-size:1.25rem}
  .lg\\:px-8{padding-left:2rem;padding-right:2rem}
}
`;

// Critical CSS manager
export class CriticalCSSManager {
  private static instance: CriticalCSSManager;
  private criticalCSSLoaded = false;
  private nonCriticalCSSLoaded = false;
  
  static getInstance(): CriticalCSSManager {
    if (!CriticalCSSManager.instance) {
      CriticalCSSManager.instance = new CriticalCSSManager();
    }
    return CriticalCSSManager.instance;
  }
  
  // Inject critical CSS into the page
  injectCriticalCSS(): void {
    if (typeof window === 'undefined') return;
    if (this.criticalCSSLoaded) return;
    
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = CRITICAL_CSS;
    
    // Insert at the beginning of head for highest priority
    document.head.insertBefore(style, document.head.firstChild);
    this.criticalCSSLoaded = true;
    
    console.log('🎨 Critical CSS injected');
  }
  
  // Load non-critical CSS asynchronously
  loadNonCriticalCSS(): void {
    if (typeof window === 'undefined') return;
    if (this.nonCriticalCSSLoaded) return;
    
    const style = document.createElement('style');
    style.id = 'non-critical-css';
    style.textContent = NON_CRITICAL_CSS;
    
    // Load after a delay to prioritize critical rendering
    setTimeout(() => {
      document.head.appendChild(style);
      this.nonCriticalCSSLoaded = true;
      console.log('🎨 Non-critical CSS loaded');
    }, 100);
  }
  
  // Load CSS from external file
  loadExternalCSS(href: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('CSS loading not available in server environment'));
        return;
      }
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.id = id;
      link.onload = () => {
        console.log(`🎨 External CSS loaded: ${href}`);
        resolve();
      };
      link.onerror = () => {
        console.error(`❌ Failed to load CSS: ${href}`);
        reject(new Error(`Failed to load CSS: ${href}`));
      };
      
      document.head.appendChild(link);
    });
  }
  
  // Preload CSS file
  preloadCSS(href: string): void {
    if (typeof window === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      // Convert preload to stylesheet
      link.rel = 'stylesheet';
      console.log(`🎨 CSS preloaded and loaded: ${href}`);
    };
    
    document.head.appendChild(link);
  }
  
  // Optimize CSS loading based on connection
  optimizeCSSLoading(connectionType: string): void {
    if (typeof window === 'undefined') return;
    
    // Always inject critical CSS immediately
    this.injectCriticalCSS();
    
    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        // Load non-critical CSS after a longer delay
        setTimeout(() => {
          this.loadNonCriticalCSS();
        }, 2000);
        break;
      case '3g':
        // Load non-critical CSS after a moderate delay
        setTimeout(() => {
          this.loadNonCriticalCSS();
        }, 1000);
        break;
      case '4g':
      case '5g':
      default:
        // Load non-critical CSS quickly
        setTimeout(() => {
          this.loadNonCriticalCSS();
        }, 100);
        break;
    }
  }
  
  // Get CSS loading status
  getCSSLoadingStatus(): { critical: boolean; nonCritical: boolean } {
    return {
      critical: this.criticalCSSLoaded,
      nonCritical: this.nonCriticalCSSLoaded,
    };
  }
  
  // Remove critical CSS (for testing)
  removeCriticalCSS(): void {
    if (typeof window === 'undefined') return;
    
    const criticalStyle = document.getElementById('critical-css');
    if (criticalStyle) {
      criticalStyle.remove();
      this.criticalCSSLoaded = false;
    }
  }
  
  // Clear all CSS (for testing)
  clearAllCSS(): void {
    if (typeof window === 'undefined') return;
    
    this.removeCriticalCSS();
    
    const nonCriticalStyle = document.getElementById('non-critical-css');
    if (nonCriticalStyle) {
      nonCriticalStyle.remove();
      this.nonCriticalCSSLoaded = false;
    }
  }
}

// Export singleton instance
export const criticalCSSManager = CriticalCSSManager.getInstance();

// CSS performance monitoring
export function trackCSSPerformance(cssType: string, loadTime: number, size: number): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'css_load', {
      event_category: 'performance',
      event_label: 'css_optimization',
      value: Math.round(loadTime),
      custom_parameter_css_type: cssType,
      custom_parameter_load_time: Math.round(loadTime),
      custom_parameter_css_size: size,
    });
  }
}

// Generate critical CSS for specific page
export function generatePageCriticalCSS(pageType: 'landing' | 'webapp' | 'auth'): string {
  const baseCriticalCSS = CRITICAL_CSS;
  
  switch (pageType) {
    case 'landing':
      return baseCriticalCSS + `
        /* Landing page specific critical CSS */
        .hero-cta{margin-top:2rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
        .hero-image{max-width:100%;height:auto;border-radius:1rem}
      `;
    
    case 'webapp':
      return baseCriticalCSS + `
        /* WebApp specific critical CSS */
        .dashboard{min-height:100vh;background-color:#0a0a0a}
        .sidebar{width:16rem;background-color:#1f1f1f;border-right:1px solid #2a2a2a}
        .main-content{flex:1;padding:2rem}
      `;
    
    case 'auth':
      return baseCriticalCSS + `
        /* Auth page specific critical CSS */
        .auth-container{min-height:100vh;display:flex;align-items:center;justify-content:center}
        .auth-card{width:100%;max-width:400px;background-color:#1f1f1f;border-radius:1rem;padding:2rem}
      `;
    
    default:
      return baseCriticalCSS;
  }
}
