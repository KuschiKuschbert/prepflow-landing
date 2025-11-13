# Screenshot Assignments for Landing Page

## Overview

This document maps the new screenshots to their appropriate locations on the landing page.

## Screenshot Files

### 1. Dashboard Screenshot

- **File:** `/images/dashboard-screenshot.png`
- **Content:** Kitchen Management Dashboard showing Quick Actions, Summary Statistics (Total Ingredients: 40, Total Recipes: 10, Avg. Dish Price: $0.00), and Recent Activity section
- **Used in:**
  - Hero section (large, centered, full-width)
  - Highlights section: "AI-Powered Analysis" card
  - Highlights section: "Real-Time Monitoring" card
  - Highlights section: "Performance Analytics" card
  - Closer Look section: "Performance Analysis" feature
  - Closer Look section: "Temperature Monitoring" feature

### 2. COGS Calculator Screenshot

- **File:** `/images/cogs-calculator-screenshot.png`
- **Content:** COGS Calculator interface showing "Recipe & Ingredients" section (left) with recipe selection, portions input, ingredients list, and "Cost Analysis" section (right) with ingredient cost table, total COGS, costing tool with target gross profit percentages, and recommended selling price
- **Used in:**
  - Closer Look section: "COGS Calculator" feature

### 3. Ingredients Management Screenshot

- **File:** `/images/ingredients-management-screenshot.png`
- **Content:** Ingredients Management table showing search bar, filters (Supplier, Storage, Sort), action buttons (Add, Import, Export), and detailed ingredients table with columns: Name, Brand, Pack Size, Cost/Unit, Supplier, Stock, and Actions
- **Used in:**
  - Highlights section: "Ingredients Management" card
  - Closer Look section: "Ingredients & Stock" feature

### 4. Recipe Book Screenshot (NEW)

- **File:** `/images/recipe-book-screenshot.png`
- **Content:** Recipe Book interface showing "How Recipe Book Works" section (Manual Recipes vs From COGS Calculations), navigation tabs (Recipes, Dishes), action buttons (Add Recipe, Refresh Recipes), and recipes table with columns: NAME, RECOMMENDED PRICE, PROFIT MARGIN, CONTRIBUTING MARGIN, CREATED, ACTIONS
- **Used in:**
  - Highlights section: "Recipe Management" card
  - Closer Look section: "Recipe Book" feature (NEW)

### 5. Cleaning Roster Screenshot

- **File:** `/images/cleaning-roster-screenshot.png`
- **Content:** Cleaning Roster showing cleaning areas and task management
- **Used in:**
  - Closer Look section: "Cleaning & Compliance" feature

### 6. Performance Analysis Screenshot (NEW)

- **File:** `/images/performance-analysis-screenshot.png`
- **Content:** Performance Analysis Dashboard showing KPIs (Average GP, Food Cost %, Average Item Profit, Average Sale Price), Chef's Kiss and Bargain Bucket categorization tables, popularity donut chart, scatter plot analysis (Gross Profit % vs Popularity), and contributing profit margin bar chart
- **Used in:**
  - Highlights section: "Performance Analytics" card
  - Closer Look section: "Performance Analysis" feature
  - Product Features section: "Performance Analysis" feature

### 7. Temperature Monitoring Screenshot (NEW)

- **File:** `/images/temperature-monitoring-screenshot.png`
- **Content:** Temperature Monitoring Analytics dashboard showing equipment status cards color-coded by status (Green: In Range, Red: Out of Range, Yellow: Setup Required, Grey: No Data), with navigation tabs (Logs, Equipment, Analytics) and time range filters
- **Used in:**
  - Highlights section: "Real-Time Monitoring" card
  - Closer Look section: "Temperature Monitoring" feature
  - Product Features section: "Temperature Monitoring" feature

### 8. Settings Screenshot

- **File:** `/images/settings-screenshot.png`
- **Content:** Settings page with region & units configuration and privacy controls
- **Used in:**
  - Closer Look section: "Settings & Configuration" feature

## Component Assignments

