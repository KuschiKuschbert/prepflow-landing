# Skills Index

All available SKILL.md files in this codebase. Load the relevant skill before starting work in that domain.

## How to Use Skills

When you start a task, identify the domain and load the corresponding skill file. Skills contain:

- How the domain works in this specific codebase
- Step-by-step guides for common tasks
- GOTCHAS (known bugs, non-obvious constraints)
- Reference files (real examples to follow)
- RETROFIT LOG (files already updated to match standards)

---

## Core Infrastructure

| Skill         | Path                                        | When to Load                                       |
| ------------- | ------------------------------------------- | -------------------------------------------------- |
| API Routes    | `app/api/SKILL.md`                          | Creating or modifying any API route                |
| Webapp Pages  | `app/webapp/SKILL.md`                       | Creating or modifying any webapp page              |
| Hooks         | `hooks/SKILL.md`                            | Creating or modifying custom React hooks           |
| UI Components | `components/ui/SKILL.md`                    | Working with Cyber Carrot design system components |
| Caching       | `lib/cache/SKILL.md`                        | Adding caching, prefetching, or a new webapp route |
| Navigation    | `app/webapp/components/navigation/SKILL.md` | Modifying sidebar, header, or search               |

---

## Business Domains

| Skill          | Path                                 | When to Load                                 |
| -------------- | ------------------------------------ | -------------------------------------------- |
| Ingredients    | `lib/ingredients/SKILL.md`           | Ingredient CRUD, allergens, units, bulk ops  |
| Recipes        | `lib/recipes/SKILL.md`               | Recipe CRUD, ingredients, cost, sharing      |
| Menus & Dishes | `app/api/menus/SKILL.md`             | Menu builder, dish builder, locking, exports |
| Performance    | `app/webapp/performance/SKILL.md`    | COGS analysis, PrepFlow Dynamic methodology  |
| Specials       | `app/webapp/specials/SKILL.md`       | Daily specials, special days, AI suggestions |
| Recipe Sharing | `app/webapp/recipe-sharing/SKILL.md` | Recipe sharing between users                 |

---

## Operations

| Skill          | Path                              | When to Load                                        |
| -------------- | --------------------------------- | --------------------------------------------------- |
| Temperature    | `app/webapp/temperature/SKILL.md` | Temperature monitoring, HACCP, Queensland standards |
| Cleaning       | `app/webapp/cleaning/SKILL.md`    | Cleaning areas, tasks, schedules, QR codes          |
| Compliance     | `app/webapp/compliance/SKILL.md`  | Compliance records, allergen compliance, reports    |
| Suppliers      | `app/webapp/suppliers/SKILL.md`   | Supplier management, price lists                    |
| Par Levels     | `app/webapp/par-levels/SKILL.md`  | Par levels, order lists, prep lists                 |
| Exports & PDFs | `lib/exports/SKILL.md`            | PDF generation, QR codes, print views               |

---

## People & Events

| Skill     | Path                            | When to Load                                    |
| --------- | ------------------------------- | ----------------------------------------------- |
| Staff     | `app/webapp/staff/SKILL.md`     | Employee management, qualifications, onboarding |
| Roster    | `app/webapp/roster/SKILL.md`    | Shift management, templates, time & attendance  |
| Functions | `app/webapp/functions/SKILL.md` | Catering events, runsheets, weather alerts      |
| Customers | `app/webapp/customers/SKILL.md` | Customer management, linking to functions       |

---

## Integrations

| Skill       | Path                   | When to Load                                        |
| ----------- | ---------------------- | --------------------------------------------------- |
| Square POS  | `lib/square/SKILL.md`  | Square OAuth, catalog/staff/order sync              |
| AI Services | `lib/ai/SKILL.md`      | Recipe generation, descriptions, insights, specials |
| Billing     | `lib/billing/SKILL.md` | Stripe, subscriptions, feature gating, webhooks     |
| Backup      | `lib/backup/SKILL.md`  | Google Drive backup, restore, scheduling            |

---

## Settings & Admin

| Skill       | Path                           | When to Load                                  |
| ----------- | ------------------------------ | --------------------------------------------- |
| Settings    | `app/webapp/settings/SKILL.md` | Settings pages, backup settings, billing page |
| Admin Panel | `app/admin/SKILL.md`           | User management, feature flags, system health |

---

## Secondary Systems

| Skill       | Path                        | When to Load                                 |
| ----------- | --------------------------- | -------------------------------------------- |
| User Guide  | `app/webapp/guide/SKILL.md` | In-app guide, screenshots, interactive demos |
| Personality | `lib/personality/SKILL.md`  | PrepFlow voice, gamification, easter eggs    |
| CurbOS      | `app/curbos/SKILL.md`       | CurbOS integration (PROTECTED AREA)          |

---

## Developer Tools

| Skill       | Path               | When to Load                                   |
| ----------- | ------------------ | ---------------------------------------------- |
| E2E Testing | `e2e/SKILL.md`     | Playwright tests, simulation, workflow helpers |
| Scripts     | `scripts/SKILL.md` | Build scripts, codemods, deployment scripts    |
| RSI System  | `lib/rsi/SKILL.md` | Auto-fix, validation suite, error learning     |

---

## Cursor Rules (Always Active)

These rules apply to ALL tasks — you don't need to load them explicitly:

| Rule             | Path                                       |
| ---------------- | ------------------------------------------ |
| Stack & versions | `.cursor/rules/stack.md`                   |
| Architecture     | `.cursor/rules/architecture.md`            |
| All routes       | `.cursor/rules/routing.md`                 |
| Naming & style   | `.cursor/rules/style.md`                   |
| Anti-patterns    | `.cursor/rules/forbidden.md`               |
| Environment vars | `.cursor/rules/environments.md`            |
| Integrations     | `.cursor/rules/integrations.md`            |
| Git conventions  | `.cursor/rules/git.md`                     |
| Safety checklist | `.cursor/rules/safety.md`                  |
| Key decisions    | `.cursor/rules/decisions.md`               |
| Context handoff  | `.cursor/rules/context-hygiene.md`         |
| Self-improvement | `.cursor/rules/meta-skill.md`              |
| Sub-agents       | `.cursor/rules/sub-agent-orchestration.md` |

---

## Adding a New Skill

1. Create `path/to/domain/SKILL.md`
2. Follow the template in `.cursor/rules/sub-agent-orchestration.md`
3. Add the skill to this index
4. Add to `ONBOARDING.md` if it's a primary onboarding domain

Last updated: 2025-02-26
Skills count: 30 domain skills + 13 cursor rules
