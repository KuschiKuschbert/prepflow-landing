# NAVIGATION SKILL

## PURPOSE

Load when working on the webapp navigation: sidebar, header, search modal, bottom nav (mobile), navigation links, breadcrumbs, or weather widget.

## HOW IT WORKS IN THIS CODEBASE

**Navigation components in `app/webapp/components/navigation/`:**
| Component | Purpose |
|-----------|---------|
| `SidebarLink.tsx` | Individual sidebar link with prefetch on hover |
| `SearchResultsList.tsx` | Search results dropdown |
| `WeatherWidget.tsx` | Weather widget in sidebar |

**Main navigation system:**

- `app/webapp/components/ModernNavigation.tsx` — main navigation orchestrator (≤300 lines after refactor)
- `app/webapp/components/navigation/NavigationHeader.tsx` — top header bar (extracted from ModernNavigation)
- `app/webapp/components/navigation/Sidebar.tsx` — sidebar component

**Layout integration:**
`app/webapp/layout.tsx` — wraps all webapp pages with `ModernNavigation`

**Navigation features:**

- Collapsible sidebar (320px wide)
- ⌘B keyboard shortcut to toggle sidebar
- ⌘K shortcut to open search
- Breadcrumb navigation (desktop only)
- Bottom tab bar on mobile
- Prefetch on sidebar link hover

**Z-index hierarchy:**

- Header: `z-50`
- Sidebar overlay backdrop: `z-55`
- Sidebar: `z-60`
- Search modal: `z-[75]`

## STEP-BY-STEP: Add a new sidebar link

1. Open `app/webapp/components/ModernNavigation.tsx`
2. Find the `navItems` array (organized by category)
3. Add your item: `{ href: '/webapp/my-page', label: 'My Page', icon: MyIcon, category: 'core' }`
4. Import the Lucide icon
5. Add route to `lib/cache/prefetch-config.ts` for prefetch on hover
6. Restart dev server to see changes

## STEP-BY-STEP: Debug navigation not updating

1. Check `app/webapp/layout.tsx` — is navigation wrapped correctly?
2. Check that `'use client'` is at the top of ModernNavigation
3. Check `usePathname()` is being used for active state detection
4. Hard refresh the browser (navigation state may be stale)

## GOTCHAS

- **ModernNavigation is a client component** — all children that need navigation state must be client components
- **Header height CSS vars** — `--header-height-mobile: 56px`, `--header-height-desktop: 64px` are in `globals.css`. Always compensate for header height in page padding.
- **WeatherWidget** data from `GET /api/weather/current` — may return null if weather service is unavailable
- **iOS safe area** — header padding accounts for `--safe-area-inset-top` on notched devices

## REFERENCE FILES

- `app/webapp/components/ModernNavigation.tsx` — main navigation
- `app/webapp/components/navigation/SidebarLink.tsx` — link with prefetch
- `app/webapp/components/navigation/NavigationHeader.tsx` — header bar
- `app/webapp/layout.tsx` — layout that wraps navigation

## RETROFIT LOG

## LAST UPDATED

2025-02-26
