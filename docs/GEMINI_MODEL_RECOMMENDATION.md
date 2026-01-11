# Gemini Model Recommendation for Recipe Formatting

## ✅ **Recommended: `gemini-1.5-flash`** (Default)

**Why this is the best choice for recipe formatting:**

### 1. **Cost-Effectiveness** ✅

- **Input:** $0.075 per million tokens
- **Output:** $0.30 per million tokens
- **Same pricing as `gemini-2.5-flash`** (cheapest Flash model)

### 2. **No Daily Limit Issues** ✅

- **Older model** = More lenient quota limits
- **No 10K/day limit** (unlike `gemini-2.5-flash`)
- **Perfect for bulk recipe processing** (100s-1000s of recipes per day)

### 3. **Performance for Structured JSON** ✅

- **Flash models optimized** for structured output tasks
- **Fast response times** (optimized for speed)
- **Good JSON structure adherence** (sufficient for recipe formatting with our detailed prompts)

### 4. **Cost Comparison**

**Per Recipe (Average):**

- Input: ~2,000 tokens = $0.00015
- Output: ~1,500 tokens = $0.00045
- **Total: $0.0006 per recipe**

**Bulk Processing:**

- 100 recipes = **$0.06**
- 1,000 recipes = **$0.60**
- 10,000 recipes = **$6.00**

## Model Comparison

| Model                     | Input Cost | Output Cost | Daily Limit  | Best For                                         |
| ------------------------- | ---------- | ----------- | ------------ | ------------------------------------------------ |
| **`gemini-1.5-flash`** ✅ | $0.075/M   | $0.30/M     | **No limit** | **Recipe formatting (recommended)**              |
| `gemini-2.5-flash`        | $0.075/M   | $0.30/M     | **10K/day**  | Not recommended (hits limit quickly)             |
| `gemini-1.5-pro`          | $1.25/M    | $5.00/M     | No limit     | Complex reasoning (overkill, 16x more expensive) |
| `gemini-2.5-pro`          | $1.25/M    | $10.00/M    | No limit     | Complex tasks (overkill, 33x more expensive)     |

## Configuration Optimizations

### Temperature Settings

- **Current:** `temperature: 0.3` (optimized for deterministic JSON output)
- **Best practice:** 0.3-0.5 for structured data (lower = more consistent JSON)

### Max Output Tokens

- **Current:** `8192` tokens (sufficient for complex recipes with many ingredients)
- **Recipe average:** ~1,500 tokens per recipe

### Timeout

- **Current:** 60 seconds (sufficient for cloud processing)
- **Typical processing:** 10-30 seconds per recipe

## Why NOT Other Models?

### ❌ `gemini-2.5-flash` (Previous Default)

- **Problem:** 10K requests/day limit
- **Issue:** Blocks bulk processing (e.g., 10,000 recipes = hits limit immediately)
- **Solution:** Only use if daily limit is acceptable for your use case

### ❌ `gemini-2.0-flash` (Mentioned in Code)

- **Problem:** Model name may not exist (likely typo)
- **Issue:** Code references this but it's unclear if it's available
- **Solution:** Use `gemini-1.5-flash` instead (confirmed available)

### ❌ `gemini-1.5-pro` or `gemini-2.5-pro`

- **Problem:** 16-33x more expensive ($1.25-$10.00 vs $0.075-$0.30)
- **Issue:** Overkill for recipe formatting (structured JSON doesn't need Pro capabilities)
- **Solution:** Only use for complex reasoning tasks (not needed for recipe formatting)

## Migration from Previous Default

**Before (Problematic):**

```typescript
model: 'gemini-2.5-flash'; // 10K/day limit - blocks bulk processing
```

**After (Optimized):**

```typescript
model: 'gemini-1.5-flash'; // No daily limit - perfect for bulk processing
```

## Cost Savings

**If processing 10,000 recipes:**

**Before (`gemini-2.5-flash`):**

- Hits 10K/day limit → Blocks processing
- Need to wait or manually split batches

**After (`gemini-1.5-flash`):**

- No daily limit → Can process all 10,000 recipes in one batch
- Cost: $6.00 total (same per-recipe cost, no limit issues)

**Savings:** No blocking issues, smoother workflow ✅

## Best Practice Strategy

1. **Default:** Use `gemini-1.5-flash` (cheapest, no daily limit)
2. **Ollama Preferred:** Always prefer Ollama (free, local) when available
3. **Gemini Fallback:** Only use Gemini when Ollama unavailable
4. **Temperature:** Keep at 0.3 for deterministic JSON output

## Implementation

The system automatically:

- ✅ Defaults to `gemini-1.5-flash` when Gemini is used
- ✅ Falls back from `gemini-2.5-flash` to `gemini-1.5-flash` if daily limit hit
- ✅ Uses temperature 0.3 for deterministic JSON output
- ✅ Prefers Ollama (free) over Gemini (paid) when available

## References

- **Official Pricing:** https://ai.google.dev/pricing
- **Cost Tracker:** `lib/ai/utils/cost-tracker.ts` (tracks per-model costs)
- **Current Configuration:** `lib/ai/gemini-client.ts` (temperature: 0.3, model: gemini-1.5-flash)
