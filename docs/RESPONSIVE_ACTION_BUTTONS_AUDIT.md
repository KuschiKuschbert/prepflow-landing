# Responsive Action Buttons Audit Report

**Date**: 2025-01-XX
**Pattern Reference**: `app/curbos/components/MenuItemCard.tsx`

## Executive Summary

This audit identifies all components with action buttons (edit/delete) and evaluates their responsive handling. The reference pattern from `MenuItemCard` uses:

- **Desktop (tablet+)**: Hover overlay with Edit/Delete buttons (`hidden tablet:flex`)
- **Mobile (< tablet)**: 3-dot menu (MoreVertical icon) that expands to show Edit/Delete (`tablet:hidden`)

## Current Pattern (Reference)

**File**: `app/curbos/components/MenuItemCard.tsx`

**Pattern**:

- Desktop: Hover overlay with Edit/Delete buttons (lines 45-60)
- Mobile: 3-dot menu (MoreVertical) that expands (lines 62-96)
- Breakpoint: `tablet:` (481px+) for desktop, base styles for mobile

## Audit Results

### 1. CurbOS Pages

#### ✅ Menu Items Page (`app/curbos/page.tsx`)

- **Status**: ✅ **IMPLEMENTED** - Uses `MenuItemCard` component with 3-dot menu pattern
- **Action Buttons**: Edit, Delete
- **Responsive Handling**: ✅ Desktop hover overlay, mobile 3-dot menu
- **Priority**: N/A (already implemented)

#### ❌ Modifiers Page (`app/curbos/modifiers/page.tsx`)

- **Status**: ❌ **NEEDS FIX** - Uses inline buttons (lines 166-169)
- **Action Buttons**: Edit, Delete
- **Current Implementation**:
  ```tsx
  <div className="flex gap-2">
    <button onClick={() => openModal(item)} className="bg-neutral-700... px-4 py-2">
      EDIT
    </button>
    <button onClick={() => handleDelete(item.id)} className="bg-red-900/20... p-2">
      <Trash2 />
    </button>
  </div>
  ```
- **Issues**:
  - Buttons always visible (no responsive breakpoints)
  - May be truncated on mobile
  - No mobile-specific menu pattern
- **Priority**: 🔴 **HIGH** - Same pattern as Menu Items, should be consistent

#### ✅ Customers Page (`app/curbos/customers/page.tsx`)

- **Status**: ✅ **NO ACTION BUTTONS** - Display-only page
- **Action Buttons**: None
- **Priority**: N/A

#### ✅ Kitchen Page (`app/curbos/kitchen/page.tsx`)

- **Status**: ✅ **NO ACTION BUTTONS** - Status update buttons only (not edit/delete)
- **Action Buttons**: Status update (bump order)
- **Priority**: N/A

#### ✅ Display Page (`app/curbos/display/page.tsx`)

- **Status**: ✅ **NO ACTION BUTTONS** - Customer-facing display only
- **Action Buttons**: None
- **Priority**: N/A

#### ✅ Stats Page (`app/curbos/stats/page.tsx`)

- **Status**: ✅ **NO ACTION BUTTONS** - Display-only analytics page
- **Action Buttons**: None
- **Priority**: N/A

### 2. PrepFlow Webapp - Table Rows

#### ⚠️ Recipe Table Row (`app/webapp/recipes/components/RecipeTableRow.tsx`)

- **Status**: ⚠️ **PARTIAL** - Action buttons in table cell (lines 157-184)
- **Action Buttons**: Preview (Eye), Edit, Delete
- **Current Implementation**:
  ```tsx
  <td className="whitespace-nowrap px-6 py-4 text-sm">
    <div className="flex gap-2">
      <button>
        <Icon icon={Eye} />
      </button>
      <button>
        <Icon icon={Edit} />
      </button>
      <button>
        <Icon icon={Trash2} />
      </button>
    </div>
  </td>
  ```
- **Layout Strategy**: Tables switch to card layouts on mobile (`desktop:hidden` for table, `desktop:block hidden` for cards)
- **Issues**:
  - Action buttons always visible in table cell
  - Mobile cards may handle actions differently (need to verify)
- **Priority**: 🟡 **MEDIUM** - Tables switch to cards on mobile, but table row buttons may still be visible

