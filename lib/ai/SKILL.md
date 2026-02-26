# AI SERVICES SKILL

## PURPOSE

Load when working on AI features: recipe generation, dish descriptions, performance insights, prep detail analysis, allergen detection, image generation, or the AI specials feature.

## HOW IT WORKS IN THIS CODEBASE

**Unified AI service at `lib/ai/ai-service/`:**

- `chat.ts` — text generation (recipe instructions, descriptions, insights)
- `vision.ts` — image analysis (ingredient recognition, dish identification)

**Active providers:**
| Provider | Wrapper | Primary use |
|----------|---------|------------|
| Groq | `lib/ai/groq-client.ts` | Fast text (primary) |
| Hugging Face | `lib/ai/huggingface-client/` | Image generation, vision |

**Deprecated:**

- Gemini (`lib/ai/gemini-client.ts`) — flagged for removal

**AI API routes:**

- `POST /api/ai/chat` — general chat
- `POST /api/ai/recipe-instructions` — generate recipe steps
- `POST /api/ai/menu-item-description` — write dish descriptions
- `POST /api/ai/performance-insights` — analyze COGS performance
- `POST /api/ai/performance-tips` — tips for underperforming dishes
- `POST /api/ai/prep-details` — generate prep list details
- `POST /api/ai-specials` — suggest daily specials
- `POST /api/ai-specials/search` — search for specials with stock check

**Cost tracking:**

- `lib/ai/utils/cost-tracker.ts` — tracks API token usage per user
- Helps manage AI budget in production

## STEP-BY-STEP: Add a new AI feature

1. Check `AI_ENABLED` env var first — skip if disabled
2. Add route at `app/api/ai/my-feature/route.ts`
3. Import from `lib/ai/ai-service/chat.ts` (not provider directly)
4. Add prompt template in `lib/ai/prompts/`
5. Handle failures gracefully — AI is non-critical; show fallback, don't throw
6. Add cost tracking call

## STEP-BY-STEP: AI Specials flow

1. User requests specials for a date
2. `POST /api/ai-specials/search` checks current stock levels
3. `lib/ai/` generates suggestions based on available ingredients
4. Suggestions returned with confidence scores
5. User selects and confirms

## GOTCHAS

- **Always handle AI failures gracefully** — never let AI errors crash the page
- **Gemini is deprecated** — do not add new code using `gemini-client.ts`
- **AI is feature-flagged** — check `AI_ENABLED` env var before making calls
- **Rate limiting:** `lib/ai/ai-service/chat.ts` has a TODO for user-ID-based rate limiting — use IP for now
- **Response parsing** is unreliable — `lib/ai/groq-client-helpers/response-parser.ts` handles common failure modes
- **Image generation** is slow (5-15s) — always run in background, never block UI

## REFERENCE FILES

- `lib/ai/groq-client.ts` — Groq client singleton
- `lib/ai/ai-service/chat.ts` — unified text generation
- `lib/ai/prompts/` — prompt templates (keep prompts here, not inline)
- `app/api/ai-specials/search/helpers/fetchStockIngredients.ts` — stock-aware specials
- `app/api/ai/performance-tips/route.ts` — example AI route implementation

## RETROFIT LOG

## LAST UPDATED

2025-02-26