### Hero Component (`app/components/landing/Hero.tsx`)

- Uses: `dashboard-screenshot.png`
- Purpose: Large hero image showcasing the main dashboard

### Highlights Component (`app/components/landing/Highlights.tsx`)

- **Ingredients Management:** `ingredients-management-screenshot.png`
- **AI-Powered Analysis:** `dashboard-screenshot.png`
- **Real-Time Monitoring:** `temperature-monitoring-screenshot.png` ✅ UPDATED
- **Recipe Management:** `recipe-book-screenshot.png` ✅ UPDATED
- **Performance Analytics:** `performance-analysis-screenshot.png` ✅ UPDATED

### Closer Look Component (`app/components/landing/CloserLook.tsx`)

- **Ingredients & Stock:** `ingredients-management-screenshot.png`
- **COGS Calculator:** `cogs-calculator-screenshot.png`
- **Recipe Book:** `recipe-book-screenshot.png` ✅ NEW FEATURE ADDED
- **Performance Analysis:** `performance-analysis-screenshot.png` ✅ UPDATED
- **Cleaning & Compliance:** `cleaning-roster-screenshot.png`
- **Temperature Monitoring:** `temperature-monitoring-screenshot.png` ✅ UPDATED
- **Settings & Configuration:** `settings-screenshot.png`

### Product Features Component (`app/components/landing/ProductFeatures.tsx`)

- **Dashboard:** `dashboard-screenshot.png`
- **Recipes:** `cogs-calculator-screenshot.png`
- **Performance Analysis:** `performance-analysis-screenshot.png` ✅ UPDATED
- **Temperature Monitoring:** `temperature-monitoring-screenshot.png` ✅ UPDATED
- **Ingredients & Stock:** `ingredients-management-screenshot.png`

## Next Steps

1. **Add New Screenshot Files:**
   - **Recipe Book:** Save as `/public/images/recipe-book-screenshot.png`
   - **Performance Analysis:** Save as `/public/images/performance-analysis-screenshot.png`
   - **Temperature Monitoring:** Save as `/public/images/temperature-monitoring-screenshot.png`
   - Recommended size: 1200x800px (3:2 aspect ratio) for features, 1920x1080 for hero
   - Optimize for web (compress PNG or convert to WebP/AVIF)

2. **Verify All Screenshots:**
   - Ensure all screenshot files exist in `/public/images/`
   - Test that images load correctly on the landing page
   - Check responsive behavior on mobile devices

3. **Optional Optimizations:**
   - Create WebP versions for better performance
   - Create AVIF versions for modern browsers
   - Add proper alt text for accessibility

## Summary of Changes

✅ **Updated Highlights.tsx:**

- Changed "Recipe Management" card to use `recipe-book-screenshot.png` instead of `cogs-calculator-screenshot.png`
- Changed "Real-Time Monitoring" card to use `temperature-monitoring-screenshot.png` instead of `dashboard-screenshot.png`

✅ **Updated CloserLook.tsx:**

- Added new "Recipe Book" feature with `recipe-book-screenshot.png`
- Updated "Performance Analysis" feature to use `performance-analysis-screenshot.png` instead of `dashboard-screenshot.png`
- Updated "Temperature Monitoring" feature to use `temperature-monitoring-screenshot.png` instead of `dashboard-screenshot.png`
- Kept "COGS Calculator" feature separate (for building recipes)
- Now has 7 features total (was 6)

✅ **Updated Highlights.tsx:**

- Changed "Performance Analytics" card to use `performance-analysis-screenshot.png` instead of `dashboard-screenshot.png`

✅ **Updated ProductFeatures.tsx:**

- Changed "Performance Analysis" to use `performance-analysis-screenshot.png` instead of `dashboard-screenshot.png`
- Changed "Temperature Monitoring" to use `temperature-monitoring-screenshot.png` instead of `dashboard-screenshot.png`

✅ **Updated Documentation:**

- Updated `SCREENSHOT_ASSIGNMENTS.md` with complete mapping including Temperature Monitoring