#### ⚠️ Dish Table Row (`app/webapp/recipes/components/DishTableRow.tsx`)

- **Status**: ⚠️ **PARTIAL** - Action buttons in table cell (lines 130-150)
- **Action Buttons**: Preview (Eye), Edit, Delete
- **Current Implementation**: Similar to RecipeTableRow
- **Layout Strategy**: Tables switch to card layouts on mobile
- **Priority**: 🟡 **MEDIUM** - Same as RecipeTableRow

#### ⚠️ Unified Table Row (`app/webapp/recipes/components/UnifiedTableRow.tsx`)

- **Status**: ⚠️ **PARTIAL** - Action buttons in table cell (lines 250-283)
- **Action Buttons**: Preview (Eye), Edit, Delete
- **Current Implementation**: Similar to RecipeTableRow
- **Layout Strategy**: Tables switch to card layouts on mobile
- **Priority**: 🟡 **MEDIUM** - Same as RecipeTableRow

#### ⚠️ Ingredient Table Row (`app/webapp/ingredients/components/IngredientTableRow.tsx`)

- **Status**: ⚠️ **PARTIAL** - Action buttons in table cell (lines 194-220)
- **Action Buttons**: Edit, Delete
- **Current Implementation**:
  ```tsx
  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
    <div className="flex items-center gap-2">
      <button>
        <Icon icon={Edit} />
      </button>
      <button>
        <Icon icon={Trash2} />
      </button>
    </div>
  </td>
  ```
- **Layout Strategy**: Tables switch to card layouts on mobile
- **Priority**: 🟡 **MEDIUM** - Same as other table rows

#### ⚠️ Equipment List Table Row (`app/webapp/temperature/components/EquipmentListTableRow.tsx`)

- **Status**: ⚠️ **PARTIAL** - Action buttons in table cell (lines 164-185)
- **Action Buttons**: Quick Log, QR Code, Toggle Status, Edit, Delete (5 buttons!)
- **Current Implementation**: Multiple buttons in a flex container
- **Layout Strategy**: Tables switch to `EquipmentMobileCard` on mobile
- **Issues**:
  - 5 action buttons may be too many for mobile
  - Mobile card (`EquipmentMobileCard`) already handles actions (lines 165-197)
- **Priority**: 🟡 **MEDIUM** - Mobile card exists, but table row buttons may still be visible

#### ⚠️ Par Level Table Row (`app/webapp/par-levels/components/ParLevelTableRow.tsx`)

- **Status**: ⚠️ **PARTIAL** - Action buttons in table cell (lines 150-180)
- **Action Buttons**: Edit, Delete
- **Current Implementation**: Similar to IngredientTableRow
- **Layout Strategy**: Tables switch to `ParLevelCard` on mobile (`desktop:hidden` for cards, `desktop:block hidden` for table)
- **Priority**: 🟡 **MEDIUM** - Mobile card exists, but table row buttons may still be visible

### 3. PrepFlow Webapp - Card Components

#### ⚠️ Recipe Card Actions (`app/webapp/recipes/components/RecipeCard/components/RecipeCardActions.tsx`)

- **Status**: ⚠️ **NEEDS REVIEW** - 4 action buttons always visible (lines 27-71)
- **Action Buttons**: Preview, QR Code, Edit, Delete
- **Current Implementation**:
  ```tsx
  <div className="ml-7 flex gap-2">
    <button>Preview</button>
    <button>
      <Icon icon={QrCode} />
    </button>
    <button>
      <Icon icon={Edit} />
    </button>
    <button>
      <Icon icon={Trash2} />
    </button>
  </div>
  ```
- **Issues**:
  - 4 buttons may be too many for mobile screens
  - No responsive breakpoints
  - May be truncated on smaller screens
- **Priority**: 🟡 **MEDIUM** - Cards are used on mobile, buttons may need 3-dot menu

#### ✅ Equipment Mobile Card (`app/webapp/temperature/components/EquipmentMobileCard.tsx`)

- **Status**: ✅ **MOBILE-OPTIMIZED** - Mobile-specific card with inline buttons (lines 165-197)
- **Action Buttons**: Quick Log, QR Code, Toggle Status, Edit, Delete
- **Current Implementation**: Buttons in a flex container with proper spacing
- **Issues**:
  - 5 buttons may still be too many for very small screens
  - Could benefit from 3-dot menu for less common actions
