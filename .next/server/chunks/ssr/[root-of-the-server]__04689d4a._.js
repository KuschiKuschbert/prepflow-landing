module.exports = [
"[next]/internal/font/google/inter_5972bc34.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "inter_5972bc34-module__OU16Qa__className",
});
}),
"[next]/internal/font/google/inter_5972bc34.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_5972bc34$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_5972bc34.module.css [app-ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_5972bc34$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Inter', 'Inter Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_5972bc34$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_5972bc34$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/lib/translations/en-AU.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// English (Australia) translations
__turbopack_context__.s([
    "translations",
    ()=>translations
]);
const translations = {
    // Navigation
    nav: {
        dashboard: 'Dashboard',
        ingredients: 'Ingredients',
        recipes: 'Recipe Book',
        cogs: 'COGS',
        performance: 'Performance',
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
    // WebApp Performance Analysis
    performance: {
        title: 'Performance Analysis',
        subtitle: 'Analyze your menu performance and profitability',
        dish: 'Dish',
        numberSold: 'Number Sold',
        popularity: 'Popularity',
        itemFoodCost: 'Item Food Cost',
        itemSalePrice: 'Item Sale Price',
        grossProfit: 'Gross Profit',
        grossProfitExclGST: 'Gross Profit excl. GST',
        profitCat: 'Profit Cat',
        popularityCat: 'Popularity Cat',
        menuItemClass: 'Menu Item Class',
        allCategories: 'All Categories',
        chefsKiss: 'Chef\'s Kiss',
        hiddenGem: 'Hidden Gem',
        bargainBucket: 'Bargain Bucket',
        burntToast: 'Burnt Toast',
        grossProfitPercent: 'Gross Profit %',
        dishName: 'Dish Name',
        ascending: '↑ Ascending',
        descending: '↓ Descending',
        importSalesData: 'Import Sales Data',
        exportCSV: 'Export CSV',
        importModalTitle: 'Import Sales Data',
        importModalDesc: 'Paste your CSV data below. Make sure it has columns for Dish, Number Sold, and Popularity.',
        importPlaceholder: 'Dish,Number Sold,Popularity\nDouble Cheese Burger,175,10.85\nHot Dog,158,9.80',
        importing: 'Importing...',
        importData: 'Import Data',
        cancel: 'Cancel',
        high: 'High',
        low: 'Low',
        performanceOverview: 'Performance Overview',
        categoryDistribution: 'Category Distribution'
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
"[project]/lib/translations/de-DE.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// German (Germany) translations
__turbopack_context__.s([
    "translations",
    ()=>translations
]);
const translations = {
    // Navigation
    nav: {
        dashboard: 'Dashboard',
        ingredients: 'Zutaten',
        recipes: 'Rezeptbuch',
        cogs: 'COGS',
        performance: 'Leistung',
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
    // WebApp Performance Analysis
    performance: {
        title: 'Leistungsanalyse',
        subtitle: 'Analysieren Sie Ihre Menüleistung und Rentabilität',
        dish: 'Gericht',
        numberSold: 'Verkaufte Anzahl',
        popularity: 'Beliebtheit',
        itemFoodCost: 'Lebensmittelkosten',
        itemSalePrice: 'Verkaufspreis',
        grossProfit: 'Bruttogewinn',
        grossProfitExclGST: 'Bruttogewinn ohne MwSt.',
        profitCat: 'Gewinn-Kat.',
        popularityCat: 'Beliebtheits-Kat.',
        menuItemClass: 'Menügericht-Klasse',
        allCategories: 'Alle Kategorien',
        chefsKiss: 'Chef\'s Kiss',
        hiddenGem: 'Verstecktes Juwel',
        bargainBucket: 'Schnäppchen',
        burntToast: 'Angebrannt',
        grossProfitPercent: 'Bruttogewinn %',
        dishName: 'Gerichtsname',
        ascending: '↑ Aufsteigend',
        descending: '↓ Absteigend',
        importSalesData: 'Verkaufsdaten importieren',
        exportCSV: 'CSV exportieren',
        importModalTitle: 'Verkaufsdaten importieren',
        importModalDesc: 'Fügen Sie Ihre CSV-Daten unten ein. Stellen Sie sicher, dass Spalten für Gericht, Verkaufte Anzahl und Beliebtheit vorhanden sind.',
        importPlaceholder: 'Gericht,Verkaufte Anzahl,Beliebtheit\nDoppel-Cheeseburger,175,10.85\nHot Dog,158,9.80',
        importing: 'Importiere...',
        importData: 'Daten importieren',
        cancel: 'Abbrechen',
        high: 'Hoch',
        low: 'Niedrig',
        performanceOverview: 'Leistungsübersicht',
        categoryDistribution: 'Kategorieverteilung'
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
"[project]/lib/useTranslation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "availableLanguages",
    ()=>availableLanguages,
    "getTranslation",
    ()=>getTranslation,
    "useTranslation",
    ()=>useTranslation
]);
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
        flag: '🇬🇧'
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
"[project]/components/LanguageSwitcher.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageSwitcherCompact",
    ()=>LanguageSwitcherCompact,
    "LanguageSwitcherFull",
    ()=>LanguageSwitcherFull,
    "default",
    ()=>LanguageSwitcher
]);
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
"[project]/lib/country-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COUNTRY_CONFIGS",
    ()=>COUNTRY_CONFIGS,
    "detectCountryFromLocale",
    ()=>detectCountryFromLocale,
    "formatCurrencyWithTax",
    ()=>formatCurrencyWithTax,
    "getAvailableCountries",
    ()=>getAvailableCountries,
    "getCountryConfig",
    ()=>getCountryConfig,
    "getTaxBreakdown",
    ()=>getTaxBreakdown
]);
const COUNTRY_CONFIGS = {
    'AU': {
        code: 'AU',
        name: 'Australia',
        currency: 'AUD',
        locale: 'en-AU',
        taxRate: 0.10,
        taxName: 'GST',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: {
            decimalSeparator: '.',
            thousandsSeparator: ','
        },
        phoneFormat: '+61 X XXXX XXXX',
        addressFormat: [
            'Street Address',
            'Suburb',
            'State Postcode',
            'Australia'
        ]
    },
    'US': {
        code: 'US',
        name: 'United States',
        currency: 'USD',
        locale: 'en-US',
        taxRate: 0.08,
        taxName: 'Sales Tax',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: {
            decimalSeparator: '.',
            thousandsSeparator: ','
        },
        phoneFormat: '+1 (XXX) XXX-XXXX',
        addressFormat: [
            'Street Address',
            'City, State ZIP',
            'United States'
        ]
    },
    'GB': {
        code: 'GB',
        name: 'United Kingdom',
        currency: 'GBP',
        locale: 'en-GB',
        taxRate: 0.20,
        taxName: 'VAT',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: {
            decimalSeparator: '.',
            thousandsSeparator: ','
        },
        phoneFormat: '+44 XXXX XXX XXX',
        addressFormat: [
            'Street Address',
            'City',
            'Postcode',
            'United Kingdom'
        ]
    },
    'DE': {
        code: 'DE',
        name: 'Germany',
        currency: 'EUR',
        locale: 'de-DE',
        taxRate: 0.19,
        taxName: 'MwSt',
        dateFormat: 'DD.MM.YYYY',
        numberFormat: {
            decimalSeparator: ',',
            thousandsSeparator: '.'
        },
        phoneFormat: '+49 XXX XXXXXXX',
        addressFormat: [
            'Street Address',
            'Postcode City',
            'Germany'
        ]
    },
    'FR': {
        code: 'FR',
        name: 'France',
        currency: 'EUR',
        locale: 'fr-FR',
        taxRate: 0.20,
        taxName: 'TVA',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: {
            decimalSeparator: ',',
            thousandsSeparator: ' '
        },
        phoneFormat: '+33 X XX XX XX XX',
        addressFormat: [
            'Street Address',
            'Postcode City',
            'France'
        ]
    },
    'ES': {
        code: 'ES',
        name: 'Spain',
        currency: 'EUR',
        locale: 'es-ES',
        taxRate: 0.21,
        taxName: 'IVA',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: {
            decimalSeparator: ',',
            thousandsSeparator: '.'
        },
        phoneFormat: '+34 XXX XXX XXX',
        addressFormat: [
            'Street Address',
            'Postcode City',
            'Spain'
        ]
    },
    'CA': {
        code: 'CA',
        name: 'Canada',
        currency: 'CAD',
        locale: 'en-CA',
        taxRate: 0.13,
        taxName: 'HST/GST',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: {
            decimalSeparator: '.',
            thousandsSeparator: ','
        },
        phoneFormat: '+1 (XXX) XXX-XXXX',
        addressFormat: [
            'Street Address',
            'City, Province Postal Code',
            'Canada'
        ]
    },
    'NZ': {
        code: 'NZ',
        name: 'New Zealand',
        currency: 'NZD',
        locale: 'en-NZ',
        taxRate: 0.15,
        taxName: 'GST',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: {
            decimalSeparator: '.',
            thousandsSeparator: ','
        },
        phoneFormat: '+64 XX XXX XXXX',
        addressFormat: [
            'Street Address',
            'Suburb',
            'City Postcode',
            'New Zealand'
        ]
    },
    'IT': {
        code: 'IT',
        name: 'Italy',
        currency: 'EUR',
        locale: 'it-IT',
        taxRate: 0.22,
        taxName: 'IVA',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: {
            decimalSeparator: ',',
            thousandsSeparator: '.'
        },
        phoneFormat: '+39 XXX XXX XXXX',
        addressFormat: [
            'Street Address',
            'Postcode City',
            'Italy'
        ]
    },
    'NL': {
        code: 'NL',
        name: 'Netherlands',
        currency: 'EUR',
        locale: 'nl-NL',
        taxRate: 0.21,
        taxName: 'BTW',
        dateFormat: 'DD-MM-YYYY',
        numberFormat: {
            decimalSeparator: ',',
            thousandsSeparator: '.'
        },
        phoneFormat: '+31 XX XXX XXXX',
        addressFormat: [
            'Street Address',
            'Postcode City',
            'Netherlands'
        ]
    }
};
const getCountryConfig = (countryCode)=>{
    return COUNTRY_CONFIGS[countryCode] || COUNTRY_CONFIGS['AU'];
};
const getAvailableCountries = ()=>{
    return Object.values(COUNTRY_CONFIGS);
};
const detectCountryFromLocale = (locale)=>{
    const localeToCountry = {
        'en-AU': 'AU',
        'en-US': 'US',
        'en-GB': 'GB',
        'en-CA': 'CA',
        'en-NZ': 'NZ',
        'de-DE': 'DE',
        'fr-FR': 'FR',
        'es-ES': 'ES',
        'it-IT': 'IT',
        'nl-NL': 'NL'
    };
    return localeToCountry[locale] || 'AU';
};
const formatCurrencyWithTax = (amount, countryCode, includeTax = true)=>{
    const config = getCountryConfig(countryCode);
    const taxAmount = amount * config.taxRate;
    const totalAmount = includeTax ? amount + taxAmount : amount;
    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency
    }).format(totalAmount);
};
const getTaxBreakdown = (amount, countryCode)=>{
    const config = getCountryConfig(countryCode);
    const taxAmount = amount * config.taxRate;
    const totalAmount = amount + taxAmount;
    return {
        subtotal: amount,
        taxRate: config.taxRate,
        taxAmount,
        total: totalAmount,
        taxName: config.taxName,
        currency: config.currency,
        locale: config.locale
    };
};
}),
"[project]/contexts/CountryContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CountryProvider",
    ()=>CountryProvider,
    "useCountry",
    ()=>useCountry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$country$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/country-config.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const CountryContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function CountryProvider({ children }) {
    const [selectedCountry, setSelectedCountry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('AU');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load saved country preference or detect from browser
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadCountryPreference = ()=>{
            try {
                // Check localStorage for saved preference
                const savedCountry = localStorage.getItem('prepflow-country');
                if (savedCountry && __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$country$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COUNTRY_CONFIGS"][savedCountry]) {
                    setSelectedCountry(savedCountry);
                } else {
                    // Auto-detect from browser locale
                    const browserLocale = navigator.language || 'en-AU';
                    const detectedCountry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$country$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["detectCountryFromLocale"])(browserLocale);
                    setSelectedCountry(detectedCountry);
                }
            } catch (error) {
                console.error('Error loading country preference:', error);
                setSelectedCountry('AU'); // Default fallback
            } finally{
                setIsLoading(false);
            }
        };
        loadCountryPreference();
    }, []);
    const setCountry = (countryCode)=>{
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$country$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COUNTRY_CONFIGS"][countryCode]) {
            setSelectedCountry(countryCode);
            try {
                localStorage.setItem('prepflow-country', countryCode);
            } catch (error) {
                console.error('Error saving country preference:', error);
            }
        }
    };
    const countryConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$country$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCountryConfig"])(selectedCountry);
    const value = {
        selectedCountry,
        countryConfig,
        setCountry,
        isLoading
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CountryContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/CountryContext.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
function useCountry() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(CountryContext);
    if (context === undefined) {
        throw new Error('useCountry must be used within a CountryProvider');
    }
    return context;
}
}),
"[project]/contexts/GlobalWarningContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlobalWarningProvider",
    ()=>GlobalWarningProvider,
    "useGlobalWarning",
    ()=>useGlobalWarning
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const GlobalWarningContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useGlobalWarning = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(GlobalWarningContext);
    if (!context) {
        throw new Error('useGlobalWarning must be used within a GlobalWarningProvider');
    }
    return context;
};
const GlobalWarningProvider = ({ children })=>{
    const [warnings, setWarnings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const addWarning = (warning)=>{
        const id = `warning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newWarning = {
            ...warning,
            id,
            dismissible: warning.dismissible !== false,
            autoHide: warning.autoHide || false,
            autoHideDelay: warning.autoHideDelay || 5000
        };
        setWarnings((prev)=>{
            // Check if similar warning already exists
            const existingWarning = prev.find((w)=>w.type === newWarning.type && w.title === newWarning.title && w.message === newWarning.message);
            if (existingWarning) {
                return prev; // Don't add duplicate warnings
            }
            return [
                ...prev,
                newWarning
            ];
        });
        // Auto-hide warning if enabled
        if (newWarning.autoHide) {
            setTimeout(()=>{
                removeWarning(id);
            }, newWarning.autoHideDelay);
        }
    };
    const removeWarning = (id)=>{
        setWarnings((prev)=>prev.filter((warning)=>warning.id !== id));
    };
    const clearWarnings = ()=>{
        setWarnings([]);
    };
    const hasWarnings = warnings.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GlobalWarningContext.Provider, {
        value: {
            warnings,
            addWarning,
            removeWarning,
            clearWarnings,
            hasWarnings
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/GlobalWarningContext.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/lib/react-query.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// React Query Configuration for PrepFlow
// Provides caching, request deduplication, and optimistic updates
__turbopack_context__.s([
    "backgroundSync",
    ()=>backgroundSync,
    "cacheUtils",
    ()=>cacheUtils,
    "handleQueryError",
    ()=>handleQueryError,
    "invalidateQueries",
    ()=>invalidateQueries,
    "optimisticUpdates",
    ()=>optimisticUpdates,
    "prefetchQueries",
    ()=>prefetchQueries,
    "queryClient",
    ()=>queryClient,
    "queryKeys",
    ()=>queryKeys
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
;
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
    defaultOptions: {
        queries: {
            // Cache data for 5 minutes by default
            staleTime: 5 * 60 * 1000,
            // Keep data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests 3 times
            retry: 3,
            // Retry delay with exponential backoff
            retryDelay: (attemptIndex)=>Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus for fresh data
            refetchOnWindowFocus: true,
            // Don't refetch on reconnect by default
            refetchOnReconnect: false,
            // Don't refetch on mount if data is fresh
            refetchOnMount: 'always'
        },
        mutations: {
            // Retry failed mutations once
            retry: 1,
            // Retry delay for mutations
            retryDelay: 1000
        }
    }
});
const queryKeys = {
    // Ingredients
    ingredients: [
        'ingredients'
    ],
    ingredient: (id)=>[
            'ingredients',
            id
        ],
    ingredientsByCategory: (category)=>[
            'ingredients',
            'category',
            category
        ],
    // Recipes
    recipes: [
        'recipes'
    ],
    recipe: (id)=>[
            'recipes',
            id
        ],
    recipesByCategory: (category)=>[
            'recipes',
            'category',
            category
        ],
    // Temperature
    temperatureLogs: [
        'temperature',
        'logs'
    ],
    temperatureEquipment: [
        'temperature',
        'equipment'
    ],
    temperatureThresholds: [
        'temperature',
        'thresholds'
    ],
    temperatureAnalytics: [
        'temperature',
        'analytics'
    ],
    // Performance
    performanceData: [
        'performance'
    ],
    performanceAnalytics: [
        'performance',
        'analytics'
    ],
    // User data
    userProfile: [
        'user',
        'profile'
    ],
    userSettings: [
        'user',
        'settings'
    ],
    userSubscription: [
        'user',
        'subscription'
    ],
    // Dashboard
    dashboardStats: [
        'dashboard',
        'stats'
    ],
    dashboardRecentActivity: [
        'dashboard',
        'recent-activity'
    ]
};
const invalidateQueries = {
    // Invalidate all ingredients queries
    ingredients: ()=>queryClient.invalidateQueries({
            queryKey: queryKeys.ingredients
        }),
    // Invalidate specific ingredient
    ingredient: (id)=>queryClient.invalidateQueries({
            queryKey: queryKeys.ingredient(id)
        }),
    // Invalidate all recipes queries
    recipes: ()=>queryClient.invalidateQueries({
            queryKey: queryKeys.recipes
        }),
    // Invalidate specific recipe
    recipe: (id)=>queryClient.invalidateQueries({
            queryKey: queryKeys.recipe(id)
        }),
    // Invalidate temperature data
    temperature: ()=>queryClient.invalidateQueries({
            queryKey: [
                'temperature'
            ]
        }),
    // Invalidate performance data
    performance: ()=>queryClient.invalidateQueries({
            queryKey: queryKeys.performanceData
        }),
    // Invalidate user data
    user: ()=>queryClient.invalidateQueries({
            queryKey: [
                'user'
            ]
        }),
    // Invalidate dashboard data
    dashboard: ()=>queryClient.invalidateQueries({
            queryKey: [
                'dashboard'
            ]
        })
};
const optimisticUpdates = {
    // Optimistically update ingredient
    updateIngredient: (id, updates)=>{
        queryClient.setQueryData(queryKeys.ingredient(id), (old)=>({
                ...old,
                ...updates
            }));
    },
    // Optimistically update recipe
    updateRecipe: (id, updates)=>{
        queryClient.setQueryData(queryKeys.recipe(id), (old)=>({
                ...old,
                ...updates
            }));
    },
    // Optimistically add new ingredient
    addIngredient: (newIngredient)=>{
        queryClient.setQueryData(queryKeys.ingredients, (old)=>[
                ...old || [],
                newIngredient
            ]);
    },
    // Optimistically add new recipe
    addRecipe: (newRecipe)=>{
        queryClient.setQueryData(queryKeys.recipes, (old)=>[
                ...old || [],
                newRecipe
            ]);
    }
};
const prefetchQueries = {
    // Prefetch ingredients data
    ingredients: async ()=>{
        await queryClient.prefetchQuery({
            queryKey: queryKeys.ingredients,
            queryFn: async ()=>{
                const response = await fetch('/api/ingredients');
                if (!response.ok) throw new Error('Failed to fetch ingredients');
                return response.json();
            }
        });
    },
    // Prefetch recipes data
    recipes: async ()=>{
        await queryClient.prefetchQuery({
            queryKey: queryKeys.recipes,
            queryFn: async ()=>{
                const response = await fetch('/api/recipes');
                if (!response.ok) throw new Error('Failed to fetch recipes');
                return response.json();
            }
        });
    },
    // Prefetch temperature data
    temperature: async ()=>{
        await queryClient.prefetchQuery({
            queryKey: queryKeys.temperatureLogs,
            queryFn: async ()=>{
                const response = await fetch('/api/temperature-logs');
                if (!response.ok) throw new Error('Failed to fetch temperature logs');
                return response.json();
            }
        });
    },
    // Prefetch dashboard data
    dashboard: async ()=>{
        await queryClient.prefetchQuery({
            queryKey: queryKeys.dashboardStats,
            queryFn: async ()=>{
                const response = await fetch('/api/dashboard/stats');
                if (!response.ok) throw new Error('Failed to fetch dashboard stats');
                return response.json();
            }
        });
    }
};
const backgroundSync = {
    // Sync ingredients in background
    syncIngredients: ()=>{
        queryClient.invalidateQueries({
            queryKey: queryKeys.ingredients,
            refetchType: 'active'
        });
    },
    // Sync recipes in background
    syncRecipes: ()=>{
        queryClient.invalidateQueries({
            queryKey: queryKeys.recipes,
            refetchType: 'active'
        });
    },
    // Sync temperature data in background
    syncTemperature: ()=>{
        queryClient.invalidateQueries({
            queryKey: [
                'temperature'
            ],
            refetchType: 'active'
        });
    }
};
const handleQueryError = (error, queryKey)=>{
    console.error(`Query error for ${queryKey.join('.')}:`, error);
    // Track error in analytics
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Return user-friendly error message
    if (error.message?.includes('Failed to fetch')) {
        return 'Network error. Please check your connection and try again.';
    }
    if (error.message?.includes('404')) {
        return 'Data not found. Please refresh the page.';
    }
    if (error.message?.includes('500')) {
        return 'Server error. Please try again later.';
    }
    return 'An unexpected error occurred. Please try again.';
};
const cacheUtils = {
    // Clear all cache
    clearAll: ()=>queryClient.clear(),
    // Clear specific cache
    clearByKey: (queryKey)=>queryClient.removeQueries({
            queryKey
        }),
    // Get cache size
    getCacheSize: ()=>queryClient.getQueryCache().getAll().length,
    // Get cache data
    getCacheData: (queryKey)=>queryClient.getQueryData(queryKey),
    // Set cache data
    setCacheData: (queryKey, data)=>queryClient.setQueryData(queryKey, data)
};
}),
"[project]/components/ReactQueryProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReactQueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query-devtools/build/modern/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$react$2d$query$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/react-query.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function ReactQueryProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$react$2d$query$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["queryClient"],
        children: [
            children,
            ("TURBOPACK compile-time value", "development") === 'development' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReactQueryDevtools"], {
                initialIsOpen: false
            }, void 0, false, {
                fileName: "[project]/components/ReactQueryProvider.tsx",
                lineNumber: 17,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ReactQueryProvider.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/GlobalWarning.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$GlobalWarningContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/GlobalWarningContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
const GlobalWarning = ()=>{
    const { warnings, removeWarning } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$GlobalWarningContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGlobalWarning"])();
    if (warnings.length === 0) {
        return null;
    }
    // Show only the first warning in the bar
    const warning = warnings[0];
    const getWarningStyles = (type)=>{
        switch(type){
            case 'error':
                return {
                    container: 'bg-red-900/90 border-red-700/50 text-red-100',
                    icon: 'text-red-400',
                    button: 'bg-red-800/50 hover:bg-red-700/50 text-red-100'
                };
            case 'warning':
                return {
                    container: 'bg-yellow-900/90 border-yellow-700/50 text-yellow-100',
                    icon: 'text-yellow-400',
                    button: 'bg-yellow-800/50 hover:bg-yellow-700/50 text-yellow-100'
                };
            case 'info':
                return {
                    container: 'bg-blue-900/90 border-blue-700/50 text-blue-100',
                    icon: 'text-blue-400',
                    button: 'bg-blue-800/50 hover:bg-blue-700/50 text-blue-100'
                };
            case 'success':
                return {
                    container: 'bg-green-900/90 border-green-700/50 text-green-100',
                    icon: 'text-green-400',
                    button: 'bg-green-800/50 hover:bg-green-700/50 text-green-100'
                };
            default:
                return {
                    container: 'bg-gray-900/90 border-gray-700/50 text-gray-100',
                    icon: 'text-gray-400',
                    button: 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-100'
                };
        }
    };
    const getWarningIcon = (type)=>{
        switch(type){
            case 'error':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-5 h-5",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        fillRule: "evenodd",
                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                        clipRule: "evenodd"
                    }, void 0, false, {
                        fileName: "[project]/components/GlobalWarning.tsx",
                        lineNumber: 56,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/GlobalWarning.tsx",
                    lineNumber: 55,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'warning':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-5 h-5",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        fillRule: "evenodd",
                        d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
                        clipRule: "evenodd"
                    }, void 0, false, {
                        fileName: "[project]/components/GlobalWarning.tsx",
                        lineNumber: 62,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/GlobalWarning.tsx",
                    lineNumber: 61,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'info':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-5 h-5",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        fillRule: "evenodd",
                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
                        clipRule: "evenodd"
                    }, void 0, false, {
                        fileName: "[project]/components/GlobalWarning.tsx",
                        lineNumber: 68,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/GlobalWarning.tsx",
                    lineNumber: 67,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'success':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-5 h-5",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        fillRule: "evenodd",
                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                        clipRule: "evenodd"
                    }, void 0, false, {
                        fileName: "[project]/components/GlobalWarning.tsx",
                        lineNumber: 74,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/GlobalWarning.tsx",
                    lineNumber: 73,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-5 h-5",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        fillRule: "evenodd",
                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
                        clipRule: "evenodd"
                    }, void 0, false, {
                        fileName: "[project]/components/GlobalWarning.tsx",
                        lineNumber: 80,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/GlobalWarning.tsx",
                    lineNumber: 79,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
        }
    };
    const styles = getWarningStyles(warning.type);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-full border-b backdrop-blur-sm ${styles.container}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 py-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: styles.icon,
                                children: getWarningIcon(warning.type)
                            }, void 0, false, {
                                fileName: "[project]/components/GlobalWarning.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold text-sm",
                                        children: warning.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/GlobalWarning.tsx",
                                        lineNumber: 97,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs opacity-90",
                                        children: warning.message
                                    }, void 0, false, {
                                        fileName: "[project]/components/GlobalWarning.tsx",
                                        lineNumber: 100,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/GlobalWarning.tsx",
                                lineNumber: 96,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/GlobalWarning.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2",
                        children: [
                            warning.action && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    warning.action?.onClick();
                                    removeWarning(warning.id);
                                },
                                className: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 ${styles.button}`,
                                children: warning.action.label
                            }, void 0, false, {
                                fileName: "[project]/components/GlobalWarning.tsx",
                                lineNumber: 107,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            warning.dismissible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>removeWarning(warning.id),
                                className: "p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20",
                                "aria-label": "Dismiss warning",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/components/GlobalWarning.tsx",
                                        lineNumber: 124,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/GlobalWarning.tsx",
                                    lineNumber: 123,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/GlobalWarning.tsx",
                                lineNumber: 118,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/GlobalWarning.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/GlobalWarning.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/GlobalWarning.tsx",
            lineNumber: 90,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/GlobalWarning.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = GlobalWarning;
}),
"[project]/app/webapp/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WebAppLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_5972bc34$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_5972bc34.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/LanguageSwitcher.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$CountryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/CountryContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$GlobalWarningContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/GlobalWarningContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ReactQueryProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ReactQueryProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlobalWarning$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GlobalWarning.tsx [app-ssr] (ecmascript)");
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
function WebAppLayout({ children }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [isRestaurantMenuOpen, setIsRestaurantMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Close dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClickOutside = (event)=>{
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsRestaurantMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$CountryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CountryProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$GlobalWarningContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GlobalWarningProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_5972bc34$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].className} bg-[#0a0a0a] text-white`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "bg-[#1f1f1f] border-b border-[#2a2a2a]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden md:block",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-w-7xl mx-auto px-6 py-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/webapp",
                                                className: "flex items-center space-x-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: "/images/prepflow-logo.png",
                                                    alt: "PrepFlow Logo",
                                                    width: 140,
                                                    height: 45,
                                                    className: "h-9 w-auto",
                                                    priority: true
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 51,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 50,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center space-x-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                href: "/webapp",
                                                                className: "flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-5 h-5 text-gray-400 group-hover:text-[#29E7CD] transition-colors",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                strokeLinecap: "round",
                                                                                strokeLinejoin: "round",
                                                                                strokeWidth: 2,
                                                                                d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                                lineNumber: 67,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                strokeLinecap: "round",
                                                                                strokeLinejoin: "round",
                                                                                strokeWidth: 2,
                                                                                d: "M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                                lineNumber: 68,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 66,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-300 group-hover:text-[#29E7CD] transition-colors font-medium",
                                                                        children: t('nav.dashboard', 'Dashboard')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 70,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 65,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                href: "/webapp/ingredients",
                                                                className: "flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-5 h-5 text-gray-400 group-hover:text-[#29E7CD] transition-colors",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2,
                                                                            d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 75,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 74,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-300 group-hover:text-[#29E7CD] transition-colors font-medium",
                                                                        children: t('nav.ingredients', 'Ingredients')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 77,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 73,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                href: "/webapp/recipes",
                                                                className: "flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-5 h-5 text-gray-400 group-hover:text-[#3B82F6] transition-colors",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2,
                                                                            d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 82,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 81,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-300 group-hover:text-[#3B82F6] transition-colors font-medium",
                                                                        children: t('nav.recipes', 'Recipes')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 84,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 80,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                href: "/webapp/cogs",
                                                                className: "flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-5 h-5 text-gray-400 group-hover:text-[#D925C7] transition-colors",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2,
                                                                            d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 89,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 88,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-300 group-hover:text-[#D925C7] transition-colors font-medium",
                                                                        children: t('nav.cogs', 'COGS')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 91,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 87,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                href: "/webapp/performance",
                                                                className: "flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-5 h-5 text-gray-400 group-hover:text-[#29E7CD] transition-colors",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2,
                                                                            d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 96,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 95,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-300 group-hover:text-[#29E7CD] transition-colors font-medium",
                                                                        children: t('nav.performance', 'Performance')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 98,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 94,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 64,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        ref: dropdownRef,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setIsRestaurantMenuOpen(!isRestaurantMenuOpen),
                                                                className: "flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-5 h-5 text-gray-400 group-hover:text-[#29E7CD] transition-colors",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2,
                                                                            d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 109,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 108,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-300 group-hover:text-[#29E7CD] transition-colors font-medium",
                                                                        children: t('nav.restaurant', 'Restaurant')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 111,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: `w-4 h-4 text-gray-400 transition-transform duration-200 ${isRestaurantMenuOpen ? 'rotate-180' : ''}`,
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2,
                                                                            d: "M19 9l-7 7-7-7"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 113,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 112,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 104,
                                                                columnNumber: 21
                                                            }, this),
                                                            isRestaurantMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute top-full left-0 mt-2 w-80 bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl shadow-xl z-50",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "p-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2",
                                                                            children: t('nav.operations', 'Operations')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 121,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "grid grid-cols-2 gap-2 mb-4",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                    href: "/webapp/cleaning",
                                                                                    className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-lg",
                                                                                            children: "🧹"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 124,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-gray-300 group-hover:text-[#29E7CD] transition-colors",
                                                                                            children: t('nav.cleaning', 'Cleaning')
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 125,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                                    lineNumber: 123,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                    href: "/webapp/temperature",
                                                                                    className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-lg",
                                                                                            children: "🌡️"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 128,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-gray-300 group-hover:text-[#3B82F6] transition-colors",
                                                                                            children: t('nav.temperature', 'Temperature')
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 129,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                                    lineNumber: 127,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                    href: "/webapp/compliance",
                                                                                    className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-lg",
                                                                                            children: "📋"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 132,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-gray-300 group-hover:text-[#D925C7] transition-colors",
                                                                                            children: t('nav.compliance', 'Compliance')
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 133,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                                    lineNumber: 131,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                    href: "/webapp/suppliers",
                                                                                    className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-lg",
                                                                                            children: "🚚"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 136,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-gray-300 group-hover:text-[#29E7CD] transition-colors",
                                                                                            children: t('nav.suppliers', 'Suppliers')
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 137,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                                    lineNumber: 135,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 122,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2",
                                                                            children: t('nav.inventory', 'Inventory')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 141,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "grid grid-cols-2 gap-2 mb-4",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                    href: "/webapp/par-levels",
                                                                                    className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-lg",
                                                                                            children: "📦"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 144,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-gray-300 group-hover:text-[#3B82F6] transition-colors",
                                                                                            children: t('nav.parLevels', 'Par Levels')
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 145,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                                    lineNumber: 143,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                    href: "/webapp/order-lists",
                                                                                    className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-lg",
                                                                                            children: "📋"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 148,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-gray-300 group-hover:text-[#D925C7] transition-colors",
                                                                                            children: t('nav.orderLists', 'Order Lists')
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 149,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                                    lineNumber: 147,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 142,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2",
                                                                            children: t('nav.kitchen', 'Kitchen')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 153,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "grid grid-cols-2 gap-2 mb-4",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                    href: "/webapp/dish-sections",
                                                                                    className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-lg",
                                                                                            children: "🍽️"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 156,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-gray-300 group-hover:text-[#29E7CD] transition-colors",
                                                                                            children: t('nav.dishSections', 'Dish Sections')
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 157,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                                    lineNumber: 155,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                    href: "/webapp/prep-lists",
                                                                                    className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-lg",
                                                                                            children: "📝"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 160,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-gray-300 group-hover:text-[#3B82F6] transition-colors",
                                                                                            children: t('nav.prepLists', 'Prep Lists')
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                                            lineNumber: 161,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                                    lineNumber: 159,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 154,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2",
                                                                            children: t('nav.tools', 'Tools')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 165,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "grid grid-cols-2 gap-2",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                href: "/webapp/ai-specials",
                                                                                className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-lg",
                                                                                        children: "🤖"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                                        lineNumber: 168,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-sm text-gray-300 group-hover:text-[#29E7CD] transition-colors",
                                                                                        children: t('nav.aiSpecials', 'AI Specials')
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                                        lineNumber: 169,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                                lineNumber: 167,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/layout.tsx",
                                                                            lineNumber: 166,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                    lineNumber: 120,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 119,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 103,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 62,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/webapp/setup",
                                                        className: "flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5 text-gray-400 group-hover:text-[#29E7CD] transition-colors",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 183,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 184,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 182,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-300 group-hover:text-[#29E7CD] transition-colors font-medium",
                                                                children: t('nav.setup', 'Setup')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 186,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/",
                                                        className: "text-sm text-gray-400 hover:text-[#29E7CD] transition-colors px-3 py-2 rounded-xl hover:bg-[#2a2a2a]/50",
                                                        children: t('nav.backToLanding', 'Back to Landing')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 179,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/layout.tsx",
                                        lineNumber: 48,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/layout.tsx",
                                    lineNumber: 47,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/layout.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-3 flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/webapp",
                                                className: "flex items-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: "/images/prepflow-logo.png",
                                                    alt: "PrepFlow Logo",
                                                    width: 100,
                                                    height: 32,
                                                    className: "h-6 w-auto",
                                                    priority: true
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 199,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 210,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/",
                                                        className: "text-sm text-gray-400 hover:text-[#29E7CD] transition-colors",
                                                        children: t('nav.backToLanding', 'Back to Landing')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 209,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/layout.tsx",
                                        lineNumber: 198,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-t border-[#2a2a2a]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex overflow-x-auto scrollbar-hide px-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/webapp",
                                                    className: "flex-shrink-0 px-3 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center space-y-1 min-w-[60px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-6 h-6 flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5",
                                                                    fill: "currentColor",
                                                                    viewBox: "0 0 20 20",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 225,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                    lineNumber: 224,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 223,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs",
                                                                children: t('nav.dashboard', 'Dashboard')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 228,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 222,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 221,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/webapp/ingredients",
                                                    className: "flex-shrink-0 px-3 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center space-y-1 min-w-[60px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-6 h-6 flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5",
                                                                    fill: "currentColor",
                                                                    viewBox: "0 0 20 20",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        fillRule: "evenodd",
                                                                        d: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z",
                                                                        clipRule: "evenodd"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 236,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                    lineNumber: 235,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 234,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs",
                                                                children: t('nav.ingredients', 'Ingredients')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 239,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 232,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/webapp/recipes",
                                                    className: "flex-shrink-0 px-3 py-3 text-sm hover:text-[#3B82F6] transition-colors border-b-2 border-transparent hover:border-[#3B82F6]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center space-y-1 min-w-[60px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-6 h-6 flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5",
                                                                    fill: "currentColor",
                                                                    viewBox: "0 0 20 20",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        fillRule: "evenodd",
                                                                        d: "M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2h-.01z",
                                                                        clipRule: "evenodd"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 247,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                    lineNumber: 246,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 245,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs",
                                                                children: t('nav.recipes', 'Recipes')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 250,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 244,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/webapp/cogs",
                                                    className: "flex-shrink-0 px-3 py-3 text-sm hover:text-[#D925C7] transition-colors border-b-2 border-transparent hover:border-[#D925C7]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center space-y-1 min-w-[60px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-6 h-6 flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5",
                                                                    fill: "currentColor",
                                                                    viewBox: "0 0 20 20",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        fillRule: "evenodd",
                                                                        d: "M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z",
                                                                        clipRule: "evenodd"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 258,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                    lineNumber: 257,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 256,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs",
                                                                children: t('nav.cogs', 'COGS')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 261,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/webapp/performance",
                                                    className: "flex-shrink-0 px-3 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center space-y-1 min-w-[60px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-6 h-6 flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5",
                                                                    fill: "currentColor",
                                                                    viewBox: "0 0 20 20",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        fillRule: "evenodd",
                                                                        d: "M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                                                        clipRule: "evenodd"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 269,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                    lineNumber: 268,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 267,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs",
                                                                children: t('nav.performance', 'Performance')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 272,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 266,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setIsRestaurantMenuOpen(!isRestaurantMenuOpen),
                                                    className: "flex-shrink-0 px-3 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center space-y-1 min-w-[60px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-6 h-6 flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5",
                                                                    fill: "currentColor",
                                                                    viewBox: "0 0 20 20",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        fillRule: "evenodd",
                                                                        d: "M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z",
                                                                        clipRule: "evenodd"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                                        lineNumber: 284,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                                    lineNumber: 283,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 282,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs",
                                                                children: t('nav.restaurant', 'More')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 287,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/layout.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/layout.tsx",
                                            lineNumber: 219,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/layout.tsx",
                                        lineNumber: 218,
                                        columnNumber: 13
                                    }, this),
                                    isRestaurantMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-t border-[#2a2a2a] bg-[#1f1f1f]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/webapp/cleaning",
                                                        className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "🧹"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 299,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300 group-hover:text-[#29E7CD] transition-colors",
                                                                children: t('nav.cleaning', 'Cleaning')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 300,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 298,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/webapp/temperature",
                                                        className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "🌡️"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 303,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300 group-hover:text-[#3B82F6] transition-colors",
                                                                children: t('nav.temperature', 'Temperature')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 304,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 302,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/webapp/compliance",
                                                        className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "📋"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 307,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300 group-hover:text-[#D925C7] transition-colors",
                                                                children: t('nav.compliance', 'Compliance')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 308,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 306,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/webapp/suppliers",
                                                        className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "🚚"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 311,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300 group-hover:text-[#29E7CD] transition-colors",
                                                                children: t('nav.suppliers', 'Suppliers')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 312,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 310,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/webapp/par-levels",
                                                        className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "📦"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 315,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300 group-hover:text-[#3B82F6] transition-colors",
                                                                children: t('nav.parLevels', 'Par Levels')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 316,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 314,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/webapp/order-lists",
                                                        className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "📋"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 319,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300 group-hover:text-[#D925C7] transition-colors",
                                                                children: t('nav.orderLists', 'Order Lists')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 320,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 318,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/webapp/dish-sections",
                                                        className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "🍽️"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300 group-hover:text-[#29E7CD] transition-colors",
                                                                children: t('nav.dishSections', 'Dish Sections')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 324,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 322,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/webapp/prep-lists",
                                                        className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "📝"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 327,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300 group-hover:text-[#3B82F6] transition-colors",
                                                                children: t('nav.prepLists', 'Prep Lists')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 328,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 326,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/webapp/ai-specials",
                                                        className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "🤖"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 331,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300 group-hover:text-[#29E7CD] transition-colors",
                                                                children: t('nav.aiSpecials', 'AI Specials')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 332,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/webapp/setup",
                                                        className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-all duration-200 group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "⚙️"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 335,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-300 group-hover:text-[#29E7CD] transition-colors",
                                                                children: t('nav.setup', 'Setup')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/layout.tsx",
                                                                lineNumber: 336,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/layout.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/layout.tsx",
                                                lineNumber: 297,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/layout.tsx",
                                            lineNumber: 296,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/layout.tsx",
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/layout.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/layout.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlobalWarning$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/webapp/layout.tsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "min-h-screen bg-[#0a0a0a]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ReactQueryProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/layout.tsx",
                            lineNumber: 349,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/layout.tsx",
                        lineNumber: 348,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/layout.tsx",
                lineNumber: 43,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/webapp/layout.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/webapp/layout.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__04689d4a._.js.map