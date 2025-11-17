# Screenshot Mapping for Apple-Style Landing Page

## Current Screenshot Usage

### Hero Section

- **Dashboard Screenshot** → `/images/dashboard-screenshot.png`
  - Shows: Kitchen Management Dashboard with quick actions and statistics
  - Used in: Hero section (large, full-width)

### Highlights Section (5 Cards)

1. **Ingredients Management** → `/images/stocklist-screenshot.png`
   - Shows: Ingredients table with costs, suppliers, stock levels

2. **AI-Powered Analysis** → `/images/dashboard-screenshot.png`
   - Shows: Dashboard with analytics and insights

3. **Real-Time Monitoring** → `/images/dashboard-screenshot.png`
   - Shows: Dashboard with monitoring features

4. **Recipe Management** → `/images/recipe-screenshot.png`
   - Shows: Recipe costing and management

5. **Performance Analytics** → `/images/dashboard-screenshot.png`
   - Shows: Performance metrics and analytics

### Take a Closer Look Section (6 Expandable Features)

1. **Ingredients & Stock** → `/images/stocklist-screenshot.png`
   - Shows: Ingredients Management interface

2. **COGS Calculator** → `/images/recipe-screenshot.png`
   - Shows: Create Dish and Cost Analysis sections

3. **Performance Analysis** → `/images/dashboard-screenshot.png`
   - Shows: Performance metrics and menu classifications

4. **Cleaning & Compliance** → `/images/dashboard-screenshot.png` ⚠️ **PLACEHOLDER**
   - **Note:** Currently using dashboard screenshot as placeholder
   - **Ideal:** Should use cleaning roster screenshot showing cleaning areas and tasks

5. **Temperature Monitoring** → `/images/dashboard-screenshot.png`
   - Shows: Temperature monitoring interface

6. **Settings & Configuration** → `/images/settings-screenshot.png`
   - Shows: Settings page with region & units, privacy controls

## Missing Screenshots

### Recommended to Add:

- **Cleaning Roster Screenshot** (`cleaning-screenshot.png`)
  - Should show: Cleaning areas with cards, task management interface
  - Will replace: Dashboard screenshot placeholder in "Cleaning & Compliance" section

### Optional to Add:

- **Temperature Monitoring Screenshot** (`temperature-screenshot.png`)
  - Should show: Temperature monitoring dashboard with equipment tracking
  - Will replace: Dashboard screenshot in "Temperature Monitoring" section

- **Performance Analysis Screenshot** (`performance-screenshot.png`)
  - Should show: Performance analysis with menu item classifications
  - Will replace: Dashboard screenshot in "Performance Analysis" section

## How to Add New Screenshots

1. **Capture Screenshot:**
   - Take a screenshot of the specific feature
   - Ensure high resolution (minimum 1200x800 for expandable sections, 1920x1080 for hero)
   - Use dark theme to match site aesthetic

2. **Optimize Image:**
   - Convert to WebP format for better performance
   - Compress to reduce file size
   - Ensure proper aspect ratio (3:2 for features, 16:9 for hero)

3. **Add to Project:**
   - Place in `public/images/` directory
   - Name according to feature (e.g., `cleaning-screenshot.png`)
   - Update component reference in `app/components/landing/CloserLook.tsx`

4. **Update Component:**
   - Update the `screenshot` property in the features array
   - Update the `screenshotAlt` text for accessibility
   - Test the expandable section to ensure image displays correctly

## Current Status

✅ **All existing screenshots are being used correctly**
✅ **Components are mapped to appropriate screenshots**
⚠️ **Cleaning Roster uses dashboard as placeholder** (ready to replace when screenshot is available)
