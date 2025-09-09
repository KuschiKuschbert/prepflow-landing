module.exports = {

"[project]/lib/ab-testing-analytics.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// PrepFlow A/B Testing Analytics
// Tracks variant performance, user behavior, and statistical significance
__turbopack_context__.s({
    "abTestingAnalytics": ()=>abTestingAnalytics,
    "assignVariant": ()=>assignVariant,
    "getActiveTests": ()=>getActiveTests,
    "getCurrentVariant": ()=>getCurrentVariant,
    "getTestResults": ()=>getTestResults,
    "getVariantAssignmentInfo": ()=>getVariantAssignmentInfo,
    "getVariantInfo": ()=>getVariantInfo,
    "trackConversion": ()=>trackConversion,
    "trackEngagement": ()=>trackEngagement
});
class ABTestingAnalytics {
    tests = new Map();
    events = [];
    userVariants = new Map();
    constructor(){
        this.initializeDefaultTests();
    }
    initializeDefaultTests() {
        // Define your A/B test variants
        this.addTest('landing_page_variants', [
            {
                id: 'control',
                name: 'Control',
                description: 'Original landing page',
                trafficSplit: 25,
                isControl: true
            },
            {
                id: 'variant_a',
                name: 'Variant A',
                description: 'Alternative hero section',
                trafficSplit: 25,
                isControl: false
            },
            {
                id: 'variant_b',
                name: 'Variant B',
                description: 'Different pricing layout',
                trafficSplit: 25,
                isControl: false
            },
            {
                id: 'variant_c',
                name: 'Variant C',
                description: 'New CTA positioning',
                trafficSplit: 25,
                isControl: false
            }
        ]);
    }
    addTest(testId, variants) {
        this.tests.set(testId, variants);
    }
    assignVariant(testId, userId) {
        console.log('🎯 Assigning variant for:', {
            testId,
            userId
        });
        const variants = this.tests.get(testId);
        if (!variants) {
            console.warn(`AB test ${testId} not found`);
            return 'control';
        }
        // Check for existing persistent variant assignment
        const persistentVariant = this.getPersistentVariant(userId);
        if (persistentVariant) {
            console.log('🎯 Returning existing persistent variant:', persistentVariant);
            return persistentVariant;
        }
        // Assign new persistent variant based on traffic split
        const assignedVariant = this.assignNewPersistentVariant(testId, userId, variants);
        console.log('🎯 Assigned new persistent variant:', assignedVariant);
        // Track variant assignment
        this.trackEvent({
            testId,
            variantId: assignedVariant,
            userId,
            sessionId: this.getSessionId(),
            eventType: 'variant_assigned',
            timestamp: Date.now(),
            metadata: {
                variant_name: variants.find((v)=>v.id === assignedVariant)?.name || assignedVariant,
                is_control: assignedVariant === 'control',
                assignment_type: 'persistent',
                rotation_period: '1_month'
            }
        });
        return assignedVariant;
    }
    getPersistentVariant(userId) {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }
    assignNewPersistentVariant(testId, userId, variants) {
        // Assign variant based on traffic split
        const random = Math.random() * 100;
        let cumulativeSplit = 0;
        for (const variant of variants){
            cumulativeSplit += variant.trafficSplit;
            if (random <= cumulativeSplit) {
                const assignedVariant = variant.id;
                // Store persistent assignment
                this.storePersistentVariant(userId, assignedVariant);
                return assignedVariant;
            }
        }
        // Fallback to control
        const assignedVariant = 'control';
        this.storePersistentVariant(userId, assignedVariant);
        return assignedVariant;
    }
    storePersistentVariant(userId, variantId) {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
    getCurrentVariant(testId, userId) {
        return this.assignVariant(testId, userId);
    }
    trackEvent(event) {
        this.events.push(event);
        // Send to Google Analytics with variant context
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Log in development
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('🧪 AB Test Event:', event);
        }
    }
    trackConversion(testId, userId, value, metadata) {
        const variantId = this.getCurrentVariant(testId, userId);
        this.trackEvent({
            testId,
            variantId,
            userId,
            sessionId: this.getSessionId(),
            eventType: 'conversion',
            eventValue: value,
            timestamp: Date.now(),
            metadata
        });
    }
    trackEngagement(testId, userId, engagementType, metadata) {
        const variantId = this.getCurrentVariant(testId, userId);
        this.trackEvent({
            testId,
            variantId,
            userId,
            sessionId: this.getSessionId(),
            eventType: 'engagement',
            timestamp: Date.now(),
            metadata: {
                engagement_type: engagementType,
                ...metadata
            }
        });
    }
    getTestResults(testId) {
        const variants = this.tests.get(testId);
        if (!variants) return [];
        const results = [];
        for (const variant of variants){
            const variantEvents = this.events.filter((e)=>e.testId === testId && e.variantId === variant.id);
            const totalUsers = new Set(variantEvents.map((e)=>e.userId)).size;
            const conversions = variantEvents.filter((e)=>e.eventType === 'conversion').length;
            const conversionRate = totalUsers > 0 ? conversions / totalUsers * 100 : 0;
            const conversionEvents = variantEvents.filter((e)=>e.eventType === 'conversion');
            const totalValue = conversionEvents.reduce((sum, e)=>sum + (e.eventValue || 0), 0);
            const averageOrderValue = conversions > 0 ? totalValue / conversions : 0;
            results.push({
                testId,
                variantId: variant.id,
                totalUsers,
                conversions,
                conversionRate,
                averageOrderValue,
                revenue: totalValue,
                statisticalSignificance: this.calculateStatisticalSignificance(testId, variant.id)
            });
        }
        return results.sort((a, b)=>b.conversionRate - a.conversionRate);
    }
    calculateStatisticalSignificance(testId, variantId) {
        // Simplified statistical significance calculation
        // In production, you'd want to use a proper statistical library
        const variantEvents = this.events.filter((e)=>e.testId === testId && e.variantId === variantId);
        const controlEvents = this.events.filter((e)=>e.testId === testId && e.variantId === 'control');
        const variantConversions = variantEvents.filter((e)=>e.eventType === 'conversion').length;
        const variantTotal = variantEvents.length;
        const controlConversions = controlEvents.filter((e)=>e.eventType === 'conversion').length;
        const controlTotal = controlEvents.length;
        if (variantTotal === 0 || controlTotal === 0) return 0;
        const variantRate = variantConversions / variantTotal;
        const controlRate = controlConversions / controlTotal;
        // Basic significance calculation (simplified)
        const difference = Math.abs(variantRate - controlRate);
        const significance = Math.min(difference * 100, 100); // 0-100 scale
        return Math.round(significance);
    }
    getSessionId() {
        // Generate or retrieve session ID
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return 'server_session_' + Date.now();
    }
    exportData() {
        return {
            tests: this.tests,
            events: this.events,
            userVariants: this.userVariants
        };
    }
    getActiveTests() {
        return Array.from(this.tests.keys());
    }
    getVariantInfo(testId, variantId) {
        const variants = this.tests.get(testId);
        return variants?.find((v)=>v.id === variantId);
    }
    getVariantAssignmentInfo(userId) {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }
}
const abTestingAnalytics = new ABTestingAnalytics();
const assignVariant = abTestingAnalytics.assignVariant.bind(abTestingAnalytics);
const getCurrentVariant = abTestingAnalytics.getCurrentVariant.bind(abTestingAnalytics);
const trackConversion = abTestingAnalytics.trackConversion.bind(abTestingAnalytics);
const trackEngagement = abTestingAnalytics.trackEngagement.bind(abTestingAnalytics);
const getTestResults = abTestingAnalytics.getTestResults.bind(abTestingAnalytics);
const getActiveTests = abTestingAnalytics.getActiveTests.bind(abTestingAnalytics);
const getVariantInfo = abTestingAnalytics.getVariantInfo.bind(abTestingAnalytics);
const getVariantAssignmentInfo = abTestingAnalytics.getVariantAssignmentInfo.bind(abTestingAnalytics);
}),
"[project]/lib/analytics.ts [app-ssr] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

