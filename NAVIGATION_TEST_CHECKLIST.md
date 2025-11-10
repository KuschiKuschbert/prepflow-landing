# Navigation System Testing Checklist

## ✅ Server Status

- Dev server running on http://localhost:3000
- No TypeScript errors
- No linter errors

## 🧪 Testing Checklist

### Mobile View (< 768px)

1. **Bottom Navigation Bar**
   - [ ] Bottom nav bar appears at bottom of screen
   - [ ] 5 items visible: Dashboard, Ingredients, Recipes, COGS, More
   - [ ] Active state shows cyan border-top on current page
   - [ ] Icons and labels are visible
   - [ ] Touch targets are at least 44px

2. **More Drawer**
   - [ ] Clicking "More" opens slide-up drawer
   - [ ] All 15 navigation items are accessible
   - [ ] Items organized by categories (Core, Operations, Inventory, Kitchen, Tools)
   - [ ] Search button works (opens search modal)
   - [ ] Clicking a nav item closes drawer and navigates
   - [ ] Backdrop tap closes drawer
   - [ ] Escape key closes drawer

3. **Header**
   - [ ] No burger menu button visible
   - [ ] Logo and search button still visible
   - [ ] Header height is correct

4. **Dashboard Page**
   - [ ] Dashboard accessible from bottom nav (first item)
   - [ ] Content doesn't overlap with bottom nav
   - [ ] Bottom padding (pb-20) provides space for nav
   - [ ] All dashboard components visible (PageHeader, QuickActions, Stats, RecentActivity)

### Desktop View (>= 768px)

1. **Persistent Sidebar**
   - [ ] Sidebar always visible on left side (256px width)
   - [ ] Dashboard is first item in "Core Features" category
   - [ ] All 15 navigation items visible
   - [ ] Items organized by categories
   - [ ] Active state highlights current page
   - [ ] Sidebar is scrollable if content is long
   - [ ] Settings section at bottom (Language, Logout)

2. **Header**
   - [ ] No burger menu button visible
   - [ ] Logo, breadcrumb, search, and settings visible
   - [ ] Header height is correct

3. **Layout**
   - [ ] Main content has left margin (ml-64) for sidebar
   - [ ] Content doesn't overlap with sidebar
   - [ ] Dashboard page fully visible

4. **Dashboard Page**
   - [ ] Dashboard accessible from sidebar (first item)
   - [ ] All dashboard components visible
   - [ ] Content properly positioned

### Cross-Platform Features

1. **Search (⌘K)**
   - [ ] Search modal opens with ⌘K on both mobile and desktop
   - [ ] Search works from More drawer on mobile
   - [ ] Search works from header on desktop

2. **Navigation**
   - [ ] All 15 items accessible on both platforms
   - [ ] Active states work correctly
   - [ ] Navigation preserves state when switching routes

3. **Responsive Breakpoint**
   - [ ] Smooth transition between mobile and desktop views at 768px
   - [ ] No layout shifts or glitches
   - [ ] Navigation adapts correctly

## 🐛 Known Issues to Watch For

- Icon rendering (some icons are SVG, some are emoji spans)
- Safe area insets on mobile devices with notches
- Sidebar collapse functionality (currently disabled, sidebar always expanded)

## 📝 Test URLs

- Dashboard: http://localhost:3000/webapp
- Ingredients: http://localhost:3000/webapp/ingredients
- Recipes: http://localhost:3000/webapp/recipes
- COGS: http://localhost:3000/webapp/cogs

## 🔍 Browser DevTools Testing

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Test at different breakpoints:
   - Mobile: 375px, 414px
   - Tablet: 768px
   - Desktop: 1024px, 1440px