- **Priority**: 🟢 **LOW** - Already mobile-optimized, but could be improved

#### ⚠️ Prep List Card (`app/webapp/prep-lists/components/PrepListCard.tsx`)

- **Status**: ⚠️ **NEEDS REVIEW** - 3 action buttons always visible (lines 112-137)
- **Action Buttons**: Export (Printer), Edit, Delete
- **Current Implementation**:
  ```tsx
  <div className="flex space-x-2">
    <button>
      <Icon icon={Printer} />
    </button>
    <button>
      <Icon icon={Edit} />
    </button>
    <button>
      <Icon icon={Trash2} />
    </button>
  </div>
  ```
- **Issues**:
  - 3 buttons may be acceptable, but no responsive breakpoints
  - Could benefit from 3-dot menu on mobile
- **Priority**: 🟡 **MEDIUM** - Cards are used on mobile, buttons may need optimization

#### ⚠️ Task Item (`app/webapp/cleaning/components/AreaTasksModal/components/TaskItem.tsx`)

- **Status**: ⚠️ **NEEDS REVIEW** - 2 action buttons always visible (lines 117-132)
- **Action Buttons**: Edit, Delete
- **Current Implementation**:
  ```tsx
  <div className="flex items-center gap-2">
    <button>
      <Icon icon={Edit2} />
    </button>
    <button>
      <Icon icon={Trash2} />
    </button>
  </div>
  ```
- **Issues**:
  - 2 buttons may be acceptable, but no responsive breakpoints
  - Could benefit from 3-dot menu on mobile for consistency
- **Priority**: 🟢 **LOW** - Only 2 buttons, but could be improved for consistency

#### ✅ Par Level Card (`app/webapp/par-levels/components/ParLevelCard.tsx`)

- **Status**: ✅ **MOBILE-OPTIMIZED** - Mobile-specific card with action buttons
- **Action Buttons**: Edit, Delete
- **Current Implementation**: Buttons in card footer
- **Priority**: 🟢 **LOW** - Already mobile-optimized

### 4. PrepFlow Webapp - Other Components

#### ⚠️ Equipment Action Buttons (`app/webapp/temperature/components/EquipmentActionButtons.tsx`)

- **Status**: ⚠️ **DESKTOP-ONLY** - Used in desktop table view (lines 20-93)
- **Action Buttons**: Quick Log, QR Code, Toggle Status, Edit, Delete
- **Current Implementation**: Multiple buttons in a flex container
- **Layout Strategy**: Used in desktop table, mobile uses `EquipmentMobileCard`
- **Priority**: 🟢 **LOW** - Desktop-only component, mobile handled separately

#### ⚠️ Menu Item Actions (`app/webapp/menu-builder/components/SortableMenuItem/components/MenuItemActions.tsx`)

- **Status**: ⚠️ **HOVER-ONLY** - Hidden by default, shown on hover (line 55)
- **Action Buttons**: Reorder dropdown, Category dropdown, Edit Region, Delete
- **Current Implementation**:
  ```tsx
  <div className="desktop:opacity-0 desktop:group-hover:opacity-100 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
  ```
- **Issues**:
  - Hidden on mobile (no hover)
  - Actions may not be accessible on mobile
- **Priority**: 🔴 **HIGH** - Actions not accessible on mobile/touch devices

#### ✅ Dish Side Panel Actions (`app/webapp/recipes/components/DishSidePanelActions.tsx`)

- **Status**: ✅ **SIDE PANEL** - Side panel is hidden on mobile, actions not needed
- **Action Buttons**: Edit, Delete
- **Priority**: N/A - Side panel pattern

#### ✅ Recipe Side Panel Actions (`app/webapp/recipes/components/RecipeSidePanelActions.tsx`)

- **Status**: ✅ **SIDE PANEL** - Side panel is hidden on mobile, actions not needed
- **Action Buttons**: Edit, Delete
- **Priority**: N/A - Side panel pattern

## Priority Summary

### 🔴 HIGH Priority (Immediate Action Needed)

1. **CurbOS Modifiers Page** (`app/curbos/modifiers/page.tsx`)
   - **Issue**: Inline buttons, no responsive handling
   - **Solution**: Apply MenuItemCard 3-dot menu pattern
   - **Impact**: Consistency with Menu Items page

