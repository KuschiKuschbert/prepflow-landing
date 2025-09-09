(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[next]/internal/font/google/inter_59dee874.module.css [app-client] (css module)": ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "inter_59dee874-module__9CtR0q__className",
});
}),
"[next]/internal/font/google/inter_59dee874.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_59dee874$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_59dee874.module.css [app-client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_59dee874$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Inter', 'Inter Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_59dee874$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_59dee874$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/lib/translations/en-AU.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
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
        faq: 'FAQ'
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
        yieldPercent: 'Yield Percentage (%)',
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
        dashboardAlt: 'PrepFlow Dashboard showing COGS analysis and profit insights'
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
        privacy: 'Privacy',
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
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/translations/de-DE.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
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
        faq: 'FAQ'
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
        yieldPercent: 'Ausbeute-Prozentsatz (%)',
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
        dashboardAlt: 'PrepFlow Dashboard zeigt COGS-Analyse und Gewinneinblicke'
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
        privacy: 'Privatsphäre',
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
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/useTranslation.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "availableLanguages": ()=>availableLanguages,
    "getTranslation": ()=>getTranslation,
    "useTranslation": ()=>useTranslation
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// Import all translation files
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2f$en$2d$AU$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/translations/en-AU.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2f$de$2d$DE$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/translations/de-DE.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const availableLanguages = {
    'en-AU': {
        name: 'English (Australia)',
        flag: '🇦🇺'
    },
    'en-US': {
        name: 'English (US)',
        flag: '🇺🇸'
    },
    'en-GB': {
        name: 'English (UK)',
        flag: '🇬🇧'
    },
    'de-DE': {
        name: 'Deutsch (Deutschland)',
        flag: '🇩🇪'
    },
    'fr-FR': {
        name: 'Français (France)',
        flag: '🇫🇷'
    },
    'es-ES': {
        name: 'Español (España)',
        flag: '🇪🇸'
    }
};
// Translation files mapping
const translations = {
    'en-AU': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2f$en$2d$AU$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["translations"],
    'en-US': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2f$en$2d$AU$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["translations"],
    'en-GB': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2f$en$2d$AU$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["translations"],
    'de-DE': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2f$de$2d$DE$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["translations"],
    'fr-FR': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2f$en$2d$AU$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["translations"],
    'es-ES': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2f$en$2d$AU$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ // Fallback to EN for now
    ["translations"]
};
// Get browser language
function getBrowserLanguage() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const browserLang = navigator.language || 'en-AU';
    // Check if we have exact match
    if (translations[browserLang]) {
        return browserLang;
    }
    // Check for language code only (e.g., 'en' from 'en-US')
    const langCode = browserLang.split('-')[0];
    const matchingLang = Object.keys(translations).find((lang)=>lang.startsWith(langCode));
    return matchingLang || 'en-AU';
}
// Get nested translation value
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key)=>current === null || current === void 0 ? void 0 : current[key], obj);
}
function useTranslation() {
    _s();
    const [currentLanguage, setCurrentLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('en-AU');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Start with false
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Initialize language on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTranslation.useEffect": ()=>{
            setIsClient(true);
            const savedLanguage = localStorage.getItem('prepflow_language');
            const browserLanguage = getBrowserLanguage();
            setCurrentLanguage(savedLanguage || browserLanguage);
            setIsLoading(false);
        }
    }["useTranslation.useEffect"], []);
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
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.reload();
            }
        }
    };
    // Get current language info
    const getCurrentLanguageInfo = ()=>{
        return availableLanguages[currentLanguage] || availableLanguages['en-AU'];
    };
    // Get all available languages
    const getAvailableLanguages = ()=>{
        return Object.entries(availableLanguages).map((param)=>{
            let [code, info] = param;
            return {
                code,
                ...info
            };
        });
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
_s(useTranslation, "mc1lCkVBZ+VDclO8NeJTchTbMCU=");
function getTranslation(key) {
    let language = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'en-AU';
    const currentTranslations = translations[language] || translations['en-AU'];
    return getNestedValue(currentTranslations, key) || key;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/LanguageSwitcher.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "LanguageSwitcherCompact": ()=>LanguageSwitcherCompact,
    "LanguageSwitcherFull": ()=>LanguageSwitcherFull,
    "default": ()=>LanguageSwitcher
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function LanguageSwitcher(param) {
    let { className = '', showFlag = true, showName = true, size = 'md' } = param;
    _s();
    const { currentLanguage, changeLanguage, getCurrentLanguageInfo, getAvailableLanguages } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const currentLangInfo = getCurrentLanguageInfo();
    const availableLangs = getAvailableLanguages();
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative ".concat(className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                value: currentLanguage,
                onChange: (e)=>changeLanguage(e.target.value),
                className: "\n          ".concat(sizeClasses[size], "\n          bg-[#2a2a2a] border border-[#29E7CD]/30 rounded-lg text-white\n          focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent\n          transition-all duration-200 hover:border-[#29E7CD]/50\n          appearance-none cursor-pointer\n        "),
                style: {
                    backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                },
                children: availableLangs.map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: lang.code,
                        children: [
                            showFlag && lang.flag,
                            " ",
                            showName && lang.name
                        ]
                    }, lang.code, true, {
                        fileName: "[project]/components/LanguageSwitcher.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/LanguageSwitcher.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-gray-400 text-sm",
                    children: showFlag && currentLangInfo.flag
                }, void 0, false, {
                    fileName: "[project]/components/LanguageSwitcher.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/LanguageSwitcher.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/LanguageSwitcher.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(LanguageSwitcher, "YaJdcTxGqSGN0Oqvp2i0w8tUwh8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = LanguageSwitcher;
function LanguageSwitcherCompact(param) {
    let { className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageSwitcher, {
        className: className,
        showFlag: true,
        showName: false,
        size: "sm"
    }, void 0, false, {
        fileName: "[project]/components/LanguageSwitcher.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_c1 = LanguageSwitcherCompact;
function LanguageSwitcherFull(param) {
    let { className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageSwitcher, {
        className: className,
        showFlag: true,
        showName: true,
        size: "md"
    }, void 0, false, {
        fileName: "[project]/components/LanguageSwitcher.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_c2 = LanguageSwitcherFull;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "LanguageSwitcher");
__turbopack_context__.k.register(_c1, "LanguageSwitcherCompact");
__turbopack_context__.k.register(_c2, "LanguageSwitcherFull");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/webapp/layout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>WebAppLayout
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_59dee874$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_59dee874.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/LanguageSwitcher.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function WebAppLayout(param) {
    let { children } = param;
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            className: "".concat(__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_59dee874$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].className, " bg-[#0a0a0a] text-white"),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "bg-[#1f1f1f] border-b border-[#2a2a2a]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:block",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-w-7xl mx-auto px-4 py-4 flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/webapp",
                                                className: "flex items-center space-x-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: "/images/prepflow-logo.png",
                                                    alt: "PrepFlow Logo",
                                                    width: 120,
                                                    height: 40,
                                                    className: "h-8 w-auto",
                                                    priority: true
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 28,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 27,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "flex space-x-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: "/webapp",
                                                            className: "text-gray-300 hover:text-[#29E7CD] transition-colors",
                                                            children: t('nav.dashboard', 'Dashboard')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 38,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 38,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: "/webapp/ingredients",
                                                            className: "text-gray-300 hover:text-[#29E7CD] transition-colors",
                                                            children: t('nav.ingredients', 'Ingredients')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 39,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 39,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: "/webapp/recipes",
                                                            className: "text-gray-300 hover:text-[#29E7CD] transition-colors",
                                                            children: t('nav.recipes', 'Recipe Book')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 40,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 40,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: "/webapp/cogs",
                                                            className: "text-gray-300 hover:text-[#29E7CD] transition-colors",
                                                            children: t('nav.cogs', 'COGS')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 41,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 41,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: "/webapp/setup",
                                                            className: "text-gray-300 hover:text-[#29E7CD] transition-colors",
                                                            children: t('nav.setup', 'Setup')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 42,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 42,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 37,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/layout.tsx",
                                        lineNumber: 26,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                className: "mr-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 46,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/",
                                                className: "text-sm text-gray-400 hover:text-[#29E7CD] transition-colors",
                                                children: t('nav.backToLanding', 'Back to Landing')
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 47,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/layout.tsx",
                                        lineNumber: 45,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/layout.tsx",
                                lineNumber: 25,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/layout.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "md:hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-4 py-3 flex justify-between items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/webapp",
                                            className: "flex items-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/prepflow-logo.png",
                                                alt: "PrepFlow Logo",
                                                width: 100,
                                                height: 32,
                                                className: "h-6 w-auto",
                                                priority: true
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 58,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/layout.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 68,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/",
                                                    className: "text-sm text-gray-400 hover:text-[#29E7CD] transition-colors",
                                                    children: t('nav.backToLanding', 'Back to Landing')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 69,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/layout.tsx",
                                            lineNumber: 67,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/layout.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-t border-[#2a2a2a]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex overflow-x-auto scrollbar-hide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/webapp",
                                                className: "flex-shrink-0 px-4 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-center space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-6 h-6 flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5",
                                                                fill: "currentColor",
                                                                viewBox: "0 0 20 20",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                    lineNumber: 80,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 79,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 78,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs",
                                                            children: t('nav.dashboard', 'Dashboard')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 83,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 77,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 76,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/webapp/ingredients",
                                                className: "flex-shrink-0 px-4 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-center space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-6 h-6 flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5",
                                                                fill: "currentColor",
                                                                viewBox: "0 0 20 20",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    fillRule: "evenodd",
                                                                    d: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z",
                                                                    clipRule: "evenodd"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                    lineNumber: 90,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 89,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 88,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs",
                                                            children: t('nav.ingredients', 'Ingredients')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 93,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 86,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/webapp/recipes",
                                                className: "flex-shrink-0 px-4 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-center space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-6 h-6 flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5",
                                                                fill: "currentColor",
                                                                viewBox: "0 0 20 20",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    fillRule: "evenodd",
                                                                    d: "M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2h-.01z",
                                                                    clipRule: "evenodd"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                    lineNumber: 100,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 99,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 98,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs",
                                                            children: t('nav.recipes', 'Recipe Book')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 103,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 96,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/webapp/cogs",
                                                className: "flex-shrink-0 px-4 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-center space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-6 h-6 flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5",
                                                                fill: "currentColor",
                                                                viewBox: "0 0 20 20",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    fillRule: "evenodd",
                                                                    d: "M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z",
                                                                    clipRule: "evenodd"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                    lineNumber: 110,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 109,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 108,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs",
                                                            children: t('nav.cogs', 'COGS')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 113,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 107,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 106,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/webapp/setup",
                                                className: "flex-shrink-0 px-4 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-center space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-6 h-6 flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5",
                                                                fill: "currentColor",
                                                                viewBox: "0 0 20 20",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    fillRule: "evenodd",
                                                                    d: "M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z",
                                                                    clipRule: "evenodd"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                    lineNumber: 120,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 119,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 118,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs",
                                                            children: t('nav.setup', 'Setup')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                            lineNumber: 123,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 117,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 116,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/layout.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/layout.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/layout.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/layout.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "min-h-screen bg-[#0a0a0a]",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/app/webapp/layout.tsx",
                    lineNumber: 130,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/webapp/layout.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/webapp/layout.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_s(WebAppLayout, "zlIdU9EjM2llFt74AbE2KsUJXyM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = WebAppLayout;
var _c;
__turbopack_context__.k.register(_c, "WebAppLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__ab45b8a7._.js.map