// PrepFlow Analytics Service
// Tracks conversions, user behavior, and performance metrics
__turbopack_context__.s({
    "analytics": ()=>analytics,
    "getSessionId": ()=>getSessionId,
    "setUserId": ()=>setUserId,
    "trackConversion": ()=>trackConversion,
    "trackEvent": ()=>trackEvent,
    "trackPerformance": ()=>trackPerformance
});
// Export A/B testing functions
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ab$2d$testing$2d$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ab-testing-analytics.ts [app-ssr] (ecmascript)");
class PrepFlowAnalytics {
    sessionId;
    userId;
    events = [];
    conversions = [];
    performance = [];
    constructor(){
        this.sessionId = this.generateSessionId();
        this.loadUserId();
        this.initializeAnalytics();
    }
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    loadUserId() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    generateStableUserId() {
        // Generate a stable user ID that persists across sessions
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }
    initializeAnalytics() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    trackPageView() {
        const event = {
            action: 'page_view',
            category: 'navigation',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        };
        this.events.push(event);
        this.sendToAnalytics(event);
    }
    trackPerformance() {
        if ('performance' in window) {
            const observer = new PerformanceObserver((list)=>{
                for (const entry of list.getEntries()){
                    if (entry.entryType === 'navigation') {
                        const navEntry = entry;
                        const metrics = {
                            pageLoadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
                            firstContentfulPaint: 0,
                            largestContentfulPaint: 0,
                            firstInputDelay: 0,
                            cumulativeLayoutShift: 0,
                            timestamp: Date.now(),
                            page: window.location.pathname,
                            sessionId: this.sessionId
                        };
                        this.performance.push(metrics);
                        this.sendPerformanceMetrics(metrics);
                    }
                }
            });
            observer.observe({
                entryTypes: [
                    'navigation'
                ]
            });
        }
    }
    trackUserInteractions() {
        // Track CTA clicks
        document.addEventListener('click', (e)=>{
            const target = e.target;
            const cta = target.closest('a, button');
            if (cta) {
                const text = cta.textContent?.trim() || '';
                const href = cta.href;
                // Track Gumroad purchase links
                if (href && href.includes('gumroad.com/l/prepflow')) {
                    this.trackConversion({
                        type: 'cta_click',
                        element: 'gumroad_purchase',
                        page: window.location.pathname,
                        timestamp: Date.now(),
                        sessionId: this.sessionId,
                        userId: this.userId,
                        metadata: {
                            href,
                            text,
                            action: 'purchase_start'
                        }
                    });
                    // Send enhanced GA4 event
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                }
                // Track demo/watch buttons
                if (text.includes('Watch Demo') || text.includes('Demo')) {
                    this.trackConversion({
                        type: 'demo_watch',
                        element: text,
                        page: window.location.pathname,
                        timestamp: Date.now(),
                        sessionId: this.sessionId,
                        userId: this.userId,
                        metadata: {
                            href,
                            text,
                            action: 'demo_start'
                        }
                    });
                }
                // Track general CTA clicks
                if (text.includes('Get Started') || text.includes('Start')) {
                    this.trackConversion({
                        type: 'cta_click',
                        element: text,
                        page: window.location.pathname,
                        timestamp: Date.now(),
                        sessionId: this.sessionId,
                        userId: this.userId,
                        metadata: {
                            href,
                            text,
                            action: 'cta_click'
                        }
                    });
                }
            }
        });
        // Track scroll depth and key sections
        let maxScrollDepth = 0;
        const keySections = [
            '#features',
            '#demo',
            '#pricing',
            '#faq'
        ];
        window.addEventListener('scroll', ()=>{
            const scrollDepth = Math.round(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100);
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                if (maxScrollDepth % 25 === 0) {
                    this.trackEvent('scroll_depth', 'engagement', `${maxScrollDepth}%`);
                }
            }
            // Track key section visibility
            keySections.forEach((sectionId)=>{
                const section = document.querySelector(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    if (isVisible && !section.hasAttribute('data-tracked')) {
                        section.setAttribute('data-tracked', 'true');
                        const sectionName = sectionId.replace('#', '');
                        this.trackEvent('section_view', 'engagement', sectionName);
                        // Send enhanced GA4 event for key sections
                        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                        ;
                    }
                }
            });
        });
    }
    trackConversions() {
        // Track demo video views
        const demoVideo = document.querySelector('iframe[src*="youtube"]');
        if (demoVideo) {
            // YouTube iframe tracking would require YouTube API integration
            // For now, we'll track when the demo section comes into view
            const observer = new IntersectionObserver((entries)=>{
                entries.forEach((entry)=>{
                    if (entry.isIntersecting) {
                        this.trackConversion({
                            type: 'demo_watch',
                            element: 'demo_section',
                            page: window.location.pathname,
                            timestamp: Date.now(),
                            sessionId: this.sessionId,
                            userId: this.userId,
                            metadata: {
                                section: 'demo'
                            }
                        });
                        observer.disconnect();
                    }
                });
            });
            observer.observe(demoVideo);
        }
    }
    trackEvent(action, category, label, value) {
        const event = {
            action,
            category,
            label,
            value,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            page: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '/',
            referrer: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined,
            userAgent: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined
        };
        this.events.push(event);
        this.sendToAnalytics(event);
    }
    trackConversion(conversion) {
        this.conversions.push(conversion);
        this.sendConversionData(conversion);
        // Also track as a regular event
        this.trackEvent('conversion', 'business', conversion.type, 1);
    }
    trackPerformanceMetrics(metrics) {
        const fullMetrics = {
            pageLoadTime: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            firstInputDelay: 0,
            cumulativeLayoutShift: 0,
            timestamp: Date.now(),
            page: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '/',
            sessionId: this.sessionId,
            ...metrics
        };
        this.performance.push(fullMetrics);
        this.sendPerformanceMetrics(fullMetrics);
    }
    sendToAnalytics(event) {
        // Send to Vercel Analytics (automatic)
        // Send to custom analytics endpoint if needed
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('📊 Analytics Event:', event);
        }
        // Send to Google Analytics 4
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    sendConversionData(conversion) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('🎯 Conversion Event:', conversion);
        }
        // Send to Google Analytics 4
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    // Send to conversion tracking endpoints
    // Example: Facebook Pixel, Google Ads, etc.
    }
    sendPerformanceMetrics(metrics) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('⚡ Performance Metrics:', metrics);
        }
    // Send to performance monitoring services
    // Example: Sentry, LogRocket, etc.
    }
    getSessionId() {
        return this.sessionId;
    }
    getUserId() {
        return this.userId;
    }
    setUserId(userId) {
        this.userId = userId;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    getEvents() {
        return [
            ...this.events
        ];
    }
    getConversions() {
        return [
            ...this.conversions
        ];
    }
    getPerformance() {
        return [
            ...this.performance
        ];
    }
    exportData() {
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            events: this.events,
            conversions: this.conversions,
            performance: this.performance
        };
    }
}
const analytics = new PrepFlowAnalytics();
const trackEvent = analytics.trackEvent.bind(analytics);
const trackConversion = analytics.trackConversion.bind(analytics);
const trackPerformance = analytics.trackPerformanceMetrics.bind(analytics);
const getSessionId = analytics.getSessionId.bind(analytics);
const setUserId = analytics.setUserId.bind(analytics);
;
}),
"[project]/lib/analytics.ts [app-ssr] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ab$2d$testing$2d$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ab-testing-analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <locals>");
}),
"[project]/components/ExitIntentPopup.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>ExitIntentPopup
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <locals>");
'use client';
;
;
;
function ExitIntentPopup({ isVisible, onClose, onSuccess }) {
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [isSuccess, setIsSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const popupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Close popup when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClickOutside = (event)=>{
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent body scroll when popup is open
            document.body.style.overflow = 'hidden';
        }
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [
        isVisible,
        onClose
    ]);
    // Close popup on escape key
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleEscape = (event)=>{
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isVisible) {
            document.addEventListener('keydown', handleEscape);
        }
        return ()=>{
            document.removeEventListener('keydown', handleEscape);
        };
    }, [
        isVisible,
        onClose
    ]);
    const validateForm = ()=>{
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            // Track the exit-intent conversion
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('exit_intent_conversion', 'conversion', 'lead_magnet', 1);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackConversion"])({
                type: 'signup_start',
                element: 'exit_intent_popup',
                page: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '/',
                timestamp: Date.now(),
                sessionId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getSessionId"])(),
                metadata: {
                    conversion_type: 'exit_intent_lead_magnet',
                    user_name: formData.name
                }
            });
            // Simulate API call (replace with actual email service)
            await new Promise((resolve)=>setTimeout(resolve, 1000));
            // Success handling
            setIsSuccess(true);
            onSuccess?.(formData);
            // Auto-close after success
            setTimeout(()=>{
                onClose();
                // Reset form for next time
                setFormData({
                    name: '',
                    email: ''
                });
                setIsSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Exit intent form submission failed:', error);
        } finally{
            setIsSubmitting(false);
        }
    };
    const handleInputChange = (field, value)=>{
        setFormData((prev)=>({
                ...prev,
                [field]: value
            }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev)=>({
                    ...prev,
                    [field]: undefined
                }));
        }
    };
    if (!isVisible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: popupRef,
            className: "relative w-full max-w-md bg-[#1f1f1f] border border-[#29E7CD]/30 rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-300",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "absolute top-4 right-4 text-gray-400 hover:text-white transition-colors",
                    "aria-label": "Close popup",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-6 h-6",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M6 18L18 6M6 6l12 12"
                        }, void 0, false, {
                            fileName: "[project]/components/ExitIntentPopup.tsx",
                            lineNumber: 143,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ExitIntentPopup.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ExitIntentPopup.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this),
                isSuccess ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-6xl mb-4",
                            children: "🎉"
                        }, void 0, false, {
                            fileName: "[project]/components/ExitIntentPopup.tsx",
                            lineNumber: 149,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-2xl font-bold text-[#29E7CD] mb-2",
                            children: "Don't go yet!"
                        }, void 0, false, {
                            fileName: "[project]/components/ExitIntentPopup.tsx",
                            lineNumber: 150,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-300 mb-4",
                            children: "We've sent the sample dashboard to your email."
                        }, void 0, false, {
                            fileName: "[project]/components/ExitIntentPopup.tsx",
                            lineNumber: 153,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500",
                            children: "Check your inbox in the next few minutes."
                        }, void 0, false, {
                            fileName: "[project]/components/ExitIntentPopup.tsx",
                            lineNumber: 156,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ExitIntentPopup.tsx",
                    lineNumber: 148,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-4xl mb-3",
                                    children: "🚨"
                                }, void 0, false, {
                                    fileName: "[project]/components/ExitIntentPopup.tsx",
                                    lineNumber: 164,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-2xl font-bold text-white mb-2",
                                    children: "Wait! Before you go..."
                                }, void 0, false, {
                                    fileName: "[project]/components/ExitIntentPopup.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-300",
                                    children: "Get your free sample dashboard and see exactly how PrepFlow can transform your menu profitability."
                                }, void 0, false, {
                                    fileName: "[project]/components/ExitIntentPopup.tsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ExitIntentPopup.tsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "popup-name",
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Your name *"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ExitIntentPopup.tsx",
                                            lineNumber: 176,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "popup-name",
                                            type: "text",
                                            value: formData.name,
                                            onChange: (e)=>handleInputChange('name', e.target.value),
                                            placeholder: "Your name",
                                            className: `w-full px-4 py-3 rounded-xl border bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-[#29E7CD]'}`,
                                            "aria-describedby": errors.name ? 'popup-name-error' : undefined
                                        }, void 0, false, {
                                            fileName: "[project]/components/ExitIntentPopup.tsx",
                                            lineNumber: 179,
                                            columnNumber: 17
                                        }, this),
                                        errors.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            id: "popup-name-error",
                                            className: "mt-1 text-sm text-red-400",
                                            children: errors.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/ExitIntentPopup.tsx",
                                            lineNumber: 193,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ExitIntentPopup.tsx",
                                    lineNumber: 175,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "popup-email",
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Your email *"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ExitIntentPopup.tsx",
                                            lineNumber: 200,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "popup-email",
                                            type: "email",
                                            value: formData.email,
                                            onChange: (e)=>handleInputChange('email', e.target.value),
                                            placeholder: "your@email.com",
                                            className: `w-full px-4 py-3 rounded-xl border bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-[#29E7CD]'}`,
                                            "aria-describedby": errors.email ? 'popup-email-error' : undefined
                                        }, void 0, false, {
                                            fileName: "[project]/components/ExitIntentPopup.tsx",
                                            lineNumber: 203,
                                            columnNumber: 17
                                        }, this),
                                        errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            id: "popup-email-error",
                                            className: "mt-1 text-sm text-red-400",
                                            children: errors.email
                                        }, void 0, false, {
                                            fileName: "[project]/components/ExitIntentPopup.tsx",
                                            lineNumber: 217,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ExitIntentPopup.tsx",
                                    lineNumber: 199,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: isSubmitting,
                                    className: `w-full rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-[#29E7CD]/25'}`,
                                    children: isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center justify-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
                                                xmlns: "http://www.w3.org/2000/svg",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        className: "opacity-25",
                                                        cx: "12",
                                                        cy: "12",
                                                        r: "10",
                                                        stroke: "currentColor",
                                                        strokeWidth: "4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ExitIntentPopup.tsx",
                                                        lineNumber: 235,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        className: "opacity-75",
                                                        fill: "currentColor",
                                                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ExitIntentPopup.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ExitIntentPopup.tsx",
                                                lineNumber: 234,
                                                columnNumber: 21
                                            }, this),
                                            "Sending..."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ExitIntentPopup.tsx",
                                        lineNumber: 233,
                                        columnNumber: 19
                                    }, this) : 'Send me the sample dashboard'
                                }, void 0, false, {
                                    fileName: "[project]/components/ExitIntentPopup.tsx",
                                    lineNumber: 223,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ExitIntentPopup.tsx",
                            lineNumber: 174,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500",
                                    children: "No spam. No lock-in. Your data stays private."
                                }, void 0, false, {
                                    fileName: "[project]/components/ExitIntentPopup.tsx",
                                    lineNumber: 248,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "mt-3 text-sm text-gray-400 hover:text-white transition-colors underline",
                                    children: "No thanks, I'll continue browsing"
                                }, void 0, false, {
                                    fileName: "[project]/components/ExitIntentPopup.tsx",
                                    lineNumber: 251,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ExitIntentPopup.tsx",
                            lineNumber: 247,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ExitIntentPopup.tsx",
            lineNumber: 132,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ExitIntentPopup.tsx",
        lineNumber: 131,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ExitIntentTracker.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>ExitIntentTracker
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleTagManager$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GoogleTagManager.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ExitIntentPopup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ExitIntentPopup.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function ExitIntentTracker({ onExitIntent, enabled = true, showPopup = true }) {
    const [hasTriggered, setHasTriggered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showExitPopup, setShowExitPopup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled || hasTriggered) return;
        let mouseLeaveTimeout;
        const handleMouseLeave = (e)=>{
            // Only trigger if mouse leaves from the top of the page (likely user leaving)
            if (e.clientY <= 0) {
                setHasTriggered(true);
                // Track exit intent event
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('exit_intent', 'engagement', 'user_leaving_page');
                // Track as conversion event for analytics
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackConversion"])({
                    type: 'exit_intent',
                    element: 'page_exit',
                    page: window.location.pathname,
                    timestamp: Date.now(),
                    sessionId: 'exit_intent_session',
                    metadata: {
                        trigger: 'mouse_leave_top',
                        user_agent: navigator.userAgent,
                        referrer: document.referrer
                    }
                });
                // Show exit intent popup if enabled
                if (showPopup) {
                    setShowExitPopup(true);
                }
                // Call custom handler if provided
                if (onExitIntent) {
                    onExitIntent();
                }
                // Send to GTM data layer
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleTagManager$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGTMEvent"])('exit_intent', {
                    event_category: 'engagement',
                    event_label: 'user_leaving_page',
                    trigger: 'mouse_leave_top',
                    page: window.location.pathname,
                    user_agent: navigator.userAgent,
                    referrer: document.referrer
                });
                // Send to Google Analytics (legacy support)
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
        };
        const handleBeforeUnload = ()=>{
            if (!hasTriggered) {
                setHasTriggered(true);
                // Track page unload event
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('page_unload', 'engagement', 'user_closing_tab');
                // Send to GTM data layer
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleTagManager$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGTMEvent"])('page_unload', {
                    event_category: 'engagement',
                    event_label: 'user_closing_tab',
                    page: window.location.pathname
                });
                // Send to Google Analytics (legacy support)
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
        };
        const handleVisibilityChange = ()=>{
            if (document.hidden && !hasTriggered) {
                setHasTriggered(true);
                // Track tab switch/background event
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('tab_background', 'engagement', 'user_switched_tab');
                // Send to GTM data layer
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleTagManager$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGTMEvent"])('tab_background', {
                    event_category: 'engagement',
                    event_label: 'user_switched_tab',
                    page: window.location.pathname
                });
                // Send to Google Analytics (legacy support)
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
        };
        // Add event listeners
        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        // Cleanup
        return ()=>{
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (mouseLeaveTimeout) clearTimeout(mouseLeaveTimeout);
        };
    }, [
        enabled,
        hasTriggered,
        onExitIntent
    ]);
    // Render the exit intent popup
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ExitIntentPopup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            isVisible: showExitPopup,
            onClose: ()=>setShowExitPopup(false),
            onSuccess: (data)=>{
                console.log('Exit intent lead captured:', data);
                // Reset trigger so popup can show again if needed
                setHasTriggered(false);
            }
        }, void 0, false, {
            fileName: "[project]/components/ExitIntentTracker.tsx",
            lineNumber: 144,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
}),
"[project]/components/ScrollTracker.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>ScrollTracker
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ab$2d$testing$2d$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ab-testing-analytics.ts [app-ssr] (ecmascript)");
'use client';
;
;
function ScrollTracker({ onSectionView, onScrollDepth, enabled = true }) {
    const [scrollDepth, setScrollDepth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [viewedSections, setViewedSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [lastScrollTime, setLastScrollTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(Date.now());
    const scrollTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const sectionObserverRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled) return;
        let maxScrollDepth = 0;
        let scrollStartTime = Date.now();
        let isScrolling = false;
        // Enhanced scroll depth tracking
        const handleScroll = ()=>{
            const currentTime = Date.now();
            const scrollTop = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentScrollDepth = Math.round(scrollTop / documentHeight * 100);
            // Update scroll depth
            setScrollDepth(currentScrollDepth);
            // Track maximum scroll depth
            if (currentScrollDepth > maxScrollDepth) {
                maxScrollDepth = currentScrollDepth;
                // Track milestone scroll depths
                if (maxScrollDepth % 25 === 0) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('scroll_depth_milestone', 'engagement', `${maxScrollDepth}%`);
                    // Send to Google Analytics
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    if (onScrollDepth) {
                        onScrollDepth(maxScrollDepth);
                    }
                }
            }
            // Track scroll velocity and patterns
            if (!isScrolling) {
                isScrolling = true;
                scrollStartTime = currentTime;
            }
            setLastScrollTime(currentTime);
            // Clear existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            // Set timeout to detect when scrolling stops
            scrollTimeoutRef.current = setTimeout(()=>{
                isScrolling = false;
                const scrollDuration = currentTime - scrollStartTime;
                // Track scroll session
                if (scrollDuration > 1000) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('scroll_session', 'engagement', 'scroll_completed', scrollDuration);
                    // Send to Google Analytics
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                }
            }, 150); // 150ms delay to detect scroll end
        };
        // Section visibility tracking
        const setupSectionObserver = ()=>{
            const sections = document.querySelectorAll('section[id], [id^="section-"], [id^="feature-"], [id^="pricing-"], [id^="faq-"]');
            if (sections.length > 0) {
                sectionObserverRef.current = new IntersectionObserver((entries)=>{
                    entries.forEach((entry)=>{
                        if (entry.isIntersecting) {
                            const sectionId = entry.target.id || entry.target.getAttribute('data-section') || 'unknown';
                            if (!viewedSections.has(sectionId)) {
                                setViewedSections((prev)=>new Set([
                                        ...prev,
                                        sectionId
                                    ]));
                                // Track section view
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('section_view', 'engagement', sectionId);
                                // Track engagement
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ab$2d$testing$2d$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackEngagement"])('landing_page_variants', 'user_' + Math.random().toString(36).substr(2, 9), 'section_view', {
                                    section_id: sectionId,
                                    section_name: entry.target.textContent?.substring(0, 50) || 'unknown',
                                    scroll_depth_at_view: scrollDepth
                                });
                                // Send to Google Analytics
                                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                                ;
                                if (onSectionView) {
                                    onSectionView(sectionId);
                                }
                            }
                        }
                    });
                }, {
                    threshold: 0.3,
                    rootMargin: '0px 0px -10% 0px' // Slight offset for better detection
                });
                sections.forEach((section)=>{
                    sectionObserverRef.current?.observe(section);
                });
            }
        };
        // Time on page tracking
        const startTimeOnPage = Date.now();
        const timeOnPageInterval = setInterval(()=>{
            const timeOnPage = Date.now() - startTimeOnPage;
            // Track time milestones
            if (timeOnPage % 30000 === 0) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('time_on_page', 'engagement', `${Math.round(timeOnPage / 1000)}s`);
                // Send to Google Analytics
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
        }, 1000);
        // Setup initial tracking
        setupSectionObserver();
        // Add scroll listener
        window.addEventListener('scroll', handleScroll, {
            passive: true
        });
        // Cleanup
        return ()=>{
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            if (sectionObserverRef.current) {
                sectionObserverRef.current.disconnect();
            }
            clearInterval(timeOnPageInterval);
        };
    }, [
        enabled,
        onSectionView,
        onScrollDepth,
        viewedSections,
        scrollDepth
    ]);
    // This component doesn't render anything visible
    return null;
}
}),
"[project]/components/PerformanceTracker.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>PerformanceTracker
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <locals>");
'use client';
;
;
function PerformanceTracker({ onMetrics, enabled = true }) {
    const hasTrackedInitial = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const hasTrackedLCP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const hasTrackedFID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const hasTrackedCLS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled) return;
        // Track initial page load performance
        const trackInitialPerformance = ()=>{
            if (hasTrackedInitial.current) return;
            hasTrackedInitial.current = true;
            const navigationEntry = performance.getEntriesByType('navigation')[0];
            if (navigationEntry) {
                const metrics = {
                    pageLoadTime: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
                    domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
                    firstByte: navigationEntry.responseStart - navigationEntry.requestStart,
                    domInteractive: navigationEntry.domInteractive - navigationEntry.fetchStart,
                    redirectTime: navigationEntry.redirectEnd - navigationEntry.redirectStart,
                    dnsTime: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
                    tcpTime: navigationEntry.connectEnd - navigationEntry.connectStart,
                    serverResponseTime: navigationEntry.responseEnd - navigationEntry.responseStart
                };
                // Track performance metrics
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackPerformance"])(metrics);
                // Send to Google Analytics
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                if (onMetrics) {
                    onMetrics(metrics);
                }
            }
        };
        // Track Core Web Vitals
        const trackCoreWebVitals = ()=>{
            // Largest Contentful Paint (LCP)
            if ('PerformanceObserver' in window && !hasTrackedLCP.current) {
                const lcpObserver = new PerformanceObserver((list)=>{
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    if (lastEntry && !hasTrackedLCP.current) {
                        hasTrackedLCP.current = true;
                        const lcp = lastEntry.startTime;
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('lcp', 'performance', 'largest_contentful_paint', Math.round(lcp));
                        // Send to Google Analytics
                        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                        ;
                    }
                });
                lcpObserver.observe({
                    entryTypes: [
                        'largest-contentful-paint'
                    ]
                });
            }
            // First Input Delay (FID)
            if ('PerformanceObserver' in window && !hasTrackedFID.current) {
                const fidObserver = new PerformanceObserver((list)=>{
                    const entries = list.getEntries();
                    entries.forEach((entry)=>{
                        if (!hasTrackedFID.current) {
                            hasTrackedFID.current = true;
                            const fid = entry.processingStart - entry.startTime;
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('fid', 'performance', 'first_input_delay', Math.round(fid));
                            // Send to Google Analytics
                            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                            ;
                        }
                    });
                });
                fidObserver.observe({
                    entryTypes: [
                        'first-input'
                    ]
                });
            }
            // Cumulative Layout Shift (CLS)
            if ('PerformanceObserver' in window && !hasTrackedCLS.current) {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list)=>{
                    const entries = list.getEntries();
                    entries.forEach((entry)=>{
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                });
                clsObserver.observe({
                    entryTypes: [
                        'layout-shift'
                    ]
                });
                // Track CLS after a delay to capture the full value
                setTimeout(()=>{
                    if (!hasTrackedCLS.current && clsValue > 0) {
                        hasTrackedCLS.current = true;
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('cls', 'performance', 'cumulative_layout_shift', Math.round(clsValue * 1000));
                        // Send to Google Analytics
                        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                        ;
                    }
                }, 5000); // Wait 5 seconds to capture most layout shifts
            }
        };
        // Track resource loading performance
        const trackResourcePerformance = ()=>{
            if ('PerformanceObserver' in window) {
                const resourceObserver = new PerformanceObserver((list)=>{
                    list.getEntries().forEach((entry)=>{
                        if (entry.entryType === 'resource') {
                            const resourceMetrics = {
                                name: entry.name,
                                duration: Math.round(entry.duration),
                                size: entry.transferSize || 0,
                                type: entry.initiatorType
                            };
                            // Only track slow resources (> 1 second)
                            if (entry.duration > 1000) {
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('slow_resource', 'performance', entry.name, Math.round(entry.duration));
                                // Send to Google Analytics
                                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                                ;
                            }
                        }
                    });
                });
                resourceObserver.observe({
                    entryTypes: [
                        'resource'
                    ]
                });
            }
        };
        // Initialize tracking
        if (document.readyState === 'complete') {
            trackInitialPerformance();
            trackCoreWebVitals();
            trackResourcePerformance();
        } else {
            window.addEventListener('load', ()=>{
                trackInitialPerformance();
                trackCoreWebVitals();
                trackResourcePerformance();
            });
        }
        // Track performance after user interaction
        const trackInteractionPerformance = ()=>{
            if (hasTrackedInitial.current) {
                const timeSinceLoad = performance.now();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('user_interaction', 'performance', 'interaction_timing', Math.round(timeSinceLoad));
                // Send to Google Analytics
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
        };
        // Add interaction listeners
        document.addEventListener('click', trackInteractionPerformance, {
            once: true
        });
        document.addEventListener('scroll', trackInteractionPerformance, {
            once: true
        });
        // Cleanup
        return ()=>{
            document.removeEventListener('click', trackInteractionPerformance);
            document.removeEventListener('scroll', trackInteractionPerformance);
        };
    }, [
        enabled,
        onMetrics
    ]);
    // This component doesn't render anything visible
    return null;
}
}),
"[project]/components/PerformanceOptimizer.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>PerformanceOptimizer
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
function PerformanceOptimizer({ enabled = true }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        // Preload critical resources
        const preloadCriticalResources = undefined;
        // Optimize images for better LCP
        const optimizeImages = undefined;
        // Optimize scroll performance
        const optimizeScroll = undefined;
        // Optimize animations for better performance
        const optimizeAnimations = undefined;
    }, [
        enabled
    ]);
    // This component doesn't render anything visible
    return null;
}
}),
"[project]/components/useABTest.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "useABTest": ()=>useABTest,
    "useLandingPageABTest": ()=>useLandingPageABTest
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <module evaluation>");
'use client';
;
;
;
// Lazy load variants for better performance
const ControlHero = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.r("[project]/components/variants/HeroVariants.tsx [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i).then((m)=>({
            default: m.ControlHero
        })));
const VariantAHero = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.r("[project]/components/variants/HeroVariants.tsx [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i).then((m)=>({
            default: m.VariantAHero
        })));
const VariantBHero = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.r("[project]/components/variants/HeroVariants.tsx [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i).then((m)=>({
            default: m.VariantBHero
        })));
const VariantCHero = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.r("[project]/components/variants/HeroVariants.tsx [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i).then((m)=>({
            default: m.VariantCHero
        })));
const ControlPricing = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.r("[project]/components/variants/PricingVariants.tsx [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i).then((m)=>({
            default: m.ControlPricing
        })));
const VariantAPricing = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.r("[project]/components/variants/PricingVariants.tsx [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i).then((m)=>({
            default: m.VariantAPricing
        })));
const VariantBPricing = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.r("[project]/components/variants/PricingVariants.tsx [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i).then((m)=>({
            default: m.VariantBPricing
        })));
