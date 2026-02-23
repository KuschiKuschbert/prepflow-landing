/**
 * Guide content definitions.
 * Written for users who cannot see the screen: detailed, step-by-step,
 * no visual assumptions. Explains where to click, what each field does, and
 * what happens after each action.
 *
 * Format: 'text' = word descriptions only. 'screenshot' format supported for later.
 */

import type { Guide } from './guide-types';

export const guides: Guide[] = [
  // --- ONBOARDING ---
  {
    id: 'getting-started',
    title: 'Getting Started with PrepFlow',
    category: 'onboarding',
    description: 'Dashboard overview, navigation, and first steps.',
    iconName: 'Rocket',
    difficulty: 'beginner',
    estimatedTime: 240,
    relatedGuideIds: ['ingredients', 'create-recipe', 'menu-builder'],
    steps: [
      {
        id: 'dashboard',
        title: 'Dashboard Overview',
        description:
          'After you sign in, you land on the Dashboard. This is your home base. Near the top you will see summary stats: ingredient count, recipe count, temperature alerts, and more. Below that are Quick Actions—links to common tasks like adding ingredients, opening recipes, or checking compliance. You can click any stat or quick action to go straight to that feature. Temperature alerts appear if any equipment is outside safe range.',
        format: 'text',
        content: {},
      },
      {
        id: 'nav',
        title: 'Navigation',
        description:
          'To move around PrepFlow, use the left sidebar or quick search. The sidebar lists sections: Dashboard, Recipes, Ingredients, Dishes, Menu Builder, COGS, Temperature, Cleaning, Compliance, Suppliers, Par Levels, Order Lists, Prep Lists, Functions, Customers, AI Specials, Recipe Sharing, Setup, and Settings. Click any item to go there. On desktop, press ⌘K (Mac) or Ctrl+K (Windows) to open quick search—type a feature name and press Enter to jump there. On mobile, use the menu button to open the sidebar.',
        format: 'text',
        content: {},
      },
      {
        id: 'first-steps',
        title: 'Recommended Order',
        description:
          'Work in this order to get the most out of PrepFlow. Step 1: Add your ingredients (name, unit, cost). Step 2: Create recipes and add ingredients to each recipe. Step 3: Build dishes from recipes or ingredients, set portions and prices. Step 4: Create dish sections and assign dishes. Step 5: Build your menu from those sections and lock it. Once you have ingredients, recipes, and dishes, COGS, performance analysis, order lists, and prep lists become useful. Start with ingredients—everything else depends on them.',
        format: 'text',
        content: {},
      },
    ],
  },

  // --- CORE DATA ---
  {
    id: 'ingredients',
    title: 'Ingredients',
    category: 'workflow',
    description: 'Add ingredients, import from CSV, filter and bulk update.',
    iconName: 'Package2',
    difficulty: 'beginner',
    estimatedTime: 240,
    relatedGuideIds: ['create-recipe', 'inventory-ordering', 'dish-builder'],
    steps: [
      {
        id: 'add-ingredient',
        title: 'Add an Ingredient',
        description:
          'Go to Ingredients from the sidebar. At the top right you will find a button labeled "Add Ingredient". Click it. A form opens. Enter the ingredient name in the first field. Tab to the unit field—choose kg, g, L, ml, each, or another unit from the dropdown. Tab to cost and enter the price per unit. Optionally choose a supplier and storage location if you have set those up. Click Save. The ingredient is added and appears in the list. You can also use "Import CSV" to add many ingredients at once—prepare a file with columns for name, unit, and cost.',
        format: 'text',
        content: {},
      },
      {
        id: 'ingredient-fields',
        title: 'Ingredient Fields',
        description:
          'Each ingredient has: Name (required), Unit (required, e.g. kg or each), Cost per unit (required), Supplier (optional—links to your suppliers for order lists), Storage location (optional—e.g. fridge, dry store), and Wastage % (optional—PrepFlow adjusts cost for trim and spill). Set supplier and storage if you want order lists grouped by supplier. Set wastage if you lose a portion—e.g. 10% wastage makes the effective cost higher. These fields affect COGS, order lists, and prep lists.',
        format: 'text',
        content: {},
      },
      {
        id: 'bulk-actions',
        title: 'Bulk Actions',
        description:
          'To change many ingredients at once: on mobile, long-press a row to enter selection mode; on desktop, use the checkbox at the start of each row to select ingredients. Select one or more rows. A bar appears with bulk actions: Bulk Update (change supplier, storage, or wastage for all selected), or Delete. Click Bulk Update, choose what to change, enter the new value, and confirm. Click Delete to remove all selected ingredients after confirming. This is faster than editing each ingredient individually.',
        format: 'text',
        content: {},
      },
    ],
  },
  {
    id: 'create-recipe',
    title: 'Recipes',
    category: 'workflow',
    description: 'Create recipes, add ingredients, view cost calculation.',
    iconName: 'FilePen',
    difficulty: 'beginner',
    estimatedTime: 300,
    relatedGuideIds: ['dish-builder', 'ingredients', 'cogs-performance'],
    steps: [
      {
        id: 'recipe-list',
        title: 'Recipe List',
        description:
          'Go to Recipes from the sidebar. You see a list of recipes—each row shows name and cost per serving. Click or tap a recipe to open it. The recipe editor has tabs: Ingredients (add and edit ingredients), Dishes (dishes that use this recipe), Menu (menu items), and COGS (cost breakdown). Switch tabs to work on different aspects. The cost updates live as you add ingredients. Use the Add Recipe button at the top to create a new recipe.',
        format: 'text',
        content: {},
      },
      {
        id: 'recipe-basics',
        title: 'Recipe Basics',
        description:
          'When creating or editing a recipe, fill in: Name (e.g. "Béchamel Sauce"), Description (optional), and Serving size (how many portions this makes—e.g. 4). There is a field for cooking instructions—add steps like "Melt butter, add flour, whisk, add milk". These instructions are for your reference. The serving size is used to calculate cost per portion. Save the recipe after entering the basics before adding ingredients.',
        format: 'text',
        content: {},
      },
      {
        id: 'add-ingredients',
        title: 'Add Ingredients',
        description:
          'In the Ingredients tab of a recipe, click "Add Ingredient". A search field appears—type an ingredient name and choose from the list. After selecting, enter the quantity and unit (e.g. 500 g). Add as many ingredients as the recipe needs. Each line shows the ingredient name, quantity, unit, and cost. The total cost updates automatically. You can edit quantities or remove ingredients. Ingredients must exist in your Ingredients list first—add them there if they do not appear in search.',
        format: 'text',
        content: {},
      },
      {
        id: 'cost-calculation',
        title: 'Cost Calculation',
        description:
          'PrepFlow calculates recipe cost from your ingredient costs. The COGS tab shows: total cost for the whole recipe, cost per serving (total divided by serving size), and a breakdown by ingredient. Each line lists ingredient name, quantity, unit cost, and line total. Use this to see which ingredients drive cost and to set dish prices. The same calculation appears when you add a recipe to a dish—the dish inherits the recipe cost.',
        format: 'text',
        content: {},
      },
    ],
  },
  {
    id: 'dish-builder',
    title: 'Dish Builder',
    category: 'workflow',
    description: 'Build dishes from recipes and ingredients. Define portions and set prices.',
    iconName: 'UtensilsCrossed',
    difficulty: 'beginner',
    estimatedTime: 300,
    relatedGuideIds: ['menu-builder', 'create-recipe', 'cogs-performance'],
    steps: [
      {
        id: 'add-to-dish',
        title: 'Add Recipes or Ingredients',
        description:
          'Go to Dish Builder from the sidebar. Open a dish or click Add Dish. On the left you see a list of recipes; on the right, the dish form. Click a recipe to add all its ingredients to the dish in one go—a dialog may ask you to confirm or adjust quantity. You can also add individual ingredients directly if they are not in a recipe. Each added item appears in the dish cost breakdown. Remove items by clicking the remove control next to each line.',
        format: 'text',
        content: {},
      },
      {
        id: 'dish-form',
        title: 'Dish Form & Portions',
        description:
          'In the dish editor: enter Dish name, Portion count (how many serves this dish makes—e.g. 1), and optional Plating notes. PrepFlow calculates total ingredient cost and cost per portion. There is a pricing tool: set a target gross profit percentage (e.g. 70%), and PrepFlow suggests a sell price. You can compare Charm pricing (psychologically appealing), Whole (round numbers), and Real (exact margin). Set the selling price you want before adding the dish to your menu.',
        format: 'text',
        content: {},
      },
      {
        id: 'cost-breakdown',
        title: 'Cost Breakdown',
        description:
          'The dish cost breakdown lists every ingredient with quantity, unit cost, and line total. The sum is total COGS. Cost per portion = total divided by portion count. You can edit quantities or remove ingredients from here. Changes update the total and per-portion cost immediately. Use this to tweak portions or swap ingredients. The breakdown helps you understand what drives the cost before setting your menu price.',
        format: 'text',
        content: {},
      },
      {
        id: 'pricing-tool',
        title: 'Pricing Tool',
        description:
          'In the dish form, find the pricing tool section. Enter a target gross profit percentage (e.g. 65% means 65% of the sell price is profit after food cost). PrepFlow shows three suggested prices: Charm (e.g. $12.95), Whole (e.g. $13.00), and Real (exact math). Choose one or type your own price. The tool shows the resulting margin for each option. Use it to keep margins consistent across your menu.',
        format: 'text',
        content: {},
      },
    ],
  },
  {
    id: 'menu-builder',
    title: 'Menu: Sections to Lock',
    category: 'workflow',
    description:
      'Create sections (Mains, Desserts), assign dishes, set prices, and lock your menu for order lists and prep lists.',
    iconName: 'LayoutPanelLeft',
    difficulty: 'beginner',
    estimatedTime: 300,
    relatedGuideIds: ['cogs-performance', 'prep-lists', 'dish-builder'],
    steps: [
      {
        id: 'create-sections',
        title: 'Create Sections',
        description:
          'Go to Dish Sections from the sidebar. You see a list of sections (e.g. Mains, Desserts, Drinks). Click "Add Section" to create one. Enter the section name and save. Use the drag handle or reorder controls to change the order—this order is used in the menu builder. Sections organise your menu. Create as many as you need: Mains, Sides, Desserts, Drinks, Kids, Specials, etc.',
        format: 'text',
        content: {},
      },
      {
        id: 'assign-dishes',
        title: 'Assign Dishes',
        description:
          'In Dish Sections, each section has an "Assign Dishes" area. Click it to open the dish picker. You see dishes from your Dish Builder. Select the dishes that belong in this section (e.g. assign "Fish and Chips" and "Steak" to Mains). Save. The assigned dishes appear under that section. These assignments feed into the Menu Builder—when you build a menu, you choose sections and their dishes appear with the prices you set.',
        format: 'text',
        content: {},
      },
      {
        id: 'organize-sections',
        title: 'Set Prices in Menu Builder',
        description:
          'Go to Menu Builder from the sidebar. You see the sections and dishes you assigned. Each dish shows its cost and has a selling price field. Enter or edit the price customers will pay. You can reorder sections and dishes within sections. The menu builder is where you set final prices. Changes here do not affect Dish Builder—only the price shown on the menu.',
        format: 'text',
        content: {},
      },
      {
        id: 'lock-menu',
        title: 'Lock Menu',
        description:
          'When your menu is final, click the Lock button. Locking prevents further edits until you unlock. A locked menu is used by: Order Lists (to know what to order), Prep Lists (to know what to prep), Performance Analysis (to compare sales and margins), and Functions (to assign menus to events). Do not lock until you are sure—unlock to make changes, then lock again.',
        format: 'text',
        content: {},
      },
    ],
  },
  {
    id: 'cogs-performance',
    title: 'COGS & Performance Analysis',
    category: 'workflow',
    description:
      "Understand cost of goods, set prices, and classify menu items by profit and popularity (Chef's Kiss, Hidden Gem, Bargain Bucket, Burnt Toast).",
    iconName: 'DollarSign',
    difficulty: 'intermediate',
    estimatedTime: 360,
    relatedGuideIds: ['menu-builder', 'dish-builder', 'create-recipe'],
    steps: [
      {
        id: 'cogs-components',
        title: 'COGS Components',
        description:
          'Cost of Goods Sold (COGS) in PrepFlow includes: ingredient cost (from your ingredient prices and recipe quantities), labor (optional—cost per serving for labour), and overhead (optional—rent, utilities, etc. allocated per serve). The COGS tab in recipes and dishes shows ingredient cost. Full COGS with labour and overhead can be configured in settings. Understanding COGS helps you set prices that cover costs and leave profit.',
        format: 'text',
        content: {},
      },
      {
        id: 'pricing',
        title: 'Setting Prices',
        description:
          'Use the pricing tool in Dish Builder to set prices. Enter a target gross profit % (e.g. 70%). PrepFlow suggests prices using Charm (psychology-friendly, e.g. $12.95), Whole (round numbers, e.g. $13.00), or Real (exact margin). Compare the three and pick what fits your brand. You can also type a custom price. The tool shows the resulting margin so you stay consistent across the menu.',
        format: 'text',
        content: {},
      },
      {
        id: 'chefs-kiss',
        title: "Chef's Kiss — High Profit, High Popularity",
        description:
          "Chef's Kiss items have above-average profit margin and above-average popularity (sales). PrepFlow calculates your menu average for profit and popularity, then classifies each item. Chef's Kiss items are your stars—feature them, put them in prime menu spots, use them as anchor items. They make money and sell well. Focus your marketing on these.",
        format: 'text',
        content: {},
      },
      {
        id: 'hidden-gem',
        title: 'Hidden Gem — High Profit, Low Popularity',
        description:
          "Hidden Gems are profitable but underperforming in sales. They have above-average margin but below-average popularity. Consider: better placement on the menu, a photo or description, a specials board mention, or staff suggestions. These items can make more money if you get them noticed. Don't let good margin go to waste.",
        format: 'text',
        content: {},
      },
      {
        id: 'bargain-burnt',
        title: 'Bargain Bucket & Burnt Toast',
        description:
          "Bargain Bucket: popular but slim margins. They sell well but don't make much profit. Options: raise the price slightly, reduce portion, or add a premium version. Burnt Toast: low profit and low popularity. Consider removing or radically changing them—new recipe, new price, or replace with something that performs better. PrepFlow's thresholds adapt to your menu, so classifications reflect your actual data.",
        format: 'text',
        content: {},
      },
    ],
  },

  // --- OPERATIONS ---
  {
    id: 'compliance-safety',
    title: 'Compliance & Safety',
    category: 'workflow',
    description:
      'Temperature monitoring, cleaning roster, and compliance records. All audit-ready for health inspectors.',
    iconName: 'ClipboardCheck',
    difficulty: 'beginner',
    estimatedTime: 420,
    relatedGuideIds: ['inventory-ordering', 'setup-settings'],
    steps: [
      {
        id: 'add-equipment',
        title: 'Add Temperature Equipment',
        description:
          "Go to Temperature from the sidebar. Click Add Equipment. Enter a name (e.g. 'Walk-in Cold', 'Main Freezer'). Choose equipment type: Cold storage (0–5°C), Freezer (-24 to -18°C), or Hot holding (≥60°C). PrepFlow applies Queensland food safety thresholds automatically based on the name and type. Save. The equipment appears in your list. You need equipment registered before you can log temperature readings.",
        format: 'text',
        content: {},
      },
      {
        id: 'log-readings',
        title: 'Log Temperature Readings',
        description:
          'In Temperature, each equipment has a Log Reading option. Enter the temperature you recorded (in Celsius) and the time if different from now. Save. Readings are stored and shown on a chart over time. Out-of-range readings are highlighted. Log regularly—daily or per shift—to spot trends and catch problems early. The charts help you see if a fridge is drifting or a freezer is struggling.',
        format: 'text',
        content: {},
      },
      {
        id: 'define-areas',
        title: 'Define Cleaning Areas & Tasks',
        description:
          'Go to Cleaning from the sidebar. First define areas (e.g. Cold Room, Prep Bench, Pass). Add an area, give it a name, save. Then add tasks to each area (e.g. "Wipe down shelves", "Mop floor"). Tasks can repeat on a schedule. The 14-day rolling calendar shows when each task is due. This structure is audit-ready for health inspectors—you can show what gets cleaned and when.',
        format: 'text',
        content: {},
      },
      {
        id: 'mark-complete',
        title: 'Track Cleaning Completion',
        description:
          'In the Cleaning roster, each task has a completion control. When you finish a task, mark it complete. The calendar updates. You can see which tasks are done, due today, or overdue. Overdue tasks stand out so you can prioritise. Use this daily—mark tasks as you go. The history of completions helps at audit time.',
        format: 'text',
        content: {},
      },
      {
        id: 'add-types',
        title: 'Add Compliance Types',
        description:
          'Go to Compliance from the sidebar. Before adding records, define compliance types (e.g. Pest Control, Council Inspection, Allergen Audit, Staff Training). Click Add Type, enter the name, save. Types help you organise and filter records. You can have as many types as you need. Records are tagged with a type when you create them.',
        format: 'text',
        content: {},
      },
      {
        id: 'add-record',
        title: 'Add a Compliance Record',
        description:
          "In Compliance, click Add Record. Choose a type from the dropdown. Enter the date of the activity. Add notes (e.g. 'Pest control completed, no issues'). Set status: Scheduled, Completed, Overdue, or Cancelled. Save. The record appears in the list. Use this for council inspections, pest control visits, training, and any activity inspectors may ask about. Keep records up to date.",
        format: 'text',
        content: {},
      },
      {
        id: 'filter-status',
        title: 'Filter and Track Compliance',
        description:
          'The Compliance list has filters. Filter by type to see only Pest Control or only Council Inspections. Filter by status to find Overdue or Completed records. Sort by date to see what is coming up. Use filters to spot gaps—e.g. overdue pest control or missing inspections. This helps you stay audit-ready and avoid last-minute scrambles.',
        format: 'text',
        content: {},
      },
    ],
  },

  // --- PLANNING ---
  {
    id: 'inventory-ordering',
    title: 'Inventory & Ordering',
    category: 'workflow',
    description:
      'Suppliers, price lists, par levels, and order list generation. The full ordering workflow.',
    iconName: 'Truck',
    difficulty: 'beginner',
    estimatedTime: 420,
    relatedGuideIds: ['ingredients', 'prep-lists', 'compliance-safety'],
    steps: [
      {
        id: 'add-suppliers',
        title: 'Add Suppliers',
        description:
          'Go to Suppliers from the sidebar. Click Add Supplier. Enter supplier name, contact name, phone, email, and optional address. Save. Each supplier can have multiple price lists (e.g. weekly specials, standard list). Suppliers are used when you link ingredients to prices and when you generate order lists—PrepFlow groups order items by supplier. Add all your main suppliers first.',
        format: 'text',
        content: {},
      },
      {
        id: 'price-lists',
        title: 'Create Price Lists',
        description:
          'In Suppliers, open a supplier. Click Add Price List. Give it a name (e.g. "Standard", "Weekly Special"). Save. In the price list, link ingredients: search for an ingredient, enter the price from this supplier, save. Each ingredient can be linked to one or more suppliers and price lists. These links drive order list generation and COGS when you use supplier-specific pricing. Update prices when they change.',
        format: 'text',
        content: {},
      },
      {
        id: 'set-par',
        title: 'Set Par Levels',
        description:
          'Go to Par Levels from the sidebar. Each ingredient can have a par level (minimum stock you want to keep) and a reorder point (stock level that triggers "time to order"). Enter par and reorder for each ingredient. When you generate an order list, PrepFlow suggests quantities to bring stock up to par, based on current stock (you enter or import stock levels). Set par levels for ingredients you order regularly.',
        format: 'text',
        content: {},
      },
      {
        id: 'low-stock',
        title: 'Track Low Stock',
        description:
          'The Par Levels page shows ingredients below par or near reorder point. Filter or sort to see what needs ordering. Use this list when creating order lists—focus on low-stock items first. Update par levels as your usage changes (e.g. busier seasons). Low-stock visibility helps you avoid running out of key ingredients.',
        format: 'text',
        content: {},
      },
      {
        id: 'generate-order',
        title: 'Generate Order',
        description:
          'Go to Order Lists from the sidebar. Choose a supplier from the dropdown. PrepFlow uses par levels, reorder points, and current stock to suggest quantities for each ingredient linked to that supplier. You can generate for a specific date. Review the suggested list—quantities are calculated to bring stock up to par. Adjust as needed (e.g. add extra for a busy weekend) before finalising.',
        format: 'text',
        content: {},
      },
      {
        id: 'adjust-send',
        title: 'Adjust and Send',
        description:
          'After generating an order list, you see a list of ingredients with suggested quantities. Edit any quantity—type a new number or remove the line. When ready, you can export (PDF or print) or copy the list to send to your supplier. Some workflows support sending directly. Always double-check quantities before sending. Save or export the order for your records.',
        format: 'text',
        content: {},
      },
    ],
  },
  {
    id: 'prep-lists',
    title: 'Prep Lists',
    relatedGuideIds: ['inventory-ordering', 'menu-builder', 'functions-catering'],
    category: 'workflow',
    description: 'Generate prep lists from menu and schedule. Plan what to prep and when.',
    iconName: 'ClipboardList',
    difficulty: 'beginner',
    estimatedTime: 180,
    steps: [
      {
        id: 'generate-prep',
        title: 'Generate Prep List',
        description:
          'Go to Prep Lists from the sidebar. Select a date. Choose which menu or function to base the list on (locked menu, or a specific event). PrepFlow combines: menu sections, dishes in each section, ingredient quantities from recipes, and portions needed. It aggregates totals across all dishes. Click Generate. The list shows every ingredient with total quantity to prep for that day.',
        format: 'text',
        content: {},
      },
      {
        id: 'review-quantities',
        title: 'Review Quantities',
        description:
          'The prep list shows ingredient names and quantities. Quantities are summed—e.g. if three dishes use "Tomatoes", you see total tomatoes needed. Review the list before prep: you may want to round up (e.g. 2.3 kg to 2.5 kg) or adjust for waste. Use the list in the kitchen to know what to prep and how much. Export or print for your team.',
        format: 'text',
        content: {},
      },
    ],
  },
  {
    id: 'functions-catering',
    title: 'Functions & Customers',
    category: 'workflow',
    description:
      'Plan catering events, manage customers, track costs per head. Generate prep lists and order lists per function.',
    iconName: 'CalendarDays',
    difficulty: 'beginner',
    estimatedTime: 300,
    relatedGuideIds: ['menu-builder', 'prep-lists', 'ai-sharing'],
    steps: [
      {
        id: 'add-customers',
        title: 'Add Customers',
        description:
          'Go to Customers from the sidebar. Click Add Customer. Enter: name, email, phone, and optional notes. Save. Customers are useful for functions—when you create an event, you can assign a customer. This links the event to their record. Add recurring clients, event organisers, and catering contacts. The customer list helps you find contacts and track who you have worked with.',
        format: 'text',
        content: {},
      },
      {
        id: 'create-event',
        title: 'Create an Event',
        description:
          'Go to Functions from the sidebar. Click Add Function or Add Event. Enter: event name, date, headcount (number of guests), and optional customer (search or add from Customers). Assign a menu—choose from your locked menus. PrepFlow calculates total cost from the menu COGS and headcount. Save. The event appears in the list. You can then generate a prep list and order list specific to this event.',
        format: 'text',
        content: {},
      },
      {
        id: 'track-costs',
        title: 'Track Costs & Generate Preps',
        description:
          'Each function shows cost per head (total menu cost divided by headcount). Use this to price catering or check margins. From the function, you can generate a prep list (what to prep for that event) and an order list (what to order). These are based on the assigned menu and headcount. Generate them when you are ready to execute the event.',
        format: 'text',
        content: {},
      },
      {
        id: 'link-events',
        title: 'Link Customers to Functions',
        description:
          'When creating a function or event, there is a customer field. Search by name or email to find an existing customer, or add a new one. Assigning a customer links the event to their record. You can then see all events for that customer—useful for repeat bookings and relationship management. Customers with no events yet appear in the list; add events to build their history.',
        format: 'text',
        content: {},
      },
    ],
  },

  // --- TOOLS ---
  {
    id: 'ai-sharing',
    title: 'AI Specials & Recipe Sharing',
    category: 'workflow',
    description:
      'Generate AI-suggested specials and share recipes with other PrepFlow users. For franchises and kitchen teams.',
    iconName: 'Sparkles',
    difficulty: 'beginner',
    estimatedTime: 180,
    relatedGuideIds: ['create-recipe', 'functions-catering', 'menu-builder'],
    steps: [
      {
        id: 'generate-specials',
        title: 'Generate AI Specials',
        description:
          'Go to AI Specials from the sidebar. Click Generate Specials. PrepFlow uses AI to suggest daily or weekly specials based on your menu, ingredient availability, and performance data. Review the suggestions—you can edit names, descriptions, or swap items. When happy, publish. The specials appear for your team to use. Regenerate when you want fresh ideas or new inventory.',
        format: 'text',
        content: {},
      },
      {
        id: 'share-recipe',
        title: 'Share a Recipe',
        description:
          'Open a recipe. Look for the Share option (often in the recipe menu or actions). Enter the recipient email address—they must have a PrepFlow account. Click Share. The recipe is sent to their account. They will see it in their Recipes list. Useful for franchises, multi-location kitchens, or sharing with a colleague. The shared recipe includes ingredients and quantities.',
        format: 'text',
        content: {},
      },
    ],
  },

  // --- SETUP & SETTINGS ---
  {
    id: 'setup-settings',
    title: 'Setup & Settings',
    relatedGuideIds: ['getting-started', 'compliance-safety', 'ingredients'],
    category: 'workflow',
    description:
      'Equipment types, test data, profile, preferences, and billing. Everything to configure PrepFlow.',
    iconName: 'Settings',
    difficulty: 'beginner',
    estimatedTime: 300,
    steps: [
      {
        id: 'equipment-types',
        title: 'Equipment Types (Setup)',
        description:
          'Go to Setup from the sidebar. Equipment Types define categories for temperature equipment and cleaning (e.g. Fridge, Freezer, Hot Hold, Prep Area). Add types as needed. These types are used when you register temperature equipment and define cleaning areas. Set them up before adding equipment or cleaning tasks. Requires admin access in development.',
        format: 'text',
        content: {},
      },
      {
        id: 'populate-data',
        title: 'Populate Test Data',
        description:
          "In Setup, there are buttons to populate test data: ingredients, recipes, dishes, suppliers, etc. Use this for demos or to explore PrepFlow with sample data. Populate replaces existing data. There is also Reset Self—deletes only your account's data so you can start fresh. Both require the admin key in development. In production, these may be disabled or restricted.",
        format: 'text',
        content: {},
      },
      {
        id: 'profile',
        title: 'Profile (Settings)',
        description:
          'Go to Settings from the sidebar. The Profile section lets you update your name, email, and avatar. Keep these current—your email is used for account recovery and notifications. Changes save immediately. If you use Auth0 or another provider, some fields may be read-only and updated through that provider.',
        format: 'text',
        content: {},
      },
      {
        id: 'preferences',
        title: 'Preferences',
        description:
          'In Settings, the Preferences section controls: notification settings (email, in-app), language, timezone, and other UI options. Set your timezone so dates and times display correctly. Adjust notifications so you get alerts for temperature issues or compliance without being overwhelmed. Changes apply as soon as you save.',
        format: 'text',
        content: {},
      },
      {
        id: 'billing',
        title: 'Billing',
        description:
          'In Settings, the Billing section shows your subscription: current plan (Starter, Pro, Business), status, and next billing date. Click Manage Subscription to open the Stripe customer portal—there you can upgrade, downgrade, update payment method, or cancel. Invoice history is available. Billing is handled by Stripe; your card is never stored in PrepFlow.',
        format: 'text',
        content: {},
      },
    ],
  },
];

/**
 * Get all guides.
 */
export function getAllGuides(): Guide[] {
  return guides;
}

/**
 * Get guide by ID.
 */
export function getGuideById(id: string): Guide | undefined {
  return guides.find(guide => guide.id === id);
}

/**
 * Get guides by category.
 */
export function getGuidesByCategory(category: Guide['category']): Guide[] {
  return guides.filter(guide => guide.category === category);
}

/**
 * Get related guides for a guide by ID.
 * Returns up to 4 guides that exist and are not the current guide.
 */
export function getRelatedGuides(guideId: string): Guide[] {
  const guide = getGuideById(guideId);
  const ids = guide?.relatedGuideIds ?? [];
  return ids
    .map(id => getGuideById(id))
    .filter((g): g is Guide => g != null && g.id !== guideId)
    .slice(0, 4);
}

/**
 * Search guides by title or description.
 */
export function searchGuides(query: string): Guide[] {
  const lowerQuery = query.toLowerCase();
  return guides.filter(
    guide =>
      guide.title.toLowerCase().includes(lowerQuery) ||
      guide.description.toLowerCase().includes(lowerQuery),
  );
}
