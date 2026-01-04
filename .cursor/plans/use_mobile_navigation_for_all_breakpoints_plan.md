# Use Mobile Navigation for All Breakpoints

## Problem

The user likes the mobile topbar/navigation (icon-only, compact style) and wants to use it for all breakpoints instead of showing labels on tablet/desktop.

## Solution

Simplify the navigation to use icon-only style across all breakpoints, removing responsive label visibility and keeping the compact mobile-style layout.

## Changes Required

### File: `app/curbos/components/NavLink.tsx`

1. **Remove responsive label logic**: Remove the tablet and desktop label spans (lines 22-24)
2. **Simplify layout**: Change from `flex-col tablet:flex-col desktop:flex-row` to just `flex-col` (always vertical icon layout)
3. **Simplify padding**: Remove responsive padding, use consistent compact padding for all breakpoints
4. **Keep icon-only**: Only show the icon, use `title` attribute for tooltip on hover

### File: `app/curbos/CurbOSLayoutClient.tsx`

1. **Simplify logo section**: Remove responsive text visibility, keep icon-only or minimal text
2. **Simplify navigation container**: Remove responsive max-width constraints, keep compact scrollable nav
3. **Simplify navigation padding**: Use consistent compact padding for all breakpoints
4. **Enhance right buttons**: Make "Back to PrepFlow" and "Logout" buttons more visible:
   - Show text labels on all breakpoints (not just desktop)
   - Increase button size/padding for better visibility
   - Make them more prominent with better styling
   - Keep icons but add visible text labels
5. **Simplify header padding**: Use consistent compact padding for all breakpoints

## Implementation Details

- **NavLink**: Icon-only with tooltip (`title` attribute) for accessibility
- **Header**: Compact, icon-only navigation bar that works well on all screen sizes
- **Navigation**: Horizontal scrollable icon-only nav (like mobile) for all breakpoints
- **Right buttons**: Enhanced visibility for "Back to PrepFlow" and "Logout":
  - Show icon + text label on all breakpoints
  - Increase padding and button size for better touch targets
  - More prominent styling (better contrast, hover effects)
  - Clear visual hierarchy
- **Logo**: Keep icon, optionally show minimal text but keep it compact

## Expected Result

A clean, icon-only navigation bar that works consistently across all screen sizes, maintaining the mobile-style compact layout. The "Back to PrepFlow" and "Logout" buttons will be more visible and prominent with text labels on all breakpoints, taking advantage of the space saved by the compact navigation.
