# 🛡️ The Brain's Laws

1.  **No Secrets**: Do not hardcode API keys. Use `.env.local`. The Auditor will block you.
2.  **No Bloat**: Images > 500KB are forbidden in `public/`.
3.  **No Debt**: TODOs > 50 block the build.
4.  **No Circular Deps**: The Architect is watching.
5.  **No Magic Numbers**: Use `lib/constants.ts` for everything (Time, Size, ID limits).
6.  **No Spaghetti Data**: Static data > 50 lines MUST live in `lib/data/` or a JSON file.
7.  **No Hardcoded URLs**: Use `APP_BASE_URL` from constants. `localhost:3000` is FORBIDDEN.
8.  **Component Size**: Components > 300 lines MUST be split. Extract sub-components (Header, List, Form).
9.  **Business Logic**: "Profit Margins", "Timeouts", and "Limits" MUST be in `lib/constants.ts`.