2. **Menu Item Actions** (`app/webapp/menu-builder/components/SortableMenuItem/components/MenuItemActions.tsx`)
   - **Issue**: Actions hidden on mobile (hover-only)
   - **Solution**: Add mobile-accessible 3-dot menu
   - **Impact**: Actions not accessible on touch devices

### 🟡 MEDIUM Priority (Should Be Fixed)

3. **Recipe Card Actions** (`app/webapp/recipes/components/RecipeCard/components/RecipeCardActions.tsx`)
   - **Issue**: 4 buttons may be too many for mobile
   - **Solution**: Consider 3-dot menu for mobile

4. **Prep List Card** (`app/webapp/prep-lists/components/PrepListCard.tsx`)
   - **Issue**: 3 buttons, no responsive breakpoints
   - **Solution**: Consider 3-dot menu for mobile

5. **Table Row Action Buttons** (All table rows)
   - **Issue**: Buttons always visible, tables switch to cards on mobile
   - **Solution**: Verify mobile cards handle actions properly, or hide table buttons on mobile
   - **Files**:
     - `RecipeTableRow.tsx`
     - `DishTableRow.tsx`
     - `UnifiedTableRow.tsx`
     - `IngredientTableRow.tsx`
     - `EquipmentListTableRow.tsx`
     - `ParLevelTableRow.tsx`

### 🟢 LOW Priority (Nice to Have)

6. **Equipment Mobile Card** (`app/webapp/temperature/components/EquipmentMobileCard.tsx`)
   - **Issue**: 5 buttons may be too many for very small screens
   - **Solution**: Consider 3-dot menu for less common actions

7. **Task Item** (`app/webapp/cleaning/components/AreaTasksModal/components/TaskItem.tsx`)
   - **Issue**: 2 buttons acceptable, but could be consistent
   - **Solution**: Consider 3-dot menu for consistency

## Recommendations

### 1. Create Reusable Component

**Proposal**: Create a `ResponsiveActionMenu` component based on `MenuItemCard` pattern:

```tsx
// components/ui/ResponsiveActionMenu.tsx
interface ResponsiveActionMenuProps {
  actions: Array<{
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'danger';
  }>;
  // Desktop: hover overlay or always visible
  // Mobile: 3-dot menu
}
```

**Benefits**:

- Consistent pattern across all components
- Single source of truth for responsive behavior
- Easier to maintain and update

### 2. Implementation Strategy

**Phase 1 (High Priority)**:

1. Fix CurbOS Modifiers page
2. Fix Menu Item Actions (menu builder)

**Phase 2 (Medium Priority)**: 3. Review and fix table row buttons (verify mobile cards) 4. Optimize Recipe Card Actions 5. Optimize Prep List Card

**Phase 3 (Low Priority)**: 6. Improve Equipment Mobile Card 7. Improve Task Item for consistency

### 3. Breakpoint Strategy

**Use PrepFlow's Custom Breakpoints**:

- Mobile: Base styles (< 481px)
- Tablet: `tablet:` (481px+) - Use mobile layout
- Desktop: `desktop:` (1025px+) - Use desktop layout

**Pattern**:

```tsx
{
  /* Desktop: Hover overlay or always visible */
}
<div className="hidden tablet:flex ...">{/* Desktop buttons */}</div>;

{
  /* Mobile: 3-dot menu */
}
<div className="tablet:hidden ...">{/* Mobile 3-dot menu */}</div>;
```

## Table vs Card Layout Strategy

**Current Pattern**:

- Tables use `desktop:block hidden` for desktop table
- Cards use `desktop:hidden block` for mobile cards
- Action buttons in table rows are always visible
- Mobile cards have their own action button implementations

**Recommendation**:

- Verify mobile cards handle actions properly (most do)
- Hide table row action buttons on mobile (`tablet:hidden` on action cell)
- Ensure mobile cards have proper action handling

## Conclusion

The `MenuItemCard` 3-dot menu pattern is well-implemented and should be applied to:

- **High Priority**: CurbOS Modifiers page, Menu Item Actions
- **Medium Priority**: Recipe Card Actions, Prep List Card, Table row buttons
- **Low Priority**: Equipment Mobile Card, Task Item

A reusable `ResponsiveActionMenu` component would ensure consistency and make future implementations easier.