const VariantCPricing = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.r("[project]/components/variants/PricingVariants.tsx [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i).then((m)=>({
            default: m.VariantCPricing
        })));
// Loading components
const HeroSkeleton = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-pulse",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-96 bg-gray-800 rounded-3xl"
        }, void 0, false, {
            fileName: "[project]/components/useABTest.tsx",
            lineNumber: 20,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/useABTest.tsx",
        lineNumber: 19,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const PricingSkeleton = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-pulse",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-64 bg-gray-800 rounded-3xl"
        }, void 0, false, {
            fileName: "[project]/components/useABTest.tsx",
            lineNumber: 26,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/useABTest.tsx",
        lineNumber: 25,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
function useABTest({ testId, userId, onVariantChange, t, handleEngagement }) {
    const [variantId, setVariantId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('control');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        testId,
        userId,
        onVariantChange
    ]);
    const trackEngagementEvent = (engagementType, metadata)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    };
    // Render functions for lazy-loaded components
    const renderHero = ()=>{
        if (isLoading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HeroSkeleton, {}, void 0, false, {
            fileName: "[project]/components/useABTest.tsx",
            lineNumber: 74,
            columnNumber: 27
        }, this);
        // Provide default functions if not provided
        const defaultT = (key, fallback)=>fallback || key;
        const defaultHandleEngagement = (event)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HeroSkeleton, {}, void 0, false, {
                fileName: "[project]/components/useABTest.tsx",
                lineNumber: 88,
                columnNumber: 27
            }, void 0),
            children: [
                variantId === 'control' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ControlHero, {
                    t: t || defaultT,
                    handleEngagement: handleEngagement || defaultHandleEngagement
                }, void 0, false, {
                    fileName: "[project]/components/useABTest.tsx",
                    lineNumber: 89,
                    columnNumber: 37
                }, this),
                variantId === 'variant_a' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VariantAHero, {
                    t: t || defaultT,
                    handleEngagement: handleEngagement || defaultHandleEngagement
                }, void 0, false, {
                    fileName: "[project]/components/useABTest.tsx",
                    lineNumber: 90,
                    columnNumber: 39
                }, this),
                variantId === 'variant_b' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VariantBHero, {
                    t: t || defaultT,
                    handleEngagement: handleEngagement || defaultHandleEngagement
                }, void 0, false, {
                    fileName: "[project]/components/useABTest.tsx",
                    lineNumber: 91,
                    columnNumber: 39
                }, this),
                variantId === 'variant_c' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VariantCHero, {
                    t: t || defaultT,
                    handleEngagement: handleEngagement || defaultHandleEngagement
                }, void 0, false, {
                    fileName: "[project]/components/useABTest.tsx",
                    lineNumber: 92,
                    columnNumber: 39
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/useABTest.tsx",
            lineNumber: 88,
            columnNumber: 7
        }, this);
    };
    const renderPricing = ()=>{
        if (isLoading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PricingSkeleton, {}, void 0, false, {
            fileName: "[project]/components/useABTest.tsx",
            lineNumber: 98,
            columnNumber: 27
        }, this);
        // Provide default functions if not provided
        const defaultT = (key, fallback)=>fallback || key;
        const defaultHandleEngagement = (event)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PricingSkeleton, {}, void 0, false, {
                fileName: "[project]/components/useABTest.tsx",
                lineNumber: 112,
                columnNumber: 27
            }, void 0),
            children: [
                variantId === 'control' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ControlPricing, {
                    t: t || defaultT,
                    handleEngagement: handleEngagement || defaultHandleEngagement
                }, void 0, false, {
                    fileName: "[project]/components/useABTest.tsx",
                    lineNumber: 113,
                    columnNumber: 37
                }, this),
                variantId === 'variant_a' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VariantAPricing, {
                    t: t || defaultT,
                    handleEngagement: handleEngagement || defaultHandleEngagement
                }, void 0, false, {
                    fileName: "[project]/components/useABTest.tsx",
                    lineNumber: 114,
                    columnNumber: 39
                }, this),
                variantId === 'variant_b' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VariantBPricing, {
                    t: t || defaultT,
                    handleEngagement: handleEngagement || defaultHandleEngagement
                }, void 0, false, {
                    fileName: "[project]/components/useABTest.tsx",
                    lineNumber: 115,
                    columnNumber: 39
                }, this),
                variantId === 'variant_c' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VariantCPricing, {
                    t: t || defaultT,
                    handleEngagement: handleEngagement || defaultHandleEngagement
                }, void 0, false, {
                    fileName: "[project]/components/useABTest.tsx",
                    lineNumber: 116,
                    columnNumber: 39
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/useABTest.tsx",
            lineNumber: 112,
            columnNumber: 7
        }, this);
    };
    return {
        variantId,
        isLoading,
        trackEngagement: trackEngagementEvent,
        renderHero,
        renderPricing,
        isControl: variantId === 'control',
        isVariantA: variantId === 'variant_a',
        isVariantB: variantId === 'variant_b',
        isVariantC: variantId === 'variant_c'
    };
}
function useLandingPageABTest(userId, t, handleEngagement) {
    return useABTest({
        testId: 'landing_page_variants',
        userId,
        t,
        handleEngagement,
        onVariantChange: (variantId)=>{
            // Track page view with variant context
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }
    });
}
}),
"[project]/components/LeadMagnetForm.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>LeadMagnetForm
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <locals>");
'use client';
;
;
;
function LeadMagnetForm({ onSuccess, onError }) {
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        email: '',
        preference: 'sample'
    });
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [isSuccess, setIsSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const validateForm = ()=>{
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            // Track the lead generation event
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('lead_generation', 'conversion', formData.preference, 1);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackConversion"])({
                type: 'signup_start',
                element: 'lead_magnet_form',
                page: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '/',
                timestamp: Date.now(),
                sessionId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getSessionId"])(),
                metadata: {
                    conversion_type: 'lead_magnet',
                    preference: formData.preference,
                    user_name: formData.name
                }
            });
            // Send email via API
            const response = await fetch('/api/send-sample-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send email');
            }
            // Success handling
            setIsSuccess(true);
            onSuccess?.(formData);
            // Reset form after success
            setTimeout(()=>{
                setFormData({
                    name: '',
                    email: '',
                    preference: 'sample'
                });
                setIsSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Lead magnet submission failed:', error);
            onError?.('Failed to submit. Please try again.');
        } finally{
            setIsSubmitting(false);
        }
    };
    const handleInputChange = (field, value)=>{
        setFormData((prev)=>({
                ...prev,
                [field]: value
            }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev)=>({
                    ...prev,
                    [field]: undefined
                }));
        }
    };
    if (isSuccess) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-6xl mb-4",
                    children: "🎉"
                }, void 0, false, {
                    fileName: "[project]/components/LeadMagnetForm.tsx",
                    lineNumber: 117,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                    className: "text-2xl font-bold text-[#29E7CD] mb-2",
                    children: "Check your email!"
                }, void 0, false, {
                    fileName: "[project]/components/LeadMagnetForm.tsx",
                    lineNumber: 118,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-300",
                    children: [
                        "We've sent you the sample dashboard.",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/components/LeadMagnetForm.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this),
                        "It should arrive in the next few minutes."
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/LeadMagnetForm.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/LeadMagnetForm.tsx",
            lineNumber: 116,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "name",
                        className: "block text-sm font-medium text-gray-300 mb-2",
                        children: "Your name *"
                    }, void 0, false, {
                        fileName: "[project]/components/LeadMagnetForm.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "name",
                        type: "text",
                        value: formData.name,
                        onChange: (e)=>handleInputChange('name', e.target.value),
                        placeholder: "Your name",
                        className: `w-full px-4 py-3 rounded-xl border bg-[#1f1f1f]/80 text-white placeholder-gray-400 focus:outline-none transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-[#29E7CD]'}`,
                        "aria-describedby": errors.name ? 'name-error' : undefined
                    }, void 0, false, {
                        fileName: "[project]/components/LeadMagnetForm.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this),
                    errors.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        id: "name-error",
                        className: "mt-1 text-sm text-red-400",
                        children: errors.name
                    }, void 0, false, {
                        fileName: "[project]/components/LeadMagnetForm.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/LeadMagnetForm.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "email",
                        className: "block text-sm font-medium text-gray-300 mb-2",
                        children: "Your email *"
                    }, void 0, false, {
                        fileName: "[project]/components/LeadMagnetForm.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "email",
                        type: "email",
                        value: formData.email,
                        onChange: (e)=>handleInputChange('email', e.target.value),
                        placeholder: "your@email.com",
                        className: `w-full px-4 py-3 rounded-xl border bg-[#1f1f1f]/80 text-white placeholder-gray-400 focus:outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-[#29E7CD]'}`,
                        "aria-describedby": errors.email ? 'email-error' : undefined
                    }, void 0, false, {
                        fileName: "[project]/components/LeadMagnetForm.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        id: "email-error",
                        className: "mt-1 text-sm text-red-400",
                        children: errors.email
                    }, void 0, false, {
                        fileName: "[project]/components/LeadMagnetForm.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/LeadMagnetForm.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium text-gray-300 mb-3",
                        children: "Get your sample dashboard"
                    }, void 0, false, {
                        fileName: "[project]/components/LeadMagnetForm.tsx",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 rounded-xl border border-gray-600 bg-[#1f1f1f]/80",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-4 h-4 rounded-full border-2 mr-3 border-[#29E7CD] bg-[#29E7CD]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 rounded-full bg-white m-0.5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/LeadMagnetForm.tsx",
                                        lineNumber: 187,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/LeadMagnetForm.tsx",
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-gray-300",
                                    children: "Sample Dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/components/LeadMagnetForm.tsx",
                                    lineNumber: 189,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/LeadMagnetForm.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/LeadMagnetForm.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/LeadMagnetForm.tsx",
                lineNumber: 180,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: isSubmitting,
                className: `w-full rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-[#29E7CD]/25'}`,
                children: isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex items-center justify-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    className: "opacity-25",
                                    cx: "12",
                                    cy: "12",
                                    r: "10",
                                    stroke: "currentColor",
                                    strokeWidth: "4"
                                }, void 0, false, {
                                    fileName: "[project]/components/LeadMagnetForm.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    className: "opacity-75",
                                    fill: "currentColor",
                                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                }, void 0, false, {
                                    fileName: "[project]/components/LeadMagnetForm.tsx",
                                    lineNumber: 207,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/LeadMagnetForm.tsx",
                            lineNumber: 205,
                            columnNumber: 13
                        }, this),
                        "Sending..."
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/LeadMagnetForm.tsx",
                    lineNumber: 204,
                    columnNumber: 11
                }, this) : 'Send me the sample dashboard'
            }, void 0, false, {
                fileName: "[project]/components/LeadMagnetForm.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-400 text-center",
                children: [
                    "No spam. No lock-in. Your data stays private.",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/components/LeadMagnetForm.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this),
                    "We'll only email you about PrepFlow updates."
                ]
            }, void 0, true, {
                fileName: "[project]/components/LeadMagnetForm.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/LeadMagnetForm.tsx",
        lineNumber: 131,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/translations/en-AU.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// English (Australia) translations
__turbopack_context__.s({
    "translations": ()=>translations
});
const translations = {
    // Navigation
    nav: {
        dashboard: 'Dashboard',
        ingredients: 'Ingredients',
        recipes: 'Recipe Book',
        cogs: 'COGS',
        setup: 'Setup',
        backToLanding: 'Back to Landing',
        features: 'Features',
        howItWorks: 'How it works',
        pricing: 'Pricing',
        faq: 'FAQ',
        ariaLabel: 'Main navigation',
        featuresAria: 'View PrepFlow features',
        howItWorksAria: 'Learn how PrepFlow works',
        pricingAria: 'View PrepFlow pricing',
        faqAria: 'Frequently asked questions'
    },
    // WebApp Dashboard
    dashboard: {
        title: 'Kitchen Management Dashboard',
        subtitle: 'Welcome back! Here\'s your kitchen overview',
        totalIngredients: 'Total Ingredients',
        totalRecipes: 'Total Recipes',
        menuDishes: 'Menu Dishes',
        avgDishPrice: 'Avg Dish Price',
        quickActions: 'Quick Actions',
        quickActionsSubtitle: 'Jump into your most used features',
        live: 'Live',
        manageIngredients: 'Manage Ingredients',
        manageIngredientsDesc: 'Add, edit, and organize',
        manageIngredientsSubtitle: 'Build your kitchen inventory with detailed ingredient tracking',
        recipeBook: 'Recipe Book',
        recipeBookDesc: 'View saved recipes',
        recipeBookSubtitle: 'Access your saved recipes from COGS calculations',
        calculateCOGS: 'Calculate COGS',
        calculateCOGSDesc: 'Analyze costs & margins',
        calculateCOGSSubtitle: 'Calculate Cost of Goods Sold and profit margins',
        gettingStarted: 'Getting Started with PrepFlow',
        gettingStartedDesc: 'Welcome to your kitchen management hub! Start by adding your ingredients to build your inventory, then create recipes to calculate your Cost of Goods Sold (COGS) and optimize your profit margins.',
        realTimeAnalytics: 'Real-time Analytics',
        profitOptimization: 'Profit Optimization',
        smartInsights: 'Smart Insights'
    },
    // WebApp Ingredients
    ingredients: {
        title: 'Ingredients Management',
        subtitle: 'Manage your kitchen ingredients and inventory',
        displayCostsIn: 'Display costs in',
        addIngredient: 'Add Ingredient',
        cancel: 'Cancel',
        importCSV: 'Import CSV',
        exportCSV: 'Export CSV',
        search: 'Search',
        searchPlaceholder: 'Search ingredients...',
        supplier: 'Supplier',
        allSuppliers: 'All Suppliers',
        storage: 'Storage',
        allLocations: 'All Locations',
        sortBy: 'Sort By',
        name: 'Name',
        costLowToHigh: 'Cost (Low to High)',
        costHighToLow: 'Cost (High to Low)',
        supplierName: 'Supplier',
        ingredients: 'Ingredients',
        liveData: 'Live Data',
        noIngredientsFound: 'No ingredients found',
        noIngredientsDesc: 'Add your first ingredient to start building your kitchen inventory',
        noIngredientsFilterDesc: 'Try adjusting your search filters to find what you\'re looking for',
        addFirstIngredient: 'Add Your First Ingredient',
        ingredient: 'Ingredient',
        packSize: 'Pack Size',
        unit: 'Unit',
        cost: 'Cost',
        wastePercent: 'Waste %',
        yieldPercent: 'Yield %',
        actions: 'Actions',
        editIngredient: 'Edit ingredient',
        deleteIngredient: 'Delete ingredient',
        editIngredientTitle: 'Edit Ingredient',
        ingredientName: 'Ingredient Name',
        brand: 'Brand',
        unitRequired: 'Unit *',
        selectUnit: 'Select Unit',
        costPerUnit: 'Cost Per Unit ($)',
        trimWastePercent: 'Trim/Waste Percentage (%)',
        storageLocation: 'Storage Location',
        productCode: 'Product Code',
        minStockLevel: 'Min Stock Level',
        updateIngredient: 'Update Ingredient',
        // Add Ingredient Wizard
        addNewIngredient: 'Add New Ingredient',
        guidedSetup: 'Guided Setup',
        basicInformation: 'Basic Information',
        basicInformationDesc: 'Let\'s start with the essential details',
        packagingInformation: 'Packaging Information',
        packSizeRequired: 'Pack Size *',
        packUnitRequired: 'Pack Unit *',
        individualUnitRequired: 'Individual Unit *',
        packPriceRequired: 'Pack Price ($) *',
        selectPackUnit: 'Select pack unit',
        selectIndividualUnit: 'Select individual unit',
        grams: 'Grams (g)',
        kilograms: 'Kilograms (kg)',
        milliliters: 'Milliliters (ml)',
        liters: 'Liters (L)',
        pieces: 'Pieces',
        box: 'Box',
        pack: 'Pack',
        bag: 'Bag',
        bottle: 'Bottle',
        can: 'Can',
        packPriceHelper: 'Enter the total pack price (e.g., $13.54 for a 5L tub of yogurt). The system will automatically calculate the price per unit.',
        pricePerUnit: 'Price per {unit}: ${cost}',
        nextStep: 'Next Step →',
        advancedSettings: 'Advanced Settings',
        advancedSettingsDesc: 'Configure wastage, yield, and supplier information',
        wastageYieldManagement: 'Wastage & Yield Management',
        trimWastePercentage: 'Trim/Waste Percentage',
        yieldPercentage: 'Yield Percentage',
        aiSuggests: 'AI suggests: {percentage}% based on "{name}"',
        supplierInformation: 'Supplier Information',
        selectSupplier: 'Select supplier',
        addNewSupplier: '+ Add new supplier',
        enterNewSupplier: 'Enter new supplier name',
        add: 'Add',
        additionalInformation: 'Additional Information',
        productCodeOptional: 'Product Code (Optional)',
        previousStep: '← Previous Step',
        reviewSave: 'Review & Save',
        reviewSaveDesc: 'Review your ingredient details before saving',
        ingredientSummary: 'Ingredient Summary',
        additionalDetails: 'Additional Details',
        startOver: 'Start Over',
        saveIngredient: 'Save Ingredient',
        // CSV Import
        importFromCSV: 'Import Ingredients from CSV',
        previewFound: 'Preview ({count} ingredients found)',
        selectAll: 'Select All',
        clearAll: 'Clear All',
        importing: 'Importing...',
        importSelected: 'Import Selected ({count})',
        // Units
        weight: 'Weight',
        volume: 'Volume',
        teaspoons: 'Teaspoons (tsp)',
        tablespoons: 'Tablespoons (tbsp)',
        cups: 'Cups'
    },
    // Hero Section
    hero: {
        title: 'Stop Guessing Your Menu\'s Profit',
        subtitle: 'See exactly which dishes make money and which eat your profit. Built from 20 years of real kitchen experience.',
        ctaPrimary: 'Get PrepFlow Now - $29 AUD',
        ctaSecondary: 'Get Free Sample',
        dashboardAlt: 'PrepFlow Dashboard showing COGS analysis and profit insights',
        disclaimer: 'Works for cafés, food trucks, small restaurants. No lock-in. 7-day refund policy. Results may vary based on your current menu and operations.',
        // A/B Test Variants
        variantA: {
            title: 'Stop losing money on your menu.',
            subtitle: 'Most restaurants don\'t know which dishes are profitable. PrepFlow shows you exactly where your money is going — and how to fix it.',
            bullet1: {
                title: 'Stop the Bleeding',
                description: 'identify which menu items are costing you money'
            },
            bullet2: {
                title: 'Real Cost Analysis',
                description: 'see true ingredient costs including waste and yields'
            },
            bullet3: {
                title: 'Profit Optimization',
                description: 'know which dishes to promote, fix, or remove'
            },
            bullet4: {
                title: 'GST Compliance',
                description: 'price correctly for Australian tax requirements'
            },
            bullet5: {
                title: 'Smart Menu Decisions',
                description: 'data-driven choices about your menu mix'
            },
            bullet6: {
                title: 'AI Kitchen Insights',
                description: 'discover new methods to improve margins'
            },
            ctaPrimary: 'Get Sample Dashboard',
            ctaSecondary: 'Get Free Sample',
            disclaimer: 'Built for Australian cafés and restaurants. No lock-in. 7-day refund policy.'
        },
        variantB: {
            title: 'Turn your menu into a profit machine.',
            subtitle: 'Transform guesswork into data-driven decisions. PrepFlow gives you the insights to maximize every dollar on your menu.',
            bullet1: {
                title: 'Profit Maximization',
                description: 'identify your highest-margin opportunities'
            },
            bullet2: {
                title: 'Cost Transparency',
                description: 'see exactly what each dish costs to make'
            },
            bullet3: {
                title: 'Menu Optimization',
                description: 'know which items to feature or remove'
            },
            bullet4: {
                title: 'Tax Compliance',
                description: 'GST-ready pricing for Australian businesses'
            },
            bullet5: {
                title: 'Performance Tracking',
                description: 'monitor which dishes drive your profit'
            },
            bullet6: {
                title: 'AI Optimization',
                description: 'get suggestions to improve your margins'
            },
            ctaPrimary: 'Get Sample Dashboard',
            ctaSecondary: 'Try Sample Sheet',
            disclaimer: 'Designed for Australian hospitality. Simple setup. 7-day refund guarantee.'
        },
        variantC: {
            title: 'Know your menu costs. Make more profit.',
            subtitle: 'PrepFlow shows you exactly what each dish costs and how much profit it makes. Simple Google Sheet. Real results.',
            bullet1: {
                title: 'Cost Breakdown',
                description: 'see exactly what each dish costs to make'
            },
            bullet2: {
                title: 'Profit Calculation',
                description: 'know your margin on every item'
            },
            bullet3: {
                title: 'Menu Decisions',
                description: 'decide what to keep, change, or remove'
            },
            bullet4: {
                title: 'GST Ready',
                description: 'Australian tax compliance built-in'
            },
            bullet5: {
                title: 'Easy Setup',
                description: 'works in Google Sheets, no new software'
            },
            bullet6: {
                title: 'Smart Insights',
                description: 'AI suggestions to improve your margins'
            },
            ctaPrimary: 'Get Sample Dashboard',
            ctaSecondary: 'Free Sample',
            disclaimer: 'For Australian cafés and restaurants. 7-day refund policy.'
        }
    },
    // Pricing
    pricing: {
        title: 'Simple, Honest Pricing',
        subtitle: 'One-time purchase. Lifetime access. No subscriptions, no hidden fees.',
        price: '$29',
        currency: 'AUD',
        guarantee: '7-day money-back guarantee',
        features: {
            completeTemplate: 'Complete Google Sheets template',
            preloadedIngredients: '300+ pre-loaded ingredients',
            multiCurrency: 'Multi-currency support',
            gstVat: 'GST/VAT calculations',
            lifetimeUpdates: 'Lifetime updates',
            moneyBack: '7-day money-back guarantee'
        },
        cta: 'Get PrepFlow Now',
        instantAccess: 'Instant access via Gumroad'
    },
    // Features
    features: {
        stockList: {
            title: 'Stock List (infinite)',
            description: 'Centralise ingredients with pack size, unit, supplier, storage, product code. Capture trim/waste and yields to get true cost per unit.'
        },
        cogsRecipes: {
            title: 'COGS Recipes',
            description: 'Build recipes that auto‑pull ingredient costs (incl. yield/trim). See dish cost, COGS%, GP$ and GP% instantly.'
        },
        itemPerformance: {
            title: 'Item Performance',
            description: 'Paste sales. We calculate popularity, profit margin, total profit ex‑GST and classify items as Chef\'s Kiss, Hidden Gem or Bargain Bucket.'
        },
        dashboardKpis: {
            title: 'Dashboard KPIs',
            description: 'At a glance: average GP%, food cost %, average item profit and sale price, plus top performers by popularity and margin.'
        },
        globalTax: {
            title: 'Global Tax & Currency',
            description: 'Set country, tax system (GST/VAT/Sales Tax), and currency in Settings. All outputs adapt to your local market requirements.'
        },
        fastOnboarding: {
            title: 'Fast Onboarding',
            description: 'Start tab with step‑by‑step guidance. Pre‑loaded sample data and comprehensive resources to learn the flow in minutes.'
        },
        aiMethodGenerator: {
            title: 'AI Method Generator',
            description: 'Discover new cooking methods that could improve your margins and reduce waste. Get AI-powered suggestions for optimizing your kitchen processes.'
        }
    },
    // Landing Page Sections
    problemOutcome: {
        problem: {
            title: 'The Problem',
            points: [
                'You don\'t know which menu items actually make money',
                'COGS creep and waste eat your profit',
                'Pricing is guesswork; GST adds friction',
                'Reports are slow, complicated, or sit in someone else\'s tool'
            ]
        },
        outcome: {
            title: 'The Outcome',
            points: [
                'See item-level margins and profit instantly',
                'Spot "winners" and "profit leaks" at a glance',
                'Adjust pricing with confidence (GST-aware)',
                'Run everything in Google Sheets — no new software to learn'
            ]
        }
    },
    contributingMargin: {
        title: 'Contributing Margin — The Real Profit Story',
        subtitle: 'See beyond gross profit to understand what each dish truly contributes to your business',
        grossProfit: {
            title: 'Gross Profit',
            description: 'What you think you\'re making'
        },
        contributingMargin: {
            title: 'Contributing Margin',
            description: 'What you\'re actually contributing'
        },
        actionPlan: {
            title: 'Action Plan',
            description: 'What to do about it'
        },
        explanation: 'PrepFlow helps you see: That $15 burger might have a 60% GP, but after prep time, waste, and complexity, it might only be contributing $2.50 to your bottom line. Meanwhile, that simple $8 side dish might be contributing $4.00.',
        disclaimer: '*Example for illustration - actual results depend on your specific menu and costs'
    },
    journey: {
        title: 'My Journey Creating PrepFlow',
        subtitle: 'This isn\'t just another tool - it\'s my personal solution to real kitchen problems, refined over 20 years of working in restaurants across Europe and Australia.',
        earlyExperience: {
            title: '2008-2012 - Early Experience',
            description: 'Started as Sous Chef at Krautwells GmbH, managing vegan cuisine and training junior chefs'
        },
        europeanLeadership: {
            title: '2012-2018 - European Leadership',
            description: 'Founded KSK-Küchenspezialkräfte vegan catering, managed teams of 21 staff, served 1,200+ daily'
        },
        australianExcellence: {
            title: '2018-2024 - Australian Excellence',
            description: 'Executive Chef roles, Head Chef at ALH Hotels, leading teams of 9 chefs with AI integration'
        },
        readyToShare: {
            title: '2024 - Ready to Share',
            description: 'Now sharing the perfected tool with fellow chefs and restaurateurs who face the same challenges I did'
        },
        whyCreated: {
            title: 'Why I Created PrepFlow',
            paragraphs: [
                'Over 20 years as a chef, I\'ve managed everything from small cafés to large-scale catering operations serving 1,200+ guests daily. I\'ve faced the same challenges you do: menu costing, waste management, profitability analysis, and team efficiency.',
                'As Head Chef at ALH Hotels, I was constantly looking for better ways to manage costs, streamline prep systems, and optimize our menu mix. Existing solutions were either too complex, too expensive, or didn\'t understand real kitchen operations.',
                'So I built my own solution - a simple Google Sheets template that could handle COGS calculations, track ingredient costs, and show me exactly which menu items were profitable and which were losing money.',
                'Having worked across Europe and Australia, I\'ve refined it to work perfectly for venues worldwide - with GST support for Australian markets, multi-currency options, and the flexibility to adapt to any kitchen\'s needs. It\'s the tool I wish I had when I started, and now I\'m sharing it with you.'
            ]
        }
    },
    globalFeatures: {
        title: 'Expose Hidden Profits — One Sheet, Every Answer',
        subtitle: 'While others charge thousands for complicated restaurant software, PrepFlow provides similar profit insights in a simple Google Sheet for a one-time purchase.',
        multiCurrency: {
            title: 'Multi-Currency',
            description: 'USD, EUR, GBP, AUD, SGD, and more. Switch currencies instantly.'
        },
        taxSystems: {
            title: 'Tax Systems',
            description: 'GST, VAT, Sales Tax, HST. Configure for your local requirements.'
        },
        access24_7: {
            title: '24/7 Access',
            description: 'Cloud-based Google Sheets. Access from anywhere, anytime.'
        },
        noConsultants: {
            title: 'No Consultants',
            description: 'Set up yourself in under an hour. No expensive implementation fees.'
        },
        conclusion: 'One sheet. Key insights your kitchen needs. Identify profit opportunities in your menu with insights similar to expensive software — but in a simple Google Sheet you can set up yourself.'
    },
    howItWorks: {
        title: 'Get Results in 3 Simple Steps',
        step1: {
            title: 'Set up (5–10 min)',
            description: 'Turn on GST, add ingredients, yields, and supplier costs.'
        },
        step2: {
            title: 'Import sales',
            description: 'Paste your POS export into the Sales tab.'
        },
        step3: {
            title: 'Decide & act',
            description: 'Dashboard ranks items by profit and popularity; fix pricing, portioning, or menu mix.'
        },
        checklist: {
            title: '60-Second Checklist',
            items: [
                'GST toggle set?',
                'Ingredient yields/waste entered?',
                'Sales pasted?',
                'Review top 5 low-margin items?',
                'Re-check dashboard tomorrow'
            ]
        }
    },
    leadMagnet: {
        title: 'See PrepFlow before you buy',
        subtitle: 'Get a sample dashboard — we\'ll email it to you.',
        form: {
            nameLabel: 'Your name *',
            namePlaceholder: 'Your name',
            emailLabel: 'Your email *',
            emailPlaceholder: 'your@email.com',
            sampleLabel: 'Get your sample dashboard',
            sampleDescription: 'Sample Dashboard',
            submitButton: 'Send me the sample dashboard',
            disclaimer: 'No spam. No lock-in. Your data stays private.\nWe\'ll only email you about PrepFlow updates.'
        }
    },
    howItWorksPractice: {
        title: 'How PrepFlow Works in Practice',
        subtitle: 'From guesswork to data-driven clarity - here\'s what you can expect',
        before: {
            title: 'Before PrepFlow',
            status: 'Unclear margins',
            description: 'Blind pricing, gut feeling, unclear margins everywhere'
        },
        after: {
            title: 'After PrepFlow',
            status: 'Clear insights',
            description: 'Data-driven decisions, margin insights revealed, clarity achieved'
        },
        explanation: 'PrepFlow helps you identify where your menu has profit potential and where costs might be eating into your margins',
        disclaimer: '*Results depend on your current menu structure and how you implement the insights'
    },
    benefits: {
        title: 'What PrepFlow Helps You Achieve',
        betterPricing: {
            title: 'Better Pricing Decisions',
            description: 'See exactly how ingredient costs, yields, and waste affect your margins. Make informed pricing decisions instead of guessing.'
        },
        identifyOpportunities: {
            title: 'Identify Profit Opportunities',
            description: 'Spot which menu items are underperforming and which have hidden potential. Focus your efforts where they\'ll have the biggest impact.'
        },
        streamlineOperations: {
            title: 'Streamline Operations',
            description: 'Understand your true costs and optimize your menu mix. Reduce waste, improve efficiency, and increase your bottom line.'
        },
        cta: {
            text: 'See PrepFlow in action',
            button: 'Get Sample'
        }
    },
    faq: {
        title: 'FAQ',
        questions: [
            {
                question: 'Do I need tech skills?',
                answer: 'Zero spreadsheet formulas required. If you can use Google Sheets, you\'re good.'
            },
            {
                question: 'Does it work worldwide?',
                answer: 'Built for global venues — includes GST, VAT, Sales Tax toggles, multi-currency support, and export-ready reports for any market.'
            },
            {
                question: 'What if it doesn\'t work for me?',
                answer: 'If you\'re not satisfied with the insights and clarity PrepFlow provides in 7 days, you\'ll get every cent back. No hassle.'
            },
            {
                question: 'Will this slow me down?',
                answer: 'Setup typically takes 1-2 hours. After that, you\'ll save time on menu planning and cost analysis.'
            }
        ]
    },
    builtFor: {
        title: 'Built for Independent Venues & Small Kitchens',
        features: [
            'Works with Google Sheets',
            '7-Day Refund Policy',
            'Made for AU Market'
        ]
    },
    trustBar: {
        text: 'Stop guessing. Start knowing. PrepFlow isn\'t just a spreadsheet — it\'s the X-ray machine for your menu\'s profitability.'
    },
    // Common
    common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        actions: 'Actions',
        name: 'Name',
        description: 'Description',
        price: 'Price',
        cost: 'Cost',
        quantity: 'Quantity',
        unit: 'Unit',
        total: 'Total',
        subtotal: 'Subtotal',
        tax: 'Tax',
        gst: 'GST',
        profit: 'Profit',
        margin: 'Margin',
        percentage: 'Percentage',
        currency: 'Currency',
        date: 'Date',
        time: 'Time',
        created: 'Created',
        updated: 'Updated',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        completed: 'Completed',
        failed: 'Failed',
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        finish: 'Finish',
        continue: 'Continue',
        skip: 'Skip',
        retry: 'Retry',
        refresh: 'Refresh',
        reset: 'Reset',
        clear: 'Clear',
        select: 'Select',
        selectAll: 'Select All',
        deselectAll: 'Deselect All',
        export: 'Export',
        import: 'Import',
        download: 'Download',
        upload: 'Upload',
        print: 'Print',
        share: 'Share',
        copy: 'Copy',
        paste: 'Paste',
        cut: 'Cut',
        undo: 'Undo',
        redo: 'Redo',
        help: 'Help',
        about: 'About',
        settings: 'Settings',
        preferences: 'Preferences',
        profile: 'Profile',
        account: 'Account',
        logout: 'Logout',
        login: 'Login',
        register: 'Register',
        signup: 'Sign Up',
        signin: 'Sign In',
        forgotPassword: 'Forgot Password?',
        rememberMe: 'Remember Me',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        cookies: 'Cookie Policy',
        contact: 'Contact',
        support: 'Support',
        faq: 'FAQ',
        documentation: 'Documentation',
        tutorial: 'Tutorial',
        guide: 'Guide',
        tips: 'Tips',
        tricks: 'Tricks',
        bestPractices: 'Best Practices',
        examples: 'Examples',
        samples: 'Samples',
        templates: 'Templates',
        themes: 'Themes',
        languages: 'Languages',
        regions: 'Regions',
        timezones: 'Timezones',
        currencies: 'Currencies',
        units: 'Units',
        measurements: 'Measurements',
        formats: 'Formats',
        styles: 'Styles',
        colors: 'Colors',
        fonts: 'Fonts',
        sizes: 'Sizes',
        weights: 'Weights',
        alignments: 'Alignments',
        spacings: 'Spacings',
        margins: 'Margins',
        paddings: 'Paddings',
        borders: 'Borders',
        radiuses: 'Radiuses',
        shadows: 'Shadows',
        gradients: 'Gradients',
        animations: 'Animations',
        transitions: 'Transitions',
        effects: 'Effects',
        filters: 'Filters',
        blurs: 'Blurs',
        opacities: 'Opacities',
        rotations: 'Rotations',
        scales: 'Scales',
        translations: 'Translations',
        positions: 'Positions',
        dimensions: 'Dimensions',
        widths: 'Widths',
        heights: 'Heights',
        depths: 'Depths',
        layers: 'Layers',
        levels: 'Levels',
        orders: 'Orders',
        priorities: 'Priorities',
        importances: 'Importances',
        urgencies: 'Urgencies',
        categories: 'Categories',
        types: 'Types',
        kinds: 'Kinds',
        sorts: 'Sorts',
        varieties: 'Varieties',
        versions: 'Versions',
        editions: 'Editions',
        releases: 'Releases',
        builds: 'Builds',
        patches: 'Patches',
        updates: 'Updates',
        upgrades: 'Upgrades',
        downgrades: 'Downgrades',
        migrations: 'Migrations',
        conversions: 'Conversions',
        transformations: 'Transformations',
        modifications: 'Modifications',
        alterations: 'Alterations',
        changes: 'Changes',
        adjustments: 'Adjustments',
        corrections: 'Corrections',
        fixes: 'Fixes',
        improvements: 'Improvements',
        enhancements: 'Enhancements',
        optimizations: 'Optimizations',
        performance: 'Performance',
        speed: 'Speed',
        efficiency: 'Efficiency',
        productivity: 'Productivity',
        quality: 'Quality',
        reliability: 'Reliability',
        stability: 'Stability',
        security: 'Security',
        safety: 'Safety',
        confidentiality: 'Confidentiality',
        anonymity: 'Anonymity',
        encryption: 'Encryption',
        authentication: 'Authentication',
        authorization: 'Authorization',
        permissions: 'Permissions',
        access: 'Access',
        control: 'Control',
        management: 'Management',
        administration: 'Administration',
        governance: 'Governance',
        oversight: 'Oversight',
        supervision: 'Supervision',
        monitoring: 'Monitoring',
        tracking: 'Tracking',
        logging: 'Logging',
        auditing: 'Auditing',
        reporting: 'Reporting',
        analytics: 'Analytics',
        metrics: 'Metrics',
        statistics: 'Statistics',
        data: 'Data',
        information: 'Information',
        knowledge: 'Knowledge',
        wisdom: 'Wisdom',
        insights: 'Insights',
        intelligence: 'Intelligence',
        smart: 'Smart',
        intelligent: 'Intelligent',
        clever: 'Clever',
        bright: 'Bright',
        brilliant: 'Brilliant',
        genius: 'Genius',
        expert: 'Expert',
        professional: 'Professional',
        specialist: 'Specialist',
        consultant: 'Consultant',
        advisor: 'Advisor',
        mentor: 'Mentor',
        coach: 'Coach',
        trainer: 'Trainer',
        teacher: 'Teacher',
        instructor: 'Instructor',
        educator: 'Educator',
        leader: 'Leader',
        manager: 'Manager',
        director: 'Director',
        executive: 'Executive',
        administrator: 'Administrator',
        supervisor: 'Supervisor',
        coordinator: 'Coordinator',
        facilitator: 'Facilitator',
        organizer: 'Organizer',
        planner: 'Planner',
        strategist: 'Strategist',
        analyst: 'Analyst',
        researcher: 'Researcher',
        investigator: 'Investigator',
        explorer: 'Explorer',
        discoverer: 'Discoverer',
        innovator: 'Innovator',
        creator: 'Creator',
        builder: 'Builder',
        developer: 'Developer',
        designer: 'Designer',
        architect: 'Architect',
        engineer: 'Engineer',
        technician: 'Technician',
        master: 'Master',
        guru: 'Guru',
        wizard: 'Wizard',
        magician: 'Magician',
        artist: 'Artist',
        craftsman: 'Craftsman',
        artisan: 'Artisan',
        skilled: 'Skilled',
        talented: 'Talented',
        gifted: 'Gifted',
        able: 'Able',
        capable: 'Capable',
        competent: 'Competent',
        proficient: 'Proficient',
        experienced: 'Experienced',
        qualified: 'Qualified',
        certified: 'Certified',
        licensed: 'Licensed',
        accredited: 'Accredited',
        approved: 'Approved',
        validated: 'Validated',
        verified: 'Verified',
        confirmed: 'Confirmed',
        authenticated: 'Authenticated',
        authorized: 'Authorized',
        permitted: 'Permitted',
        allowed: 'Allowed',
        enabled: 'Enabled',
        activated: 'Activated',
        working: 'Working',
        functional: 'Functional',
        operational: 'Operational',
        running: 'Running',
        operating: 'Operating',
        functioning: 'Functioning'
    },
    // Floating CTA Banner
    floatingCta: {
        mainButton: 'Get PrepFlow',
        price: 'AUD $29',
        sampleButton: 'Free Sample'
    },
    // Footer
    footer: {
        copyright: `© ${new Date().getFullYear()} PrepFlow. All rights reserved.`,
        terms: 'Terms',
        privacy: 'Privacy',
        support: 'Support'
    },
    // Logo
    logo: {
        alt: 'PrepFlow Logo'
    }
};
}),
"[project]/lib/translations/de-DE.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// German (Germany) translations
__turbopack_context__.s({
    "translations": ()=>translations
});
const translations = {
    // Navigation
    nav: {
        dashboard: 'Dashboard',
        ingredients: 'Zutaten',
        recipes: 'Rezeptbuch',
        cogs: 'COGS',
        setup: 'Setup',
        backToLanding: 'Zurück zur Startseite',
        features: 'Funktionen',
        howItWorks: 'So funktioniert es',
        pricing: 'Preise',
        faq: 'FAQ',
        ariaLabel: 'Hauptnavigation',
        featuresAria: 'PrepFlow-Funktionen anzeigen',
        howItWorksAria: 'Erfahren Sie, wie PrepFlow funktioniert',
        pricingAria: 'PrepFlow-Preise anzeigen',
        faqAria: 'Häufig gestellte Fragen'
    },
    // WebApp Dashboard
    dashboard: {
        title: 'Küchen-Management Dashboard',
        subtitle: 'Willkommen zurück! Hier ist Ihr Küchen-Überblick',
        totalIngredients: 'Zutaten gesamt',
        totalRecipes: 'Rezepte gesamt',
        menuDishes: 'Menügerichte',
        avgDishPrice: 'Ø Gerichtspreis',
        quickActions: 'Schnellaktionen',
        quickActionsSubtitle: 'Springen Sie zu Ihren am häufigsten verwendeten Funktionen',
        live: 'Live',
        manageIngredients: 'Zutaten verwalten',
        manageIngredientsDesc: 'Hinzufügen, bearbeiten und organisieren',
        manageIngredientsSubtitle: 'Erstellen Sie Ihr Kücheninventar mit detaillierter Zutatenverfolgung',
        recipeBook: 'Rezeptbuch',
        recipeBookDesc: 'Gespeicherte Rezepte anzeigen',
        recipeBookSubtitle: 'Zugriff auf Ihre gespeicherten Rezepte aus COGS-Berechnungen',
        calculateCOGS: 'COGS berechnen',
        calculateCOGSDesc: 'Kosten & Margen analysieren',
        calculateCOGSSubtitle: 'Berechnen Sie die Kosten der verkauften Waren und Gewinnmargen',
        gettingStarted: 'Erste Schritte mit PrepFlow',
        gettingStartedDesc: 'Willkommen in Ihrem Küchenmanagement-Hub! Beginnen Sie mit dem Hinzufügen Ihrer Zutaten, um Ihr Inventar aufzubauen, und erstellen Sie dann Rezepte, um Ihre Kosten der verkauften Waren (COGS) zu berechnen und Ihre Gewinnmargen zu optimieren.',
        realTimeAnalytics: 'Echtzeit-Analysen',
        profitOptimization: 'Gewinnoptimierung',
        smartInsights: 'Intelligente Einblicke'
    },
    // WebApp Ingredients
    ingredients: {
        title: 'Zutatenverwaltung',
        subtitle: 'Verwalten Sie Ihre Küchenzutaten und Ihr Inventar',
        displayCostsIn: 'Kosten anzeigen in',
        addIngredient: 'Zutat hinzufügen',
        cancel: 'Abbrechen',
        importCSV: 'CSV importieren',
        exportCSV: 'CSV exportieren',
        search: 'Suchen',
        searchPlaceholder: 'Zutaten suchen...',
        supplier: 'Lieferant',
        allSuppliers: 'Alle Lieferanten',
        storage: 'Lagerung',
        allLocations: 'Alle Standorte',
        sortBy: 'Sortieren nach',
        name: 'Name',
        costLowToHigh: 'Kosten (niedrig zu hoch)',
        costHighToLow: 'Kosten (hoch zu niedrig)',
        supplierName: 'Lieferant',
        ingredients: 'Zutaten',
        liveData: 'Live-Daten',
        noIngredientsFound: 'Keine Zutaten gefunden',
        noIngredientsDesc: 'Fügen Sie Ihre erste Zutat hinzu, um Ihr Kücheninventar aufzubauen',
        noIngredientsFilterDesc: 'Versuchen Sie, Ihre Suchfilter anzupassen, um zu finden, wonach Sie suchen',
        addFirstIngredient: 'Ihre erste Zutat hinzufügen',
        ingredient: 'Zutat',
        packSize: 'Packungsgröße',
        unit: 'Einheit',
        cost: 'Kosten',
        wastePercent: 'Abfall %',
        yieldPercent: 'Ausbeute %',
        actions: 'Aktionen',
        editIngredient: 'Zutat bearbeiten',
        deleteIngredient: 'Zutat löschen',
        editIngredientTitle: 'Zutat bearbeiten',
        ingredientName: 'Zutatenname',
        brand: 'Marke',
        unitRequired: 'Einheit *',
        selectUnit: 'Einheit auswählen',
        costPerUnit: 'Kosten pro Einheit (€)',
        trimWastePercent: 'Zuschnitt/Abfall-Prozentsatz (%)',
        storageLocation: 'Lagerort',
        productCode: 'Produktcode',
        minStockLevel: 'Mindestbestand',
        updateIngredient: 'Zutat aktualisieren',
        // Add Ingredient Wizard
        addNewIngredient: 'Neue Zutat hinzufügen',
        guidedSetup: 'Geführtes Setup',
        basicInformation: 'Grundinformationen',
        basicInformationDesc: 'Beginnen wir mit den wesentlichen Details',
        packagingInformation: 'Verpackungsinformationen',
        packSizeRequired: 'Packungsgröße *',
        packUnitRequired: 'Packungseinheit *',
        individualUnitRequired: 'Einzelne Einheit *',
        packPriceRequired: 'Packungspreis (€) *',
        selectPackUnit: 'Packungseinheit auswählen',
        selectIndividualUnit: 'Einzelne Einheit auswählen',
        grams: 'Gramm (g)',
        kilograms: 'Kilogramm (kg)',
        milliliters: 'Milliliter (ml)',
        liters: 'Liter (L)',
        pieces: 'Stück',
        box: 'Karton',
        pack: 'Packung',
        bag: 'Beutel',
        bottle: 'Flasche',
        can: 'Dose',
        packPriceHelper: 'Geben Sie den Gesamtpackungspreis ein (z.B. 13,54€ für einen 5L Joghurt-Behälter). Das System berechnet automatisch den Preis pro Einheit.',
        pricePerUnit: 'Preis pro {unit}: {cost}€',
        nextStep: 'Nächster Schritt →',
        advancedSettings: 'Erweiterte Einstellungen',
        advancedSettingsDesc: 'Konfigurieren Sie Abfall, Ausbeute und Lieferanteninformationen',
        wastageYieldManagement: 'Abfall- & Ausbeuteverwaltung',
        trimWastePercentage: 'Zuschnitt/Abfall-Prozentsatz',
        yieldPercentage: 'Ausbeute-Prozentsatz',
        aiSuggests: 'KI schlägt vor: {percentage}% basierend auf "{name}"',
        supplierInformation: 'Lieferanteninformationen',
        selectSupplier: 'Lieferant auswählen',
        addNewSupplier: '+ Neuen Lieferanten hinzufügen',
        enterNewSupplier: 'Neuen Lieferantennamen eingeben',
        add: 'Hinzufügen',
        additionalInformation: 'Zusätzliche Informationen',
        productCodeOptional: 'Produktcode (Optional)',
        previousStep: '← Vorheriger Schritt',
        reviewSave: 'Überprüfen & Speichern',
        reviewSaveDesc: 'Überprüfen Sie Ihre Zutatenangaben vor dem Speichern',
        ingredientSummary: 'Zutatenzusammenfassung',
        additionalDetails: 'Zusätzliche Details',
        startOver: 'Neu beginnen',
        saveIngredient: 'Zutat speichern',
        // CSV Import
        importFromCSV: 'Zutaten aus CSV importieren',
        previewFound: 'Vorschau ({count} Zutaten gefunden)',
        selectAll: 'Alle auswählen',
        clearAll: 'Alle löschen',
        importing: 'Importiere...',
        importSelected: 'Ausgewählte importieren ({count})',
        // Units
        weight: 'Gewicht',
        volume: 'Volumen',
        teaspoons: 'Teelöffel (TL)',
        tablespoons: 'Esslöffel (EL)',
        cups: 'Tassen'
    },
    // Hero Section
    hero: {
        title: 'Hören Sie auf, den Gewinn Ihrer Speisekarte zu erraten',
        subtitle: 'Sehen Sie genau, welche Gerichte Geld verdienen und welche Ihren Gewinn auffressen. Entwickelt aus 20 Jahren echter Küchenerfahrung.',
        ctaPrimary: 'Jetzt PrepFlow holen - 29€',
        ctaSecondary: 'Kostenlose Probe holen',
        dashboardAlt: 'PrepFlow Dashboard zeigt COGS-Analyse und Gewinneinblicke',
        disclaimer: 'Funktioniert für Cafés, Food Trucks, kleine Restaurants. Keine Bindung. 7-Tage-Geld-zurück-Richtlinie. Ergebnisse können je nach Ihrer aktuellen Speisekarte und Betrieb variieren.',
        // A/B Test Variants
        variantA: {
            title: 'Hören Sie auf, Geld mit Ihrer Speisekarte zu verlieren.',
            subtitle: 'Die meisten Restaurants wissen nicht, welche Gerichte profitabel sind. PrepFlow zeigt Ihnen genau, wohin Ihr Geld fließt — und wie Sie es beheben können.',
            bullet1: {
                title: 'Blutung stoppen',
                description: 'identifizieren Sie, welche Menüpunkte Sie Geld kosten'
            },
            bullet2: {
                title: 'Echte Kostenanalyse',
                description: 'sehen Sie echte Zutatenkosten inklusive Abfall und Ausbeute'
            },
            bullet3: {
                title: 'Gewinnoptimierung',
                description: 'wissen Sie, welche Gerichte Sie bewerben, reparieren oder entfernen sollten'
            },
            bullet4: {
                title: 'GST-Compliance',
                description: 'preisen Sie korrekt für australische Steueranforderungen'
            },
            bullet5: {
                title: 'Intelligente Menüentscheidungen',
                description: 'datengetriebene Entscheidungen über Ihre Menümischung'
            },
            bullet6: {
                title: 'KI-Kücheneinblicke',
                description: 'entdecken Sie neue Methoden zur Verbesserung Ihrer Margen'
            },
            ctaPrimary: 'Beispiel-Dashboard holen',
            ctaSecondary: 'Kostenlose Probe holen',
            disclaimer: 'Entwickelt für australische Cafés und Restaurants. Keine Bindung. 7-Tage-Geld-zurück-Richtlinie.'
        },
        variantB: {
            title: 'Verwandeln Sie Ihr Menü in eine Gewinnmaschine.',
            subtitle: 'Verwandeln Sie Raten in datengetriebene Entscheidungen. PrepFlow gibt Ihnen die Einblicke, um jeden Dollar auf Ihrem Menü zu maximieren.',
            bullet1: {
                title: 'Gewinnmaximierung',
                description: 'identifizieren Sie Ihre höchsten Margenmöglichkeiten'
            },
            bullet2: {
                title: 'Kostentransparenz',
                description: 'sehen Sie genau, was jedes Gericht kostet'
            },
            bullet3: {
                title: 'Menüoptimierung',
                description: 'wissen Sie, welche Artikel Sie bewerben oder entfernen sollten'
            },
            bullet4: {
                title: 'Steuercompliance',
                description: 'GST-bereite Preisgestaltung für australische Unternehmen'
            },
            bullet5: {
                title: 'Leistungsverfolgung',
                description: 'überwachen Sie, welche Gerichte Ihren Gewinn antreiben'
            },
            bullet6: {
                title: 'KI-Optimierung',
                description: 'erhalten Sie Vorschläge zur Verbesserung Ihrer Margen'
            },
            ctaPrimary: 'Beispiel-Dashboard holen',
            ctaSecondary: 'Beispiel-Blatt ausprobieren',
            disclaimer: 'Entwickelt für australische Gastronomie. Einfache Einrichtung. 7-Tage-Geld-zurück-Garantie.'
        },
        variantC: {
            title: 'Kennen Sie Ihre Menükosten. Machen Sie mehr Gewinn.',
            subtitle: 'PrepFlow zeigt Ihnen genau, was jedes Gericht kostet und wie viel Gewinn es macht. Einfaches Google Sheet. Echte Ergebnisse.',
            bullet1: {
                title: 'Kostenaufschlüsselung',
                description: 'sehen Sie genau, was jedes Gericht kostet'
            },
            bullet2: {
                title: 'Gewinnberechnung',
                description: 'kennen Sie Ihre Marge bei jedem Artikel'
            },
            bullet3: {
                title: 'Menüentscheidungen',
                description: 'entscheiden Sie, was Sie behalten, ändern oder entfernen möchten'
            },
            bullet4: {
                title: 'GST-bereit',
                description: 'australische Steuercompliance eingebaut'
            },
            bullet5: {
                title: 'Einfache Einrichtung',
                description: 'funktioniert in Google Sheets, keine neue Software'
            },
            bullet6: {
                title: 'Intelligente Einblicke',
                description: 'KI-Vorschläge zur Verbesserung Ihrer Margen'
            },
            ctaPrimary: 'Beispiel-Dashboard holen',
            ctaSecondary: 'Kostenlose Probe',
            disclaimer: 'Für australische Cafés und Restaurants. 7-Tage-Geld-zurück-Richtlinie.'
        }
    },
    // Pricing
    pricing: {
        title: 'Einfache, ehrliche Preise',
        subtitle: 'Einmaliger Kauf. Lebenslanger Zugang. Keine Abonnements, keine versteckten Gebühren.',
        price: '29€',
        currency: 'EUR',
        guarantee: '7-Tage-Geld-zurück-Garantie',
        features: {
            completeTemplate: 'Vollständige Google Sheets-Vorlage',
            preloadedIngredients: '300+ vorinstallierte Zutaten',
            multiCurrency: 'Multi-Währungsunterstützung',
            gstVat: 'GST/VAT-Berechnungen',
            lifetimeUpdates: 'Lebenslange Updates',
            moneyBack: '7-Tage-Geld-zurück-Garantie'
        },
        cta: 'Jetzt PrepFlow holen',
        instantAccess: 'Sofortiger Zugang über Gumroad'
    },
    // Features
    features: {
        stockList: {
            title: 'Bestandsliste (unendlich)',
            description: 'Zentralisieren Sie Zutaten mit Packungsgröße, Einheit, Lieferant, Lagerung, Produktcode. Erfassen Sie Zuschnitt/Abfall und Ausbeuten, um die echten Kosten pro Einheit zu erhalten.'
        },
        cogsRecipes: {
            title: 'COGS-Rezepte',
            description: 'Erstellen Sie Rezepte, die automatisch Zutatenkosten (inkl. Ausbeute/Zuschnitt) abrufen. Sehen Sie Gerichtskosten, COGS%, GP€ und GP% sofort.'
        },
        itemPerformance: {
            title: 'Artikel-Performance',
            description: 'Fügen Sie Verkäufe ein. Wir berechnen Popularität, Gewinnmarge, Gesamtgewinn ex-MwSt und klassifizieren Artikel als Chef\'s Kiss, Hidden Gem oder Bargain Bucket.'
        },
        dashboardKpis: {
            title: 'Dashboard-KPIs',
            description: 'Auf einen Blick: durchschnittlicher GP%, Lebensmittelkosten %, durchschnittlicher Artikelgewinn und Verkaufspreis, plus Top-Performer nach Popularität und Marge.'
        },
        globalTax: {
            title: 'Globale Steuern & Währung',
            description: 'Legen Sie Land, Steuersystem (GST/VAT/Umsatzsteuer) und Währung in den Einstellungen fest. Alle Ausgaben passen sich an Ihre lokalen Marktanforderungen an.'
        },
        fastOnboarding: {
            title: 'Schnelles Onboarding',
            description: 'Start-Tab mit Schritt-für-Schritt-Anleitung. Vorinstallierte Beispieldaten und umfassende Ressourcen, um den Ablauf in Minuten zu lernen.'
        },
        aiMethodGenerator: {
            title: 'KI-Methodengenerator',
            description: 'Entdecken Sie neue Kochmethoden, die Ihre Margen verbessern und Abfall reduzieren könnten. Erhalten Sie KI-gestützte Vorschläge zur Optimierung Ihrer Küchenprozesse.'
        }
    },
    // Landing Page Sections
    problemOutcome: {
        problem: {
            title: 'Das Problem',
            points: [
                'Sie wissen nicht, welche Menüpunkte tatsächlich Geld verdienen',
                'COGS-Kosten und Abfälle fressen Ihren Gewinn auf',
                'Preisgestaltung ist Raten; GST erschwert alles',
                'Berichte sind langsam, kompliziert oder sitzen in jemand anderem Tool'
            ]
        },
        outcome: {
            title: 'Das Ergebnis',
            points: [
                'Sehen Sie Artikel-Margen und Gewinn sofort',
                'Erkennen Sie "Gewinner" und "Gewinnlecks" auf einen Blick',
                'Preise mit Vertrauen anpassen (GST-bewusst)',
                'Alles in Google Sheets ausführen — keine neue Software zu lernen'
            ]
        }
    },
    contributingMargin: {
        title: 'Beitragsmarge — Die wahre Gewinnstory',
        subtitle: 'Sehen Sie über den Bruttogewinn hinaus, um zu verstehen, was jedes Gericht wirklich zu Ihrem Unternehmen beiträgt',
        grossProfit: {
            title: 'Bruttogewinn',
            description: 'Was Sie denken, dass Sie verdienen'
        },
        contributingMargin: {
            title: 'Beitragsmarge',
            description: 'Was Sie tatsächlich beitragen'
        },
        actionPlan: {
            title: 'Aktionsplan',
            description: 'Was Sie dagegen tun können'
        },
        explanation: 'PrepFlow hilft Ihnen zu sehen: Dieser 15$ Burger könnte eine 60% GP haben, aber nach Vorbereitungszeit, Abfall und Komplexität trägt er vielleicht nur 2,50$ zu Ihrer Gewinnmarge bei. Währenddessen könnte dieses einfache 8$ Beilagengericht 4,00$ beitragen.',
        disclaimer: '*Beispiel zur Veranschaulichung - tatsächliche Ergebnisse hängen von Ihrer spezifischen Menüstruktur und Kosten ab'
    },
    journey: {
        title: 'Meine Reise bei der Erstellung von PrepFlow',
        subtitle: 'Das ist nicht nur ein weiteres Tool - es ist meine persönliche Lösung für echte Küchenprobleme, verfeinert über 20 Jahre Arbeit in Restaurants in ganz Europa und Australien.',
        earlyExperience: {
            title: '2008-2012 - Frühe Erfahrung',
            description: 'Began als Sous Chef bei Krautwells GmbH, verwaltete vegane Küche und trainierte Nachwuchsköche'
        },
        europeanLeadership: {
            title: '2012-2018 - Europäische Führung',
            description: 'Gründete KSK-Küchenspezialkräfte veganes Catering, leitete Teams von 21 Mitarbeitern, bediente 1.200+ täglich'
        },
        australianExcellence: {
            title: '2018-2024 - Australische Exzellenz',
            description: 'Executive Chef Rollen, Head Chef bei ALH Hotels, leitete Teams von 9 Köchen mit KI-Integration'
        },
        readyToShare: {
            title: '2024 - Bereit zum Teilen',
            description: 'Teile jetzt das perfektionierte Tool mit Kollegen und Gastronomen, die vor den gleichen Herausforderungen stehen wie ich'
        },
        whyCreated: {
            title: 'Warum ich PrepFlow erstellt habe',
            paragraphs: [
                'Über 20 Jahre als Koch habe ich alles von kleinen Cafés bis hin zu groß angelegten Catering-Betrieben mit 1.200+ Gästen täglich geleitet. Ich stand vor den gleichen Herausforderungen wie Sie: Menükosten, Abfallmanagement, Gewinnanalyse und Teameffizienz.',
                'Als Head Chef bei ALH Hotels suchte ich ständig nach besseren Wegen, Kosten zu verwalten, Vorbereitungssysteme zu optimieren und unsere Menüauswahl zu verbessern. Bestehende Lösungen waren entweder zu komplex, zu teuer oder verstanden echte Küchenoperationen nicht.',
                'Also baute ich meine eigene Lösung - eine einfache Google Sheets Vorlage, die COGS-Berechnungen handhaben, Zutatenkosten verfolgen und mir genau zeigen konnte, welche Menüpunkte profitabel waren und welche Geld verloren.',
                'Nach der Arbeit in ganz Europa und Australien habe ich es perfekt für Veranstaltungsorte weltweit verfeinert - mit GST-Unterstützung für australische Märkte, Multi-Währungsoptionen und der Flexibilität, sich an die Bedürfnisse jeder Küche anzupassen. Es ist das Tool, das ich mir gewünscht hätte, als ich anfing, und jetzt teile ich es mit Ihnen.'
            ]
        }
    },
    globalFeatures: {
        title: 'Versteckte Gewinne aufdecken — Ein Blatt, jede Antwort',
        subtitle: 'Während andere Tausende für komplizierte Restaurantsoftware verlangen, bietet PrepFlow ähnliche Gewinneinblicke in einer einfachen Google Sheet für einen einmaligen Kauf.',
        multiCurrency: {
            title: 'Multi-Währung',
            description: 'USD, EUR, GBP, AUD, SGD und mehr. Währungen sofort wechseln.'
        },
        taxSystems: {
            title: 'Steuersysteme',
            description: 'GST, MwSt, Umsatzsteuer, HST. Konfigurieren Sie für Ihre lokalen Anforderungen.'
        },
        access24_7: {
            title: '24/7 Zugang',
            description: 'Cloud-basierte Google Sheets. Von überall, jederzeit zugreifen.'
        },
        noConsultants: {
            title: 'Keine Berater',
            description: 'Richten Sie sich selbst in unter einer Stunde ein. Keine teuren Implementierungsgebühren.'
        },
        conclusion: 'Ein Blatt. Schlüsseleinsichten, die Ihre Küche braucht. Identifizieren Sie Gewinnmöglichkeiten in Ihrem Menü mit Einblicken ähnlich teurer Software — aber in einer einfachen Google Sheet, die Sie selbst einrichten können.'
    },
    howItWorks: {
        title: 'Ergebnisse in 3 einfachen Schritten',
        step1: {
            title: 'Einrichtung (5–10 Min)',
            description: 'GST aktivieren, Zutaten, Ausbeuten und Lieferantenkosten hinzufügen.'
        },
        step2: {
            title: 'Verkäufe importieren',
            description: 'Fügen Sie Ihren POS-Export in den Verkaufs-Tab ein.'
        },
        step3: {
            title: 'Entscheiden & handeln',
            description: 'Dashboard sortiert Artikel nach Gewinn und Beliebtheit; Preise, Portionierung oder Menüauswahl korrigieren.'
        },
        checklist: {
            title: '60-Sekunden-Checkliste',
            items: [
                'GST-Toggle gesetzt?',
                'Zutatenausbeuten/Abfall eingegeben?',
                'Verkäufe eingefügt?',
                'Top 5 Niedrigmargen-Artikel überprüft?',
                'Dashboard morgen erneut prüfen'
            ]
        }
    },
    leadMagnet: {
        title: 'Sehen Sie PrepFlow vor dem Kauf',
        subtitle: 'Holen Sie sich ein Beispiel-Dashboard — wir senden es Ihnen per E-Mail.',
        form: {
            nameLabel: 'Ihr Name *',
            namePlaceholder: 'Ihr Name',
            emailLabel: 'Ihre E-Mail *',
            emailPlaceholder: 'ihre@email.com',
            sampleLabel: 'Holen Sie sich Ihr Beispiel-Dashboard',
            sampleDescription: 'Beispiel-Dashboard',
            submitButton: 'Beispiel-Dashboard senden',
            disclaimer: 'Kein Spam. Keine Bindung. Ihre Daten bleiben privat.\nWir senden Ihnen nur E-Mails über PrepFlow-Updates.'
        }
    },
    howItWorksPractice: {
        title: 'Wie PrepFlow in der Praxis funktioniert',
        subtitle: 'Von Raten zu datengesteuerter Klarheit - hier ist, was Sie erwarten können',
        before: {
            title: 'Vor PrepFlow',
            status: 'Unklare Margen',
            description: 'Blinde Preisgestaltung, Bauchgefühl, unklare Margen überall'
        },
        after: {
            title: 'Nach PrepFlow',
            status: 'Klare Einblicke',
            description: 'Datengesteuerte Entscheidungen, Margeneinblicke enthüllt, Klarheit erreicht'
        },
        explanation: 'PrepFlow hilft Ihnen zu identifizieren, wo Ihr Menü Gewinnpotenzial hat und wo Kosten in Ihre Margen fressen könnten',
        disclaimer: '*Ergebnisse hängen von Ihrer aktuellen Menüstruktur und wie Sie die Einblicke umsetzen ab'
    },
    benefits: {
        title: 'Was PrepFlow Ihnen hilft zu erreichen',
        betterPricing: {
            title: 'Bessere Preisentscheidungen',
            description: 'Sehen Sie genau, wie Zutatenkosten, Ausbeuten und Abfall Ihre Margen beeinflussen. Treffen Sie informierte Preisentscheidungen anstatt zu raten.'
        },
        identifyOpportunities: {
            title: 'Gewinnmöglichkeiten identifizieren',
            description: 'Erkennen Sie, welche Menüpunkte unterperformen und welche verstecktes Potenzial haben. Konzentrieren Sie Ihre Bemühungen dort, wo sie die größte Wirkung haben.'
        },
        streamlineOperations: {
            title: 'Operationen optimieren',
            description: 'Verstehen Sie Ihre wahren Kosten und optimieren Sie Ihre Menüauswahl. Reduzieren Sie Abfall, verbessern Sie die Effizienz und steigern Sie Ihre Gewinnmarge.'
        },
        cta: {
            text: 'Sehen Sie PrepFlow in Aktion',
            button: 'Beispiel holen'
        }
    },
    faq: {
        title: 'FAQ',
        questions: [
            {
                question: 'Brauche ich technische Fähigkeiten?',
                answer: 'Keine Tabellenkalkulationsformeln erforderlich. Wenn Sie Google Sheets verwenden können, sind Sie bereit.'
            },
            {
                question: 'Funktioniert es weltweit?',
                answer: 'Gebaut für globale Veranstaltungsorte — enthält GST, MwSt, Umsatzsteuer-Toggles, Multi-Währungsunterstützung und exportbereite Berichte für jeden Markt.'
            },
            {
                question: 'Was ist, wenn es für mich nicht funktioniert?',
                answer: 'Wenn Sie mit den Einblicken und der Klarheit, die PrepFlow in 7 Tagen bietet, nicht zufrieden sind, erhalten Sie jeden Cent zurück. Kein Ärger.'
            },
            {
                question: 'Wird mich das verlangsamen?',
                answer: 'Die Einrichtung dauert typischerweise 1-2 Stunden. Danach sparen Sie Zeit bei der Menüplanung und Kostenanalyse.'
            }
        ]
    },
    builtFor: {
        title: 'Gebaut für unabhängige Veranstaltungsorte & kleine Küchen',
        features: [
            'Funktioniert mit Google Sheets',
            '7-Tage-Rückerstattungsrichtlinie',
            'Für AU-Markt gemacht'
        ]
    },
    trustBar: {
        text: 'Hören Sie auf zu raten. Beginnen Sie zu wissen. PrepFlow ist nicht nur eine Tabelle — es ist das Röntgengerät für die Rentabilität Ihres Menüs.'
    },
    // Common
    common: {
        loading: 'Lädt...',
        error: 'Fehler',
        success: 'Erfolg',
        save: 'Speichern',
        cancel: 'Abbrechen',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        add: 'Hinzufügen',
        search: 'Suchen',
        filter: 'Filtern',
        sort: 'Sortieren',
        actions: 'Aktionen',
        name: 'Name',
        description: 'Beschreibung',
        price: 'Preis',
        cost: 'Kosten',
        quantity: 'Menge',
        unit: 'Einheit',
        total: 'Gesamt',
        subtotal: 'Zwischensumme',
        tax: 'Steuer',
        gst: 'GST',
        profit: 'Gewinn',
        margin: 'Marge',
        percentage: 'Prozentsatz',
        currency: 'Währung',
        date: 'Datum',
        time: 'Zeit',
        created: 'Erstellt',
        updated: 'Aktualisiert',
        status: 'Status',
        active: 'Aktiv',
        inactive: 'Inaktiv',
        pending: 'Ausstehend',
        completed: 'Abgeschlossen',
        failed: 'Fehlgeschlagen',
        yes: 'Ja',
        no: 'Nein',
        ok: 'OK',
        close: 'Schließen',
        back: 'Zurück',
        next: 'Weiter',
        previous: 'Vorherige',
        finish: 'Beenden',
        continue: 'Fortfahren',
        skip: 'Überspringen',
        retry: 'Wiederholen',
        refresh: 'Aktualisieren',
        reset: 'Zurücksetzen',
        clear: 'Löschen',
        select: 'Auswählen',
        selectAll: 'Alle auswählen',
        deselectAll: 'Alle abwählen',
        export: 'Exportieren',
        import: 'Importieren',
        download: 'Herunterladen',
        upload: 'Hochladen',
        print: 'Drucken',
        share: 'Teilen',
        copy: 'Kopieren',
        paste: 'Einfügen',
        cut: 'Ausschneiden',
        undo: 'Rückgängig',
        redo: 'Wiederholen',
        help: 'Hilfe',
        about: 'Über',
        settings: 'Einstellungen',
        preferences: 'Einstellungen',
        profile: 'Profil',
        account: 'Konto',
        logout: 'Abmelden',
        login: 'Anmelden',
        register: 'Registrieren',
        signup: 'Registrieren',
        signin: 'Anmelden',
        forgotPassword: 'Passwort vergessen?',
        rememberMe: 'Angemeldet bleiben',
        terms: 'Nutzungsbedingungen',
        privacy: 'Datenschutzrichtlinie',
        cookies: 'Cookie-Richtlinie',
        contact: 'Kontakt',
        support: 'Support',
        faq: 'FAQ',
        documentation: 'Dokumentation',
        tutorial: 'Tutorial',
        guide: 'Anleitung',
        tips: 'Tipps',
        tricks: 'Tricks',
        bestPractices: 'Best Practices',
        examples: 'Beispiele',
        samples: 'Proben',
        templates: 'Vorlagen',
        themes: 'Themen',
        languages: 'Sprachen',
        regions: 'Regionen',
        timezones: 'Zeitzonen',
        currencies: 'Währungen',
        units: 'Einheiten',
        measurements: 'Maße',
        formats: 'Formate',
        styles: 'Stile',
        colors: 'Farben',
        fonts: 'Schriftarten',
        sizes: 'Größen',
        weights: 'Gewichte',
        alignments: 'Ausrichtungen',
        spacings: 'Abstände',
        margins: 'Ränder',
        paddings: 'Polster',
        borders: 'Rahmen',
        radiuses: 'Radien',
        shadows: 'Schatten',
        gradients: 'Gradienten',
        animations: 'Animationen',
        transitions: 'Übergänge',
        effects: 'Effekte',
        filters: 'Filter',
        blurs: 'Unschärfen',
        opacities: 'Deckkraft',
        rotations: 'Rotationen',
        scales: 'Skalen',
        translations: 'Übersetzungen',
        positions: 'Positionen',
        dimensions: 'Dimensionen',
        widths: 'Breiten',
        heights: 'Höhen',
        depths: 'Tiefen',
        layers: 'Ebenen',
        levels: 'Ebenen',
        orders: 'Bestellungen',
        priorities: 'Prioritäten',
        importances: 'Wichtigkeiten',
        urgencies: 'Dringlichkeiten',
        categories: 'Kategorien',
        types: 'Typen',
        kinds: 'Arten',
        sorts: 'Sorten',
        varieties: 'Varianten',
        versions: 'Versionen',
        editions: 'Editionen',
        releases: 'Releases',
        builds: 'Builds',
        patches: 'Patches',
        updates: 'Updates',
        upgrades: 'Upgrades',
        downgrades: 'Downgrades',
        migrations: 'Migrationen',
        conversions: 'Konvertierungen',
        transformations: 'Transformationen',
        modifications: 'Modifikationen',
        alterations: 'Änderungen',
        changes: 'Änderungen',
        adjustments: 'Anpassungen',
        corrections: 'Korrekturen',
        fixes: 'Fixes',
        improvements: 'Verbesserungen',
        enhancements: 'Verbesserungen',
        optimizations: 'Optimierungen',
        performance: 'Leistung',
        speed: 'Geschwindigkeit',
        efficiency: 'Effizienz',
        productivity: 'Produktivität',
        quality: 'Qualität',
        reliability: 'Zuverlässigkeit',
        stability: 'Stabilität',
        security: 'Sicherheit',
        safety: 'Sicherheit',
        confidentiality: 'Vertraulichkeit',
        anonymity: 'Anonymität',
        encryption: 'Verschlüsselung',
        authentication: 'Authentifizierung',
        authorization: 'Autorisierung',
        permissions: 'Berechtigungen',
        access: 'Zugang',
        control: 'Kontrolle',
        management: 'Management',
        administration: 'Administration',
        governance: 'Governance',
        oversight: 'Aufsicht',
        supervision: 'Supervision',
        monitoring: 'Überwachung',
        tracking: 'Verfolgung',
        logging: 'Protokollierung',
        auditing: 'Auditierung',
        reporting: 'Berichterstattung',
        analytics: 'Analytik',
        metrics: 'Metriken',
        statistics: 'Statistiken',
        data: 'Daten',
        information: 'Informationen',
        knowledge: 'Wissen',
        wisdom: 'Weisheit',
        insights: 'Einblicke',
        intelligence: 'Intelligenz',
        smart: 'Smart',
        intelligent: 'Intelligent',
        clever: 'Clever',
        bright: 'Hell',
        brilliant: 'Brillant',
        genius: 'Genie',
        expert: 'Experte',
        professional: 'Professionell',
        specialist: 'Spezialist',
        consultant: 'Berater',
        advisor: 'Berater',
        mentor: 'Mentor',
        coach: 'Coach',
        trainer: 'Trainer',
        teacher: 'Lehrer',
        instructor: 'Instruktor',
        educator: 'Pädagoge',
        leader: 'Führer',
        manager: 'Manager',
        director: 'Direktor',
        executive: 'Executive',
        administrator: 'Administrator',
        supervisor: 'Supervisor',
        coordinator: 'Koordinator',
        facilitator: 'Facilitator',
        organizer: 'Organisator',
        planner: 'Planer',
        strategist: 'Strategist',
        analyst: 'Analyst',
        researcher: 'Forscher',
        investigator: 'Untersucher',
        explorer: 'Entdecker',
        discoverer: 'Entdecker',
        innovator: 'Innovator',
        creator: 'Schöpfer',
        builder: 'Builder',
        developer: 'Entwickler',
        designer: 'Designer',
        architect: 'Architekt',
        engineer: 'Ingenieur',
        technician: 'Techniker',
        master: 'Meister',
        guru: 'Guru',
        wizard: 'Zauberer',
        magician: 'Magier',
        artist: 'Künstler',
        craftsman: 'Handwerker',
        artisan: 'Handwerker',
        skilled: 'Geschickt',
        talented: 'Talentiert',
        gifted: 'Begabt',
        able: 'Fähig',
        capable: 'Fähig',
        competent: 'Kompetent',
        proficient: 'Proficient',
        experienced: 'Erfahren',
        qualified: 'Qualifiziert',
        certified: 'Zertifiziert',
        licensed: 'Lizenziert',
        accredited: 'Akkreditiert',
        approved: 'Genehmigt',
        validated: 'Validiert',
        verified: 'Verifiziert',
        confirmed: 'Bestätigt',
        authenticated: 'Authentifiziert',
        authorized: 'Autorisiert',
        permitted: 'Erlaubt',
        allowed: 'Erlaubt',
        enabled: 'Aktiviert',
        activated: 'Aktiviert',
        working: 'Arbeitend',
        functional: 'Funktional',
        operational: 'Operativ',
        running: 'Laufend',
        operating: 'Betrieb',
        functioning: 'Funktionierend'
    },
    // Floating CTA Banner
    floatingCta: {
        mainButton: 'PrepFlow holen',
        price: 'AUD $29',
        sampleButton: 'Kostenlose Probe'
    },
    // Footer
    footer: {
        copyright: `© ${new Date().getFullYear()} PrepFlow. Alle Rechte vorbehalten.`,
        terms: 'AGB',
        privacy: 'Datenschutz',
        support: 'Support'
    },
    // Logo
    logo: {
        alt: 'PrepFlow Logo'
    }
};
}),
"[project]/lib/useTranslation.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "availableLanguages": ()=>availableLanguages,
    "getTranslation": ()=>getTranslation,
    "useTranslation": ()=>useTranslation
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
// Import all translation files
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2f$en$2d$AU$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/translations/en-AU.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2f$de$2d$DE$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/translations/de-DE.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const availableLanguages = {
    'en-AU': {
        name: 'English',
        flag: '🇦🇺'
    },
    'de-DE': {
        name: 'Deutsch',
        flag: '🇩🇪'
    }
};
// Translation files mapping - Only English and German
const translations = {
    'en-AU': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2f$en$2d$AU$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translations"],
    'de-DE': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2f$de$2d$DE$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translations"]
};
// Get browser language - Only English and German
function getBrowserLanguage() {
    if ("TURBOPACK compile-time truthy", 1) return 'en-AU';
    //TURBOPACK unreachable
    ;
    const browserLang = undefined;
    // Check for language code only (e.g., 'en' from 'en-US')
    const langCode = undefined;
}
// Get nested translation value
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key)=>current?.[key], obj);
}
function useTranslation() {
    const [currentLanguage, setCurrentLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('en-AU');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false); // Start with false
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Initialize language on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsClient(true);
        const savedLanguage = localStorage.getItem('prepflow_language');
        const browserLanguage = getBrowserLanguage();
        setCurrentLanguage(savedLanguage || browserLanguage);
        setIsLoading(false);
    }, []);
    // Get translation function
    const t = (key, fallback)=>{
        // Always try to get translation, even during SSR
        const currentTranslations = translations[currentLanguage] || translations['en-AU'];
        const translation = getNestedValue(currentTranslations, key);
        // If translation is found, return it
        if (translation !== undefined) {
            return translation;
        }
        // If no translation found, return fallback or key
        return fallback || key;
    };
    // Change language
    const changeLanguage = (language)=>{
        if (translations[language]) {
            setCurrentLanguage(language);
            localStorage.setItem('prepflow_language', language);
            // Reload the page to apply the new language
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }
    };
    // Get current language info
    const getCurrentLanguageInfo = ()=>{
        return availableLanguages[currentLanguage] || availableLanguages['en-AU'];
    };
    // Get all available languages
    const getAvailableLanguages = ()=>{
        return Object.entries(availableLanguages).map(([code, info])=>({
                code,
                ...info
            }));
    };
    return {
        t,
        currentLanguage,
        changeLanguage,
        getCurrentLanguageInfo,
        getAvailableLanguages,
        isLoading
    };
}
function getTranslation(key, language = 'en-AU') {
    const currentTranslations = translations[language] || translations['en-AU'];
    return getNestedValue(currentTranslations, key) || key;
}
}),
"[project]/components/LanguageSwitcher.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "LanguageSwitcherCompact": ()=>LanguageSwitcherCompact,
    "LanguageSwitcherFull": ()=>LanguageSwitcherFull,
    "default": ()=>LanguageSwitcher
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-ssr] (ecmascript)");
'use client';
;
;
function LanguageSwitcher({ className = '', showFlag = true, showName = true, size = 'md' }) {
    const { currentLanguage, changeLanguage, getCurrentLanguageInfo, getAvailableLanguages } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const currentLangInfo = getCurrentLanguageInfo();
    const availableLangs = getAvailableLanguages();
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
            value: currentLanguage,
            onChange: (e)=>changeLanguage(e.target.value),
            className: `
          ${sizeClasses[size]}
          bg-[#2a2a2a] border border-[#29E7CD]/30 rounded-lg text-white
          focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent
          transition-all duration-200 hover:border-[#29E7CD]/50
          appearance-none cursor-pointer
          pl-3
        `,
            style: {
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
            },
            children: availableLangs.map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                    value: lang.code,
                    className: "bg-[#2a2a2a] text-white",
                    children: [
                        showFlag && lang.flag,
                        " ",
                        showName && lang.name
                    ]
                }, lang.code, true, {
                    fileName: "[project]/components/LanguageSwitcher.tsx",
                    lineNumber: 57,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/components/LanguageSwitcher.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/LanguageSwitcher.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
function LanguageSwitcherCompact({ className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageSwitcher, {
        className: className,
        showFlag: true,
        showName: false,
        size: "sm"
    }, void 0, false, {
        fileName: "[project]/components/LanguageSwitcher.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
function LanguageSwitcherFull({ className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageSwitcher, {
        className: className,
        showFlag: true,
        showName: true,
        size: "md"
    }, void 0, false, {
        fileName: "[project]/components/LanguageSwitcher.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/MobileNavigation.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "MobileNavigation": ()=>MobileNavigation
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/LanguageSwitcher.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function MobileNavigation({ onEngagement }) {
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const toggleMenu = ()=>{
        setIsOpen(!isOpen);
    };
    const closeMenu = ()=>{
        setIsOpen(false);
    };
    const handleNavClick = (section)=>{
        closeMenu();
        // Smooth scroll to section
        const element = document.getElementById(section);
        if (element) {
            const headerHeight = 80; // Approximate header height
            const elementPosition = element.offsetTop - headerHeight;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "md:hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: toggleMenu,
                className: "p-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:bg-gray-700/50 transition-colors",
                "aria-label": "Toggle navigation menu",
                "aria-expanded": isOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-6 h-6 flex flex-col justify-center items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`
                        }, void 0, false, {
                            fileName: "[project]/components/ui/MobileNavigation.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `block w-5 h-0.5 bg-white transition-all duration-300 mt-1 ${isOpen ? 'opacity-0' : ''}`
                        }, void 0, false, {
                            fileName: "[project]/components/ui/MobileNavigation.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `block w-5 h-0.5 bg-white transition-all duration-300 mt-1 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`
                        }, void 0, false, {
                            fileName: "[project]/components/ui/MobileNavigation.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/MobileNavigation.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/MobileNavigation.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
                        onClick: closeMenu
                    }, void 0, false, {
                        fileName: "[project]/components/ui/MobileNavigation.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-0 right-0 w-80 h-full bg-[#1f1f1f]/95 backdrop-blur-md border-l border-gray-700 shadow-2xl",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: "/images/prepflow-logo.png",
                                                    alt: "PrepFlow Logo",
                                                    width: 32,
                                                    height: 32,
                                                    className: "h-8 w-auto"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ui/MobileNavigation.tsx",
                                                    lineNumber: 67,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg font-bold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent",
                                                    children: "PrepFlow"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ui/MobileNavigation.tsx",
                                                    lineNumber: 74,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ui/MobileNavigation.tsx",
                                            lineNumber: 66,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: closeMenu,
                                            className: "p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors",
                                            "aria-label": "Close menu",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 text-white",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M6 18L18 6M6 6l12 12"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ui/MobileNavigation.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/ui/MobileNavigation.tsx",
                                                lineNumber: 83,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ui/MobileNavigation.tsx",
                                            lineNumber: 78,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ui/MobileNavigation.tsx",
                                    lineNumber: 65,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleNavClick('features'),
                                            className: "w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-[#29E7CD] hover:bg-gray-800/50 transition-colors",
                                            children: "Features"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ui/MobileNavigation.tsx",
                                            lineNumber: 91,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleNavClick('how-it-works'),
                                            className: "w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-[#29E7CD] hover:bg-gray-800/50 transition-colors",
                                            children: "How it works"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ui/MobileNavigation.tsx",
                                            lineNumber: 97,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleNavClick('pricing'),
                                            className: "w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-[#29E7CD] hover:bg-gray-800/50 transition-colors",
                                            children: "Pricing"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ui/MobileNavigation.tsx",
                                            lineNumber: 103,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleNavClick('faq'),
                                            className: "w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-[#29E7CD] hover:bg-gray-800/50 transition-colors",
                                            children: "FAQ"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ui/MobileNavigation.tsx",
                                            lineNumber: 109,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ui/MobileNavigation.tsx",
                                    lineNumber: 90,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 pt-6 border-t border-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-400",
                                                children: "Language"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ui/MobileNavigation.tsx",
                                                lineNumber: 120,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ui/MobileNavigation.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            className: "w-full"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ui/MobileNavigation.tsx",
                                            lineNumber: 122,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ui/MobileNavigation.tsx",
                                    lineNumber: 118,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 pt-6 border-t border-gray-700",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://7495573591101.gumroad.com/l/prepflow",
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "block w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-4 text-center font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300",
                                        onClick: ()=>{
                                            onEngagement('mobile_menu_cta_click');
                                            closeMenu();
                                        },
                                        children: "Get PrepFlow Now"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/MobileNavigation.tsx",
                                        lineNumber: 127,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/MobileNavigation.tsx",
                                    lineNumber: 126,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/MobileNavigation.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ui/MobileNavigation.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/MobileNavigation.tsx",
                lineNumber: 54,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/MobileNavigation.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/FloatingCTA.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "FloatingCTA": ()=>FloatingCTA
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function FloatingCTA({ onEngagement, t }) {
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleScroll = ()=>{
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            // Show after scrolling 50% of the page
            if (scrollY > windowHeight * 0.5) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return ()=>window.removeEventListener('scroll', handleScroll);
    }, []);
    if (!isVisible) return null;
    // Default translation function if not provided
    const defaultT = (key, fallback)=>fallback || key;
    const translate = t || defaultT;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: "https://7495573591101.gumroad.com/l/prepflow",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300 transform hover:scale-105",
                    onClick: ()=>onEngagement('floating_cta_click'),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: translate('floatingCta.mainButton', 'Get PrepFlow')
                        }, void 0, false, {
                            fileName: "[project]/components/ui/FloatingCTA.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs opacity-90",
                            children: translate('floatingCta.price', 'AUD $29')
                        }, void 0, false, {
                            fileName: "[project]/components/ui/FloatingCTA.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/FloatingCTA.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: "#lead-magnet",
                    className: "inline-flex items-center gap-2 rounded-2xl bg-gray-800/80 backdrop-blur-sm border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 hover:text-[#29E7CD] hover:border-[#29E7CD] transition-all duration-300 transform hover:scale-105",
                    onClick: ()=>onEngagement('floating_sample_click'),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: translate('floatingCta.sampleButton', 'Free Sample')
                    }, void 0, false, {
                        fileName: "[project]/components/ui/FloatingCTA.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ui/FloatingCTA.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/FloatingCTA.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/FloatingCTA.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/ScrollToTop.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "ScrollToTop": ()=>ScrollToTop
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function ScrollToTop() {
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleScroll = ()=>{
            const scrollY = window.scrollY;
            setIsVisible(scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return ()=>window.removeEventListener('scroll', handleScroll);
    }, []);
    const scrollToTop = ()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    if (!isVisible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: scrollToTop,
        className: "fixed bottom-6 left-6 z-40 md:bottom-8 md:left-8 p-3 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-gray-300 hover:text-[#29E7CD] hover:border-[#29E7CD] transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]",
        "aria-label": "Scroll to top",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-5 h-5",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M5 10l7-7m0 0l7 7m-7-7v18"
            }, void 0, false, {
                fileName: "[project]/components/ui/ScrollToTop.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ui/ScrollToTop.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/ScrollToTop.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/ScrollProgress.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "ScrollProgress": ()=>ScrollProgress
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function ScrollProgress() {
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleScroll = ()=>{
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight * 100;
            setProgress(Math.min(scrollPercent, 100));
        };
        window.addEventListener('scroll', handleScroll);
        return ()=>window.removeEventListener('scroll', handleScroll);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed top-0 left-0 w-full h-1 bg-gray-800/20 z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] transition-all duration-150 ease-out",
            style: {
                width: `${progress}%`
            }
        }, void 0, false, {
            fileName: "[project]/components/ui/ScrollProgress.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/ScrollProgress.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>Page
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ExitIntentTracker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ExitIntentTracker.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollTracker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ScrollTracker.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PerformanceTracker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PerformanceTracker.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PerformanceOptimizer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PerformanceOptimizer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$useABTest$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/useABTest.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LeadMagnetForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/LeadMagnetForm.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ab$2d$testing$2d$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ab-testing-analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/LanguageSwitcher.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$MobileNavigation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/MobileNavigation.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$FloatingCTA$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/FloatingCTA.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ScrollToTop$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/ScrollToTop.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ScrollProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/ScrollProgress.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function Page() {
    // Translation hook
    const { t, currentLanguage, changeLanguage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    // Engagement tracking function
    const handleEngagement = (event)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    };
    // A/B Testing hook with lazy loading
    const { variantId, isLoading, trackEngagement, renderHero, renderPricing } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$useABTest$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLandingPageABTest"])(undefined, t, handleEngagement);
    // Performance monitoring - track page load time
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        variantId
    ]);
    // Structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "PrepFlow",
        "description": "COGS & Menu Profit Tool for restaurant profitability optimization",
        "url": "https://www.prepflow.org",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "29",
            "priceCurrency": "AUD",
            "priceValidUntil": "2025-12-31",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "127"
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PerformanceOptimizer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ScrollProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScrollProgress"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ExitIntentTracker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                onExitIntent: ()=>{
                    console.log('🚨 User attempting to leave page - potential conversion opportunity');
                // You could trigger a popup, offer, or other retention strategy here
                }
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollTracker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                onSectionView: (sectionId)=>{
                    console.log(`👁️ User viewed section: ${sectionId}`);
                },
                onScrollDepth: (depth)=>{
                    console.log(`📊 User scrolled to ${depth}% of page`);
                }
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PerformanceTracker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                onMetrics: (metrics)=>{
                    console.log('⚡ Performance metrics:', metrics);
                }
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$FloatingCTA$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FloatingCTA"], {
                onEngagement: handleEngagement,
                t: t
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ScrollToTop$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScrollToTop"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify(structuredData)
                }
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "min-h-screen bg-[#0a0a0a] text-white scroll-smooth",
                style: {
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
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 -z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-0 left-1/4 w-96 h-96 bg-[#29E7CD]/10 rounded-full blur-3xl"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 146,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-1/2 right-1/4 w-96 h-96 bg-[#D925C7]/10 rounded-full blur-3xl"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 147,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-0 left-1/2 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 148,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 145,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                className: "flex items-center justify-between py-8",
                                role: "banner",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/prepflow-logo.png",
                                                alt: String(t('logo.alt', 'PrepFlow Logo')),
                                                width: 48,
                                                height: 48,
                                                className: "h-12 w-auto",
                                                priority: true
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 155,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xl font-bold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent",
                                                children: "PrepFlow"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 163,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                        className: "hidden gap-8 text-sm md:flex",
                                        role: "navigation",
                                        "aria-label": String(t('nav.ariaLabel', 'Main navigation')),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#features",
                                                className: "text-gray-300 hover:text-[#29E7CD] transition-colors focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded",
                                                "aria-label": String(t('nav.featuresAria', 'View PrepFlow features')),
                                                children: t('nav.features', 'Features')
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 168,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#how-it-works",
                                                className: "text-gray-300 hover:text-[#29E7CD] transition-colors focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded",
                                                "aria-label": String(t('nav.howItWorksAria', 'Learn how PrepFlow works')),
                                                children: t('nav.howItWorks', 'How it works')
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 169,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#pricing",
                                                className: "text-gray-300 hover:text-[#29E7CD] transition-colors focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded",
                                                "aria-label": String(t('nav.pricingAria', 'View PrepFlow pricing')),
                                                children: t('nav.pricing', 'Pricing')
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 170,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#faq",
                                                className: "text-gray-300 hover:text-[#29E7CD] transition-colors focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded",
                                                "aria-label": String(t('nav.faqAria', 'Frequently asked questions')),
                                                children: t('nav.faq', 'FAQ')
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 171,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 167,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hidden md:flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                className: "mr-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 174,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://7495573591101.gumroad.com/l/prepflow",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]",
                                                onClick: ()=>handleEngagement('header_cta_click'),
                                                children: t('hero.ctaPrimary', 'Get PrepFlow Now')
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 175,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 173,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "md:hidden flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                className: "scale-90",
                                                showFlag: true,
                                                showName: true,
                                                size: "sm"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 188,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$MobileNavigation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MobileNavigation"], {
                                                onEngagement: handleEngagement
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 194,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 187,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 153,
                                columnNumber: 9
                            }, this),
                            renderHero(),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 text-center text-base text-gray-300 shadow-lg",
                                children: t('trustBar.text')
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 202,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "problem-outcome",
                                className: "py-20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-12 md:grid-cols-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-3xl font-bold tracking-tight md:text-4xl mb-6",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent",
                                                        children: t('problemOutcome.problem.title')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 213,
                                                        columnNumber: 17
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "space-y-4 text-lg text-gray-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-start gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-red-400 text-xl",
                                                                    children: "✗"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 219,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: t('problemOutcome.problem.points.0')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 220,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 218,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-start gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-red-400 text-xl",
                                                                    children: "✗"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 223,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: t('problemOutcome.problem.points.1')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 224,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 222,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-start gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-red-400 text-xl",
                                                                    children: "✗"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 227,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: t('problemOutcome.problem.points.2')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 228,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 226,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-start gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-red-400 text-xl",
                                                                    children: "✗"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 231,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: t('problemOutcome.problem.points.3')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 232,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 230,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 211,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-3xl font-bold tracking-tight md:text-4xl mb-6",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bg-gradient-to-r from-green-400 to-[#29E7CD] bg-clip-text text-transparent",
                                                        children: t('problemOutcome.outcome.title')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 239,
                                                        columnNumber: 17
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 238,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "space-y-4 text-lg text-gray-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-start gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-green-400 text-xl",
                                                                    children: "✓"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 245,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: t('problemOutcome.outcome.points.0')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 246,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 244,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-start gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-green-400 text-xl",
                                                                    children: "✓"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 249,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: t('problemOutcome.outcome.points.1')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 250,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 248,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-start gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-green-400 text-xl",
                                                                    children: "✓"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 253,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: t('problemOutcome.outcome.points.2')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 254,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 252,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-start gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-green-400 text-xl",
                                                                    children: "✓"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 257,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: t('problemOutcome.outcome.points.3')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 258,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 256,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 237,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 210,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 209,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "py-20",
                                id: "contributing-margin",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-10 shadow-2xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center mb-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-3xl font-bold tracking-tight md:text-4xl mb-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent",
                                                        children: t('contributingMargin.title')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 270,
                                                        columnNumber: 17
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 269,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lg text-gray-300",
                                                    children: t('contributingMargin.subtitle')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 268,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid md:grid-cols-3 gap-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-2xl p-6 mb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-4xl",
                                                                children: "💰"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 280,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-xl font-semibold text-white mt-3",
                                                                children: t('contributingMargin.grossProfit.title')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 281,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-300",
                                                                children: t('contributingMargin.grossProfit.description')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 282,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 279,
                                                        columnNumber: 17
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-[#D925C7]/20 border border-[#D925C7]/30 rounded-2xl p-6 mb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-4xl",
                                                                children: "⚡"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 288,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-xl font-semibold text-white mt-3",
                                                                children: t('contributingMargin.contributingMargin.title')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 289,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-300",
                                                                children: t('contributingMargin.contributingMargin.description')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 290,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 17
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 286,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-[#3B82F6]/20 border border-[#3B82F6]/30 rounded-2xl p-6 mb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-4xl",
                                                                children: "🎯"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 296,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-xl font-semibold text-white mt-3",
                                                                children: t('contributingMargin.actionPlan.title')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 297,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-300",
                                                                children: t('contributingMargin.actionPlan.description')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 298,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 17
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 277,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-base text-gray-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: t('contributingMargin.explanation')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 305,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 306,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-gray-400",
                                                        children: t('contributingMargin.disclaimer')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 306,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 304,
                                                columnNumber: 15
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 303,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 267,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 266,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "py-20 border-t border-gray-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center mb-16",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-3xl font-bold tracking-tight md:text-4xl mb-4",
                                                children: t('journey.title')
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 315,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg text-gray-300 max-w-3xl mx-auto",
                                                children: t('journey.subtitle')
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 318,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 314,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-8 md:grid-cols-2 lg:grid-cols-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-4xl mb-4",
                                                        children: "👨‍🍳"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 325,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xl font-semibold text-white mb-2",
                                                        children: t('journey.earlyExperience.title')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 326,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-300 text-sm",
                                                        children: t('journey.earlyExperience.description')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 327,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 324,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-4xl mb-4",
                                                        children: "🌍"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xl font-semibold text-white mb-2",
                                                        children: t('journey.europeanLeadership.title')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-300 text-sm",
                                                        children: t('journey.europeanLeadership.description')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 335,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 332,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-4xl mb-4",
                                                        children: "🇦🇺"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 341,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xl font-semibold text-white mb-2",
                                                        children: t('journey.australianExcellence.title')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 342,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-300 text-sm",
                                                        children: t('journey.australianExcellence.description')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 343,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 340,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-4xl mb-4",
                                                        children: "🚀"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 349,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xl font-semibold text-white mb-2",
                                                        children: t('journey.readyToShare.title')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 350,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-300 text-sm",
                                                        children: t('journey.readyToShare.description')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 351,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 348,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 323,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-12 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-[#1f1f1f] border border-[#29E7CD]/30 rounded-2xl p-8 max-w-4xl mx-auto",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-2xl font-bold text-[#29E7CD] mb-4",
                                                    children: t('journey.whyCreated.title')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 359,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-300 leading-relaxed mb-4",
                                                    children: t('journey.whyCreated.paragraphs.0')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 362,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-300 leading-relaxed mb-4",
                                                    children: t('journey.whyCreated.paragraphs.1')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 365,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-300 leading-relaxed mb-4",
                                                    children: t('journey.whyCreated.paragraphs.2')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 368,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-300 leading-relaxed mb-4",
                                                    children: t('journey.whyCreated.paragraphs.3')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 371,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 358,
                                            columnNumber: 13
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 357,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 313,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "features",
                                className: "py-20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-8 md:grid-cols-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureCard, {
                                                title: String(t('features.stockList.title')),
                                                body: String(t('features.stockList.description'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 381,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureCard, {
                                                title: String(t('features.cogsRecipes.title')),
                                                body: String(t('features.cogsRecipes.description'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 382,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureCard, {
                                                title: String(t('features.itemPerformance.title')),
                                                body: String(t('features.itemPerformance.description'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 383,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 380,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-8 grid gap-8 md:grid-cols-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureCard, {
                                                title: String(t('features.dashboardKpis.title')),
                                                body: String(t('features.dashboardKpis.description'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 386,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureCard, {
                                                title: String(t('features.globalTax.title')),
                                                body: String(t('features.globalTax.description'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 387,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureCard, {
                                                title: String(t('features.fastOnboarding.title')),
                                                body: String(t('features.fastOnboarding.description'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 388,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureCard, {
                                                title: String(t('features.aiMethodGenerator.title')),
                                                body: String(t('features.aiMethodGenerator.description'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 389,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 385,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 379,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "global-features",
                                className: "py-20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-10 shadow-2xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center mb-12",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-3xl font-bold tracking-tight md:text-4xl mb-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent",
                                                        children: t('globalFeatures.title')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 398,
                                                        columnNumber: 17
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lg text-gray-300 max-w-3xl mx-auto",
                                                    children: t('globalFeatures.subtitle')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 396,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid gap-8 md:grid-cols-2 lg:grid-cols-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 bg-gradient-to-br from-[#29E7CD] to-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl",
                                                                children: "🌍"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 410,
                                                                columnNumber: 19
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 409,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold text-white mb-2",
                                                            children: t('globalFeatures.multiCurrency.title')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 412,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-400",
                                                            children: t('globalFeatures.multiCurrency.description')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 413,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 408,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 bg-gradient-to-br from-[#D925C7] to-[#29E7CD] rounded-2xl flex items-center justify-center mx-auto mb-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl",
                                                                children: "🏛️"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 418,
                                                                columnNumber: 19
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 417,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold text-white mb-2",
                                                            children: t('globalFeatures.taxSystems.title')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 420,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-400",
                                                            children: t('globalFeatures.taxSystems.description')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 421,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 416,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#D925C7] rounded-2xl flex items-center justify-center mx-auto mb-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl",
                                                                children: "📱"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 426,
                                                                columnNumber: 19
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 425,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold text-white mb-2",
                                                            children: t('globalFeatures.access24_7.title')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 428,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-400",
                                                            children: t('globalFeatures.access24_7.description')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 429,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 bg-gradient-to-br from-[#29E7CD] to-[#D925C7] rounded-2xl flex items-center justify-center mx-auto mb-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl",
                                                                children: "🚀"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 434,
                                                                columnNumber: 19
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 433,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold text-white mb-2",
                                                            children: t('globalFeatures.noConsultants.title')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 436,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-400",
                                                            children: t('globalFeatures.noConsultants.description')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 437,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 432,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 407,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-base text-gray-300",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: t('globalFeatures.conclusion')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 443,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 442,
                                                columnNumber: 15
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 441,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 395,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 394,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "how-it-works",
                                className: "py-20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-3xl font-bold tracking-tight md:text-4xl text-center mb-12",
                                        children: t('howItWorks.title')
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 451,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-12 grid gap-8 md:grid-cols-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Step, {
                                                n: 1,
                                                title: String(t('howItWorks.step1.title')),
                                                body: String(t('howItWorks.step1.description'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 455,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Step, {
                                                n: 2,
                                                title: String(t('howItWorks.step2.title')),
                                                body: String(t('howItWorks.step2.description'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 456,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Step, {
                                                n: 3,
                                                title: String(t('howItWorks.step3.title')),
                                                body: String(t('howItWorks.step3.description'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 457,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 454,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-16 rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-8 shadow-2xl",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-2xl font-bold text-center mb-6",
                                                children: t('howItWorks.checklist.title')
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 462,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid gap-4 md:grid-cols-5 text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[#29E7CD] text-xl",
                                                                    children: "1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 466,
                                                                    columnNumber: 19
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 465,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300",
                                                                children: t('howItWorks.checklist.items.0')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 468,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 464,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[#29E7CD] text-xl",
                                                                    children: "2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 472,
                                                                    columnNumber: 19
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 471,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300",
                                                                children: t('howItWorks.checklist.items.1')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 474,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 470,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[#29E7CD] text-xl",
                                                                    children: "3"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 478,
                                                                    columnNumber: 19
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 477,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300",
                                                                children: t('howItWorks.checklist.items.2')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 480,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 476,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[#29E7CD] text-xl",
                                                                    children: "4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 484,
                                                                    columnNumber: 19
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 483,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300",
                                                                children: t('howItWorks.checklist.items.3')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 486,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 482,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[#29E7CD] text-xl",
                                                                    children: "5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 490,
                                                                    columnNumber: 19
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 489,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300",
                                                                children: t('howItWorks.checklist.items.4')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 492,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 488,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 463,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 461,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 450,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "lead-magnet",
                                className: "py-20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-10 shadow-2xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center mb-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-3xl font-bold tracking-tight md:text-4xl mb-4",
                                                    children: t('leadMagnet.title')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 504,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lg text-gray-300",
                                                    children: t('leadMagnet.subtitle')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 507,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 503,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "max-w-md mx-auto",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LeadMagnetForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                onSuccess: (data)=>{
                                                    console.log('Lead captured:', data);
                                                // You can add additional success handling here
                                                },
                                                onError: (error)=>{
                                                    console.error('Lead capture failed:', error);
                                                // You can add additional error handling here
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 513,
                                                columnNumber: 15
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 512,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 502,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 501,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gradient-to-r from-[#D925C7] to-[#29E7CD] p-6 text-center text-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-bold mb-2",
                                            children: t('pricing.title')
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 530,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm opacity-90",
                                            children: t('pricing.subtitle')
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 533,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 529,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 528,
                                columnNumber: 9
                            }, this),
                            renderPricing(),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "how-it-works-practice",
                                className: "py-20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 shadow-2xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center mb-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-3xl font-bold tracking-tight md:text-4xl mb-4",
                                                    children: t('howItWorksPractice.title')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 546,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lg text-gray-300",
                                                    children: t('howItWorksPractice.subtitle')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 547,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 545,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid md:grid-cols-2 gap-8 items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-orange-500/20 border border-orange-500/30 rounded-2xl p-6 mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-2xl font-bold text-orange-400",
                                                                    children: t('howItWorksPractice.before.title')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 553,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-4xl font-extrabold text-orange-300",
                                                                    children: "?"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 554,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-400",
                                                                    children: t('howItWorksPractice.before.status')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 555,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 552,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-400",
                                                            children: t('howItWorksPractice.before.description')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 557,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 551,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-green-500/20 border border-green-500/30 rounded-2xl p-6 mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-2xl font-bold text-green-400",
                                                                    children: t('howItWorksPractice.after.title')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 562,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-4xl font-extrabold text-green-300",
                                                                    children: "📊"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 563,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-400",
                                                                    children: t('howItWorksPractice.after.status')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 564,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 561,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-400",
                                                            children: t('howItWorksPractice.after.description')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 566,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 560,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 550,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-400",
                                                    children: t('howItWorksPractice.explanation')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 571,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-2",
                                                    children: t('howItWorksPractice.disclaimer')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 572,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 570,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 544,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 543,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "benefits",
                                className: "py-20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-3xl font-bold tracking-tight md:text-4xl text-center mb-12",
                                        children: t('benefits.title')
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 579,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-12 grid gap-8 md:grid-cols-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BenefitCard, {
                                                title: String(t('benefits.betterPricing.title')),
                                                description: String(t('benefits.betterPricing.description')),
                                                icon: "💰"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 583,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BenefitCard, {
                                                title: String(t('benefits.identifyOpportunities.title')),
                                                description: String(t('benefits.identifyOpportunities.description')),
                                                icon: "🎯"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 588,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BenefitCard, {
                                                title: String(t('benefits.streamlineOperations.title')),
                                                description: String(t('benefits.streamlineOperations.description')),
                                                icon: "⚡"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 593,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 582,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-12 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "inline-flex items-center gap-3 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-6 py-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[#29E7CD]",
                                                    children: "📊"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 602,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white font-medium",
                                                    children: t('benefits.cta.text')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 603,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#lead-magnet",
                                                    className: "bg-[#29E7CD] text-black px-4 py-1 rounded-full text-sm font-semibold hover:bg-[#29E7CD]/80 transition-colors",
                                                    children: t('benefits.cta.button')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 604,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 601,
                                            columnNumber: 13
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 600,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 578,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "faq",
                                className: "py-20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-3xl font-bold tracking-tight md:text-4xl text-center mb-12",
                                        children: t('faq.title')
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 613,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-12 grid gap-8 md:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FAQ, {
                                                q: String(t('faq.questions.0.question')),
                                                a: String(t('faq.questions.0.answer'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 617,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FAQ, {
                                                q: String(t('faq.questions.1.question')),
                                                a: String(t('faq.questions.1.answer'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 618,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FAQ, {
                                                q: String(t('faq.questions.2.question')),
                                                a: String(t('faq.questions.2.answer'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 619,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FAQ, {
                                                q: String(t('faq.questions.3.question')),
                                                a: String(t('faq.questions.3.answer'))
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 620,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 616,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 612,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "py-16 border-t border-gray-700",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center mb-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-2xl font-bold text-white mb-4",
                                            children: t('builtFor.title')
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 627,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap justify-center gap-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-4 py-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[#29E7CD]",
                                                            children: "📊"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 630,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white text-sm",
                                                            children: t('builtFor.features.0')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 631,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 629,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-4 py-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[#29E7CD]",
                                                            children: "🛡️"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 634,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white text-sm",
                                                            children: t('builtFor.features.1')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 635,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 633,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-4 py-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[#29E7CD]",
                                                            children: "🇦🇺"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 638,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white text-sm",
                                                            children: t('builtFor.features.2')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 639,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 637,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 628,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 626,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 625,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                className: "border-t border-gray-700 py-12 text-sm text-gray-500",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center justify-between gap-6 md:flex-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: t('footer.copyright', `© ${new Date().getFullYear()} PrepFlow. All rights reserved.`)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 648,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/terms-of-service",
                                                    className: "hover:text-[#29E7CD] transition-colors",
                                                    children: t('footer.terms', 'Terms')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 650,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/privacy-policy",
                                                    className: "hover:text-[#29E7CD] transition-colors",
                                                    children: t('footer.privacy', 'Privacy')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 651,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "mailto:support@prepflow.org",
                                                    className: "hover:text-[#29E7CD] transition-colors",
                                                    children: t('footer.support', 'Support')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 652,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 649,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 647,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 646,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 151,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 128,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true);
}
/* ---------- Small helper components ---------- */ function Bullet({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "flex items-start gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mt-2 h-3 w-3 rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7]"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 666,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 665,
        columnNumber: 5
    }, this);
}
function FeatureCard({ title, body }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "text-xl font-semibold text-white mb-3",
                children: title
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 675,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-300 leading-relaxed",
                children: body
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 676,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 674,
        columnNumber: 5
    }, this);
}
function Step({ n, title, body }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-sm font-bold text-white",
                        children: n
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 685,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                        className: "text-lg font-semibold text-white",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 688,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 684,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-300 leading-relaxed",
                children: body
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 690,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 683,
        columnNumber: 5
    }, this);
}
function FAQ({ q, a }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-base font-semibold text-white mb-3",
                children: q
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 700,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-300 leading-relaxed",
                children: a
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 701,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 699,
        columnNumber: 5
    }, this);
}
function BenefitCard({ title, description, icon }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-4xl mb-4",
                children: icon
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 709,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "text-xl font-semibold text-white mb-3",
                children: title
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 710,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-300 leading-relaxed",
                children: description
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 711,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 708,
        columnNumber: 5
    }, this);
}
}),

};

//# sourceMappingURL=_47bcf278._.js.map