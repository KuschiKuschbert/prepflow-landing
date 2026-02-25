---
name: prepflow-kitchen-domain
description: Applies kitchen and restaurant operations knowledge. Use when working on ingredients, recipes, menus, pricing, temperature monitoring, cleaning, compliance, prep lists, or order lists.
evolvable: true
---

# PrepFlow Kitchen Domain Protocol

Apply restaurant and kitchen operations knowledge when working on domain features.

## When to use this skill

- Ingredients, recipes, menus
- COGS, pricing, profitability
- Temperature monitoring
- Cleaning, compliance
- Prep lists, order lists

## Domain Knowledge

### COGS Methodology (PrepFlow Dynamic)

- Dynamic profit thresholds (above/below menu average)
- Dynamic popularity thresholds (80% of average)
- Classifications: Chef's Kiss, Hidden Gem, Bargain Bucket, Burnt Toast

### Queensland Food Safety

- Cold storage: 0-5°C
- Hot holding: ≥60°C
- Freezer: -24°C to -18°C
- 2-Hour/4-Hour rule for time in danger zone

### Data Conventions

- Use `ingredient_name` (not `name`) for ingredients
- Recipe-ingredient joins: prefer `GET /api/recipes/[id]/ingredients`

## Key References

- [.cursor/rules/implementation.mdc](.cursor/rules/implementation.mdc) - COGS methodology, Queensland standards
- [docs/PRINT_EXPORT_IMPORT_PATTERNS.md](docs/PRINT_EXPORT_IMPORT_PATTERNS.md) - Runsheet, kitchen templates

## Style Guide

- Kitchen terminology and flows matter. Match real-world restaurant operations.
