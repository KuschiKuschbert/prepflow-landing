# 🧠 Memory Bank (Lessons Learned)

> **Self-Correction Rule**: If you fix a bug or learn a new pattern, you **MUST** add it to this list immediately.

- **[2026-01-05] Route Params**: Next.js 15 `params` are Promises. Accessing `.id` directly throws "undefined". Fix: `const { id } = await params`.
- **[2026-01-11] Massive Avatars**: Gemini generated images were ~5MB. We used `sips` to resize them to ~250KB.
- **[2026-01-11] Test Generation**: `import * as Module` is safer than named imports for smoke testing unknown files.
- **[2026-01-11] Import Hoisting**: Jest hoists ES6 imports. Use `require()` inside `beforeAll` to meaningfully mock `process.env`.
- **[2026-01-14] Ralph Loop**: For complex refactors and bugs, we use the **Ralph Wiggum Technique** (Iterate > Perfection).
- **[2026-01-21] Refactoring Strategy**: When refactoring massive type definitions, extract domain-specific types into separate files _first_.
- [2026-01-22] Circular Dependencies: Shared types between components MUST be extracted to a separate `types.ts` file.
- [2026-01-22] File Size Limits: All "logic" files > 200 lines must be split immediately.
- [2026-01-28] **Ingredient Matching**: Fuzzy ingredient matching logic is defined in lib/ingredient-normalization.ts and PostgreSQL ingredient_aliases table.
- [2026-01-28] **Database Timeouts**: When updating > 2000 rows, **NEVER** rely on direct migrations. Use Batch Scripts.
- [2026-02-12] **Design Tokens**: Refactored to Tailwind v4 `@theme`. Standardized `--color-primary`, `--color-accent`, etc.
- [2026-02-23] **Runsheet Export**: Function runsheet uses `variant: 'runsheet'` in `generatePrintTemplate`. Use `buildRunsheetContent` helper and `?day=N&theme=T` query params. See `docs/PRINT_EXPORT_IMPORT_PATTERNS.md` (Runsheet Export Flow).
