# Onboarding — New Agent / Developer Quickstart

Welcome to PrepFlow. Read this in full before writing any code.

---

## 1. What PrepFlow Is

PrepFlow is a **restaurant profitability SaaS** — cafés, restaurants, and food trucks use it to manage their menu costs (COGS), track ingredient prices, monitor food safety (temperature, compliance, cleaning), and optimize gross profit margins.

**Business model:** Subscription-based ($29/mo AUD), 7-day free trial.  
**Target market:** Independent restaurants and cafés in Australia (and globally).  
**Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, Supabase (PostgreSQL), Auth0, Stripe.

---

## 2. Read These First (In This Order)

1. **`.cursor/rules/stack.md`** — tech stack, versions, key constraints (5 min)
2. **`.cursor/rules/forbidden.md`** — anti-patterns you must never generate (3 min)
3. **`.cursor/rules/architecture.md`** — where files live and module boundaries (5 min)
4. **`.cursor/rules/style.md`** — naming conventions, import ordering, JSDoc (3 min)
5. **`.cursor/rules/safety.md`** — sacred files and what not to touch (2 min)

Total: ~18 minutes. This will save hours of mistakes.

---

## 3. Key Non-Obvious Facts

**Custom breakpoints only** — `sm:`, `md:`, `lg:` are disabled. Use `tablet:` (481px) and `desktop:` (1025px).

**Optimistic updates** are mandatory for all CRUD. Never show loading spinners after mutations.

**`ingredient_name`** is the canonical field (not `name`). Historical aliases exist — always use `ingredient_name` in new code.

**Next.js 16 params** are a Promise — always `const { id } = await context.params`.

**`app/curbos/`** is protected — don't touch it. `app/nachotaco/` is completely excluded from all tooling.

**No `.catch()` on Supabase** query builders — use `{ data, error }` destructuring.

**No `console.log`** in production code — use `logger.dev()` / `logger.error()` etc.

**No native browser dialogs** — use `useConfirm`, `useAlert`, `usePrompt` hooks.

---

## 4. Project Brain (AI Rules)

`docs/AI_RULES.md` — established patterns and Ralph Loop methodology. Read before proposing significant architectural changes.

---

## 5. Development Workflow

```bash
# Start development
npm run dev

# Before any commit
npm run format       # Prettier
npm run lint         # ESLint

# Before pushing to main
npm run pre-deploy   # All checks (lint + type-check + format + build)

# Auto-fix common issues
npm run cleanup:fix

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
npm run test:smoke   # Quick key-page check
npm run test:crawl   # Full webapp crawl for console errors
```

**Branch workflow:**

```bash
git checkout -b improvement/my-feature
# ... make changes ...
git add -A && git commit -m "feat(ingredients): add bulk allergen detection"
bash scripts/safe-merge.sh  # merge to main safely
```

---

## 6. Important Domain Knowledge

### PrepFlow COGS Dynamic Methodology

Performance analysis classifies dishes into 4 categories based on profit and popularity relative to the menu average. See `app/webapp/performance/SKILL.md`.

### Queensland Food Safety Standards

Temperature thresholds are auto-applied based on equipment name. Cold storage: 0-5°C, Freezer: -24 to -18°C, Hot holding: ≥60°C. See `app/webapp/temperature/SKILL.md`.

### Optimistic Updates Pattern

```typescript
const originalItems = [...items];           // 1. Store original
setItems(prev => prev.filter(...));         // 2. Update UI immediately
try {
  await fetch(`/api/items/${id}`, { method: 'DELETE' });
  showSuccess('Deleted');
} catch {
  setItems(originalItems);                  // 3. Revert on error
  showError('Failed');
}
```

### Caching Pattern (required for all list pages)

```typescript
const [data, setData] = useState(() => getCachedData('key') || []);
useEffect(() => {
  fetch('/api/data')
    .then(r => r.json())
    .then(d => {
      setData(d.data);
      cacheData('key', d.data);
    });
}, []);
```

---

## 7. File Size Limits

| Type       | Max Lines |
| ---------- | --------- |
| Pages      | 500       |
| Components | 300       |
| API routes | 200       |
| Utilities  | 150       |
| Hooks      | 120       |

Check: `npm run lint:filesize`. Fix by extracting to helpers.

---

## 8. Before Your First PR

- [ ] No `console.log` in your changes (run `npm run cleanup:check`)
- [ ] No `sm:`, `md:`, `lg:` Tailwind classes
- [ ] No native `confirm()`, `alert()`, `prompt()` calls
- [ ] All async API routes wrapped in `try/catch`
- [ ] All POST/PUT/PATCH routes have Zod validation
- [ ] File sizes within limits
- [ ] `npm run pre-deploy` passes
- [ ] `npm test` passes (or failures are documented)
- [ ] SKILL.md updated if you added/changed domain patterns

---

## 9. Skills Index

See `.cursor/SKILLS_INDEX.md` for the full list of domain skill files.

**Most important skills for new features:**

- API work → `app/api/SKILL.md`
- UI pages → `app/webapp/SKILL.md`
- Ingredients/recipes/menus → respective SKILL.md files
- Adding caching → `lib/cache/SKILL.md`

---

## 10. Getting Unstuck

1. Check `docs/TROUBLESHOOTING_LOG.md` — has this error been seen before?
2. Check the domain's SKILL.md `## GOTCHAS` section
3. Check `.cursor/rules/error-patterns.mdc` — learned patterns
4. Run `npm run rsi:fix` — auto-fixes common known issues
5. Check `docs/AI_RULES.md` — Ralph Loop and other methodology docs

---

## 11. Tech Debt

Known issues that need human attention: `.cursor/TECH_DEBT.md`

Add to it (don't accumulate silent debt):

```
| File | Issue | Why Not Auto-Fixed | Effort | Priority |
```

---

## 12. Key Contacts

- **Decisions log:** `.cursor/rules/decisions.md` — why things are the way they are
- **Dev log:** `docs/DEV_LOG.md` — recent changes and context
- **Scripts reference:** `docs/SCRIPTS.md` — all npm scripts documented
- **Auth0/Stripe:** `docs/AUTH0_STRIPE_REFERENCE.md` — complete integration guide
