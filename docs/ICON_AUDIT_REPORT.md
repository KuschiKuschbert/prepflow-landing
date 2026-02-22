# Icon Audit Report

Generated from `npm run audit:icons`. Last run: 2026-02-23.

## Summary

| Metric               | Count          |
| -------------------- | -------------- |
| Files scanned        | 2,975          |
| Icon wrapper usages  | 1,019          |
| Direct Lucide usages | 62 (29 files)  |
| Emoji icons          | 289 (99 files) |

## Direct Lucide Usage (Priority: Replace with Icon wrapper)

Use `<Icon icon={X} size="sm" />` instead of `<X className="h-4 w-4" />` for:

- Consistent sizing (xs/sm/md/lg/xl)
- Accessibility (aria-label, aria-hidden)
- Design system compliance

**Top files by count:**

- `app/webapp/functions/page.tsx` — 7
- `app/webapp/customers/page.tsx` — 6
- `app/webapp/functions/[id]/page.tsx` — 6
- `app/webapp/components/UpcomingFunctionsWidget.tsx` — 5
- `app/webapp/functions/components/MiniCalendarPanel.tsx` — 5
- `app/webapp/specials/components/SpecialsHeader.tsx` — 5

**Common icons:** Plus, Search, ArrowLeft, Calendar, Loader2, X, ChevronRight, ChevronLeft, Sparkles, ClipboardList, Users, Edit2, Trash2, Save

## Emoji Icons

Replace with Lucide equivalents per design.mdc:

- 🏪 → Store
- 📍 → MapPin
- ✨ → Sparkles
- 📊 → BarChart2
- 📋 → ClipboardList
- 🎯 → Target
- ⚡ → Zap

**Note:** Emoji in logger calls, JSDoc, and gamification/Arcade components may be lower priority. Focus on user-facing UI first.

## Commands

```bash
npm run audit:icons              # Full report
npm run audit:icons -- --json    # JSON output
```

Icon checks are also included in `npm run audit:hierarchy` under the `icon` category.
