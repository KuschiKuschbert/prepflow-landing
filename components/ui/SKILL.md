# UI COMPONENTS SKILL

## PURPOSE

Load when creating, modifying, or using shared UI components in `components/ui/`. Covers Cyber Carrot design system implementation, the Icon wrapper, dialog components, loading skeletons, and table patterns.

## HOW IT WORKS IN THIS CODEBASE

**Design system: Cyber Carrot** — dark-first, no light mode.

**Core color tokens:**

- `#29E7CD` — Electric Cyan (primary actions, focus rings, highlights)
- `#D925C7` — Vibrant Magenta (accent, gradients)
- `#FF6B00` — Cyber Orange (warm accents, gradients)
- `#0a0a0a` — Background
- `#1f1f1f` — Card/container background
- `#2a2a2a` — Border, surface

**Key components in `components/ui/`:**

| Component             | Purpose                                     |
| --------------------- | ------------------------------------------- |
| `Icon.tsx`            | Lucide icon wrapper — ALWAYS use this       |
| `ConfirmDialog.tsx`   | Confirmation dialog (danger/warning/info)   |
| `InputDialog.tsx`     | Input dialog with validation                |
| `LoadingSkeleton.tsx` | Loading skeletons (many variants)           |
| `TablePagination.tsx` | Pagination — place top AND bottom of tables |
| `ScrollReveal.tsx`    | Scroll-triggered animations (landing pages) |
| `MagneticButton.tsx`  | Magnetic hover button (landing pages only)  |
| `GlowCard.tsx`        | Glow hover card (landing pages only)        |

## STEP-BY-STEP: Add a Lucide icon

```tsx
import { Icon } from '@/components/ui/Icon';
import { Trash2, Plus } from 'lucide-react';

// Decorative (no screen reader label needed)
<Icon icon={Trash2} size="sm" className="text-red-400" />

// Interactive (needs label for accessibility)
<Icon icon={Plus} size="md" aria-label="Add ingredient" />
```

Never import lucide icons and use them directly — always wrap with `Icon`.

## STEP-BY-STEP: Create a new reusable component

1. Create `components/ui/MyComponent.tsx`
2. Add `"use client"` if it uses hooks
3. Follow Cyber Carrot colors and `rounded-3xl`/`rounded-2xl` border radius
4. Add JSDoc to the component
5. Export from the component file (no barrel index required for single components)
6. Test dark-theme-only appearance

## STEP-BY-STEP: Add a loading skeleton

```tsx
import { LoadingSkeleton, TableSkeleton, PageSkeleton } from '@/components/ui/LoadingSkeleton';

// Full page loading
if (isLoading) return <PageSkeleton />;

// Section loading
if (isLoading) return <LoadingSkeleton variant="table" />;

// Table loading
if (isLoading) return <TableSkeleton rows={10} columns={5} />;
```

## Standard Table Pattern

```tsx
<div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
  <table className="min-w-full divide-y divide-[#2a2a2a]">
    <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
          Column
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
      {items.map(item => (
        <tr key={item.id} className="transition-colors hover:bg-[#2a2a2a]/20">
          <td className="px-6 py-4 text-sm text-white">{item.name}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>;

{
  /* ALWAYS place pagination top AND bottom */
}
<TablePagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />;
```

## GOTCHAS

- **No emoji icons** — use Lucide via `Icon` wrapper
- **Custom breakpoints only** — `desktop:` not `lg:`, `tablet:` not `md:`
- **Z-index hierarchy** — modals `z-[80]`, search `z-[75]`, FAB `z-[70]`, sidebar `z-[60]`, header `z-50`
- **Focus rings** — always `focus:ring-2 focus:ring-[#29E7CD]` for keyboard navigation
- **Gradient borders** — `bg-gradient-to-r from-[#29E7CD]/20 via-[#FF6B00]/20 via-[#D925C7]/20 to-[#29E7CD]/20 p-[1px]` for elevated components
- **Touch targets** — minimum 44px for all interactive elements
- **`ScrollReveal`, `MagneticButton`, `GlowCard`** are landing-page only — don't use in webapp

## REFERENCE FILES

- `components/ui/Icon.tsx` — icon wrapper
- `components/ui/ConfirmDialog.tsx` — dialog component
- `components/ui/LoadingSkeleton.tsx` — all skeleton variants
- `components/ui/TablePagination.tsx` — pagination component
- `hooks/useConfirm.ts` — dialog hook (use this, not ConfirmDialog directly)

## RETROFIT LOG

## LAST UPDATED

2025-02-26
