# Fix High-Priority Responsive Action Buttons

## Overview

Fix the two high-priority items from the responsive action buttons audit:

1. **CurbOS Modifiers Page** - Apply 3-dot menu pattern (like MenuItemCard)
2. **Menu Item Actions (Menu Builder)** - Add mobile-accessible 3-dot menu (currently hover-only)

## Reference Pattern

**File**: `app/curbos/components/MenuItemCard.tsx`

**Pattern**:

- **Desktop (tablet+)**: Hover overlay with Edit/Delete buttons (`hidden tablet:flex`)
- **Mobile (< tablet)**: 3-dot menu (MoreVertical icon) that expands (`tablet:hidden`)

## Implementation Tasks

### Task 1: Fix CurbOS Modifiers Page

**File**: `app/curbos/modifiers/page.tsx`

**Current Issue**: Inline buttons (lines 166-169) with no responsive handling

**Solution**: Create a `ModifierCard` component similar to `MenuItemCard` with:

- Desktop: Hover overlay or always-visible buttons
- Mobile: 3-dot menu (MoreVertical) that expands

**Steps**:

1. Create `app/curbos/components/ModifierCard.tsx` based on `MenuItemCard.tsx` pattern
2. Extract modifier item rendering into the new component
3. Update `modifiers/page.tsx` to use `ModifierCard` component
4. Ensure consistent styling with CurbOS design system

**Component Structure**:

```tsx
interface ModifierCardProps {
  item: ModifierOption;
  onEdit: () => void;
  onDelete: () => void;
}

// Desktop: Hover overlay or always-visible buttons
// Mobile: 3-dot menu (MoreVertical)
```

### Task 2: Fix Menu Item Actions (Menu Builder)

**File**: `app/webapp/menu-builder/components/SortableMenuItem/components/MenuItemActions.tsx`

**Current Issue**: Actions hidden on mobile (line 55: `desktop:opacity-0 desktop:group-hover:opacity-100` and `opacity-0 group-hover:opacity-100`)

**Solution**: Add mobile-accessible 3-dot menu that shows actions on mobile/touch devices

**Steps**:

1. Add state for mobile menu (`showMobileMenu`)
2. Add mobile 3-dot menu (MoreVertical icon) that's always visible on mobile
3. Keep desktop hover behavior (opacity transitions)
4. Mobile menu should include all actions:
   - Reorder dropdown (if available)
   - Category dropdown (if available)
   - Edit Region button (if available)
   - Remove button
5. Ensure proper z-index and positioning

**Implementation Pattern**:

```tsx
// Desktop: Hover overlay (existing)
<div className="desktop:opacity-0 desktop:group-hover:opacity-100 ...">
  {/* Existing desktop actions */}
</div>

// Mobile: 3-dot menu (new)
<div className="tablet:hidden ...">
  {!showMobileMenu ? (
    <button onClick={() => setShowMobileMenu(true)}>
      <MoreVertical />
    </button>
  ) : (
    <div className="flex items-center gap-2 ...">
      {/* All action buttons */}
      <button onClick={() => setShowMobileMenu(false)}>
        <X />
      </button>
    </div>
  )}
</div>
```

## Files to Modify

1. **Create**: `app/curbos/components/ModifierCard.tsx`
2. **Modify**: `app/curbos/modifiers/page.tsx`
3. **Modify**: `app/webapp/menu-builder/components/SortableMenuItem/components/MenuItemActions.tsx`

## Design Considerations

### CurbOS ModifierCard

- Match CurbOS design system (neutral-800/900 backgrounds, #C0FF02 accents)
- Use same hover effects and transitions as MenuItemCard
- Maintain existing modifier item layout (icon, name, type, price)

### Menu Builder MenuItemActions

- Match PrepFlow design system (CSS variables)
- Keep desktop hover behavior unchanged
- Mobile menu should be compact but accessible
- All actions must be accessible on mobile

## Testing Checklist

- [ ] CurbOS Modifiers: Desktop hover overlay works
- [ ] CurbOS Modifiers: Mobile 3-dot menu expands and closes
- [ ] CurbOS Modifiers: Edit and Delete actions work on both desktop and mobile
- [ ] Menu Builder: Desktop hover behavior unchanged
- [ ] Menu Builder: Mobile 3-dot menu shows all actions
- [ ] Menu Builder: All actions (reorder, category, edit region, remove) work on mobile
- [ ] Menu Builder: Mobile menu closes after action
- [ ] Both components: Touch targets are 44px minimum
- [ ] Both components: No layout shifts or truncation on mobile
