# Ollama-Only Migration Guide

## ✅ Gemini Completely Removed

**Date:** January 2025
**Status:** ✅ Complete - All Gemini code removed and disabled

## ⚠️ Update (January 2025): Groq Primary, Ollama Fallback

**Note:** This document describes the historical migration from Gemini to Ollama-only. The system has since been updated to use **Groq API as primary** (fastest free option - sub-second responses) with **Ollama as fallback** (free, local processing).

**Current Approach:**

- **PRIMARY:** Groq API (fast, sub-second responses, 500+ tokens/sec)
- **FALLBACK:** Ollama (free, local processing, 28-32 tokens/sec)

**See:** [docs/GROQ_SETUP_GUIDE.md](docs/GROQ_SETUP_GUIDE.md) for current setup instructions.

---

## Summary (Historical - Gemini Removal)

All Gemini API code has been **completely removed** and disabled to prevent expensive API costs. The system was migrated to use **ONLY Ollama** (free, local processing) for all recipe formatting. This has since been updated to use Groq primary with Ollama fallback.

## Changes Made

### 1. Recipe Processor (`scripts/recipe-scraper/utils/recipe-processor.ts`)

- ✅ Removed all Gemini imports (`generateTextWithGemini`, `isGeminiAvailable`)
- ✅ Removed all `useOllama` and `useGemini` logic
- ✅ Removed Gemini fallback (will fail if Ollama not available)
- ✅ Updated error messages to only mention Ollama
- ✅ Simplified `processSingleRecipe()` and `processRecipes()` signatures

### 2. API Routes (`app/api/recipe-scraper/process-recipes/route.ts`)

- ✅ Removed Gemini imports and quota checks
- ✅ Removed `useOllama` parameter from POST body
- ✅ Removed `geminiQuota` from GET response
- ✅ Updated all messages to only mention Ollama
- ✅ Removed all Gemini availability checks

### 3. Gemini Client (`lib/ai/gemini-client.ts`)

- ✅ All functions disabled (throw errors immediately)
- ✅ `isGeminiAvailable()` always returns `false`
- ✅ `generateTextWithGemini()` throws error immediately
- ✅ `checkGeminiQuota()` throws error immediately
- ✅ Clear error messages directing to Ollama

### 4. Environment Variables (`env.example`)

- ✅ Updated to document Gemini is disabled
- ✅ Added clear instructions to use Ollama instead
- ✅ Added warnings about cost prevention

## Migration Steps (If Using Gemini Before)

### Step 1: Install Ollama

**macOS:**

```bash
brew install ollama
```

**Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download from https://ollama.com/download

### Step 2: Start Ollama

```bash
ollama serve
```

This starts Ollama on `http://localhost:11434` (default port).

### Step 3: Pull Recommended Model

```bash
# Best for structured JSON output (recommended)
ollama pull llama3.2:3b

# Alternative options:
ollama pull qwen2.5:3b   # Also excellent for JSON
ollama pull phi3:mini    # Faster but less accurate for structure
```

### Step 4: Verify Installation

```bash
# Check if Ollama is running
ollama ps

# Test model
ollama run llama3.2:3b "Generate a JSON recipe"
```

### Step 5: Remove Gemini API Key (Optional)

If you had `GEMINI_API_KEY` in `.env.local`, you can safely remove it:

```bash
# Remove from .env.local (no longer needed)
# The system will not use it even if it's set (all functions are disabled)
```

## API Changes

### Before (Gemini Fallback):

```typescript
POST /api/recipe-scraper/process-recipes
{
  "action": "start",
  "useOllama": true,  // Optional - would fallback to Gemini if false
  "model": "llama3.2:3b"
}
```

### After (Ollama Only):

```typescript
POST /api/recipe-scraper/process-recipes
{
  "action": "start",
  "model": "llama3.2:3b"  // Optional - defaults to llama3.2:3b
  // useOllama removed - always uses Ollama
}
```

## Error Handling

**If Ollama Not Available:**

```json
{
  "error": "Ollama is not available. Please start Ollama (localhost:11434) for free processing. Run: \"ollama serve\" (or \"ollama run llama3.2:3b\" to pull and start). GEMINI REMOVED to prevent expensive API costs."
}
```

**If Gemini Functions Called (Should Never Happen):**

```json
{
  "error": "GEMINI IS DISABLED - Using only Ollama to prevent expensive API costs. DO NOT USE GEMINI. Install Ollama instead: brew install ollama && ollama serve && ollama pull llama3.2:3b"
}
```

## Verification

To verify Gemini is completely removed:

```bash
# Check for any Gemini imports in codebase
grep -r "from.*gemini-client" prepflow-web/scripts prepflow-web/app/api
grep -r "generateTextWithGemini" prepflow-web/scripts prepflow-web/app/api
grep -r "useGemini\|forceGemini" prepflow-web/scripts prepflow-web/app/api

# Should return NO results (except in disabled gemini-client.ts itself)
```

## Cost Savings

**Before (Gemini Fallback):**

- Gemini 1.5 Flash: ~$0.0006 per recipe
- 10,000 recipes = **$6.00**
- Risk of daily limits and cost explosions

**After (Ollama Only):**

- Ollama: **$0** (completely free, local processing)
- 10,000 recipes = **$0**
- No limits, no costs

**Savings:** 100% cost reduction ✅

## Testing Checklist

After migration, verify:

- [ ] Recipe processing works with Ollama
- [ ] Recipe processing fails with clear error if Ollama not available
- [ ] No Gemini API calls are made (check logs)
- [ ] Error messages are helpful and direct to Ollama setup
- [ ] All API endpoints use Ollama only

## Troubleshooting

### Issue: "Ollama is not available"

**Solution:**

```bash
# Start Ollama
ollama serve

# Or on macOS/Linux, ensure service is running:
brew services start ollama  # macOS
systemctl start ollama      # Linux
```

### Issue: "Model not found"

**Solution:**

```bash
# Pull the recommended model
ollama pull llama3.2:3b

# Or use an alternative
ollama pull qwen2.5:3b
ollama pull phi3:mini
```

### Issue: TypeScript Errors in UI Components

**Note:** Some TypeScript errors may appear in UI components (e.g., `ProcessingStatus`) related to status properties. These are unrelated to Gemini removal and should be fixed separately.

## References

- **Ollama Setup Guide:** `docs/OLLAMA_SETUP_GUIDE.md`
- **Gemini Removal Documentation:** `docs/GEMINI_REMOVAL.md`
- **Ollama Documentation:** https://docs.ollama.com/

## Safety

**All Gemini functions are disabled** and will throw errors immediately if accidentally called. This prevents any possibility of expensive API costs from exploding.

**No fallback:** If Ollama is not available, processing will fail. This is intentional to prevent accidental Gemini usage and costs.
