# AI-Enhanced Recipe Scraper Research

**Date:** 2026-01-03
**Purpose:** Research and test AI-enhanced scraping solutions to improve recipe extraction robustness

## Current Approach

Our current scrapers use a two-tier approach:

1. **Primary:** JSON-LD structured data parsing (most reliable, ~90% success rate)
2. **Fallback:** HTML parsing with CSS selectors (cheerio-based, site-specific)

**Limitations:**

- HTML selectors break when sites change their structure
- Some sites have complex/nested HTML that's hard to parse
- Manual selector maintenance required for each site

## AI-Enhanced Options

### 1. Crawl4AI (Python-based)

**Pros:**

- LLM-based extraction (can use Hugging Face models)
- Automatic HTML-to-Markdown conversion
- Multiple extraction strategies (LLM, CSS/XPath)
- Async crawling support
- Open source

**Cons:**

- Python-based (we're Node.js/TypeScript)
- Would require Python service or API wrapper
- Slower than direct HTML parsing
- API costs if using cloud LLMs

**Integration Options:**

- **Option A:** Python microservice with REST API
- **Option B:** Direct Python script called from Node.js
- **Option C:** Use Crawl4AI's Hugging Face Space API

**GitHub:** https://github.com/unclecode/crawl4ai
**Hugging Face Space:** https://huggingface.co/spaces/Echo-AI-official/Crawl4AI

### 2. Hugging Face Inference API (Direct)

**Pros:**

- Direct API access (no Python service needed)
- Can use fine-tuned models for structured extraction
- Pay-per-use pricing
- Fast inference

**Cons:**

- Need to find/use appropriate models
- May need to fine-tune for recipe extraction
- API rate limits and costs

**Potential Models:**

- **Information Extraction Models:** `microsoft/deberta-v3-base`, `dslim/bert-base-NER`
- **Question Answering:** For extracting specific fields
- **Text Classification:** For identifying recipe sections

**API Docs:** https://huggingface.co/docs/api-inference

### 3. OpenAI/Anthropic API (Structured Extraction)

**Pros:**

- Excellent structured data extraction
- JSON mode support
- High accuracy
- Easy to use

**Cons:**

- Expensive for large-scale scraping
- Rate limits
- External dependency

### 4. JigsawStack AI Scraper

**Pros:**

- Hugging Face Space available
- Structured data extraction
- No setup required

**Cons:**

- External service dependency
- May have rate limits
- Less control

**Hugging Face Space:** Available via API

## Recommended Approach: Hybrid Strategy

### Phase 1: Test Hugging Face Inference API

**Test Plan:**

1. Use Hugging Face Inference API with a text extraction model
2. Send HTML content to model with a prompt for recipe extraction
3. Parse structured JSON response
4. Compare accuracy vs. current JSON-LD/HTML parsing

**Models to Test:**

- `microsoft/deberta-v3-base` (general extraction)
- `dslim/bert-base-NER` (named entity recognition for ingredients)
- `google/flan-t5-base` (instruction following for structured extraction)

### Phase 2: Fallback Integration

**Strategy:**

1. Try JSON-LD parsing first (fastest, most reliable)
2. Try HTML parsing with selectors (fast, site-specific)
3. **NEW:** Fallback to AI extraction if both fail (robust, slower)

**Implementation:**

- Add `AIExtractor` class that uses Hugging Face API
- Integrate as fallback in `BaseScraper.parseRecipe()`
- Only use AI when traditional methods fail (cost optimization)

### Phase 3: Selective AI Enhancement

**Strategy:**

- Use AI extraction for:
  - Sites with complex/nested HTML
  - Sites that frequently change structure
  - Sites where JSON-LD is missing and HTML parsing fails

## Test Implementation Plan

### Test 1: Hugging Face Inference API

**Goal:** Test if we can extract recipe data using HF Inference API

**Steps:**

1. Create `scripts/recipe-scraper/utils/ai-extractor.ts`
2. Implement HF Inference API client
3. Test on 5-10 recipe URLs (mix of working and failing ones)
4. Compare accuracy vs. current scrapers

### Test 2: Cost Analysis

**Goal:** Understand API costs for large-scale scraping

**Metrics:**

- Cost per recipe extraction
- Success rate improvement
- Speed comparison

### Test 3: Integration Test

**Goal:** Integrate AI extraction as fallback

**Steps:**

1. Add AI extractor to `BaseScraper`
2. Test on comprehensive scraper job
3. Monitor success rate and costs

## Recipe-Specific Models

**Search Results:**

- No dedicated recipe extraction models found on Hugging Face
- Recipe generation models exist (GPT-2 fine-tuned)
- General NER and extraction models can be adapted

**Recommendation:**

- Use general structured extraction models
- Fine-tune on recipe dataset if needed (future work)

## Implementation Status

### ✅ Completed

1. **Research:** Comprehensive research on AI-enhanced scraping options
2. **AI Extractor Framework:** Created `scripts/recipe-scraper/utils/ai-extractor.ts` with:
   - Hugging Face Inference API integration
   - HTML text extraction
   - Structured data extraction placeholder
   - Error handling and rate limiting awareness
3. **Test Script:** Created `scripts/recipe-scraper/test-ai-extractor.ts` for comparison testing
4. **Documentation:** Updated README with AI extraction section

### ⏳ Next Steps

1. **Find Appropriate Model:** Research and test Hugging Face models for structured extraction
   - Test `google/flan-t5-base` for instruction following
   - Test `microsoft/deberta-v3-base` for general extraction
   - Consider fine-tuning on recipe dataset
2. **Implement Model Integration:** Complete the `extractStructuredData()` method with actual model calls
3. **Test on Sample URLs:** Run comparison tests on 10-20 recipe URLs
4. **Integrate as Fallback:** Add AI extraction to `BaseScraper.parseRecipe()` as fallback
5. **Cost Analysis:** Monitor API usage and costs
6. **Performance Optimization:** Cache results, batch requests if possible

## Recommended Models to Test

### Option 1: Text-to-JSON Models

- **`google/flan-t5-base`** - Instruction following, can generate JSON
- **`microsoft/phi-2`** - Small, efficient, good for structured output
- **`mistralai/Mistral-7B-Instruct-v0.2`** - Strong instruction following

### Option 2: Named Entity Recognition (NER)

- **`dslim/bert-base-NER`** - Extract ingredients as entities
- **`dbmdz/bert-large-cased-finetuned-conll03-english`** - General NER

### Option 3: Question Answering

- **`deepset/roberta-base-squad2`** - Extract specific fields via questions
- **`distilbert-base-cased-distilled-squad`** - Faster QA model

### Option 4: Fine-Tuning Approach

- Fine-tune a base model (like `bert-base-uncased`) on recipe extraction dataset
- Use Recipe-NLG dataset or create custom dataset from scraped recipes
- Deploy fine-tuned model to Hugging Face Hub

## Cost Considerations

**Hugging Face Inference API:**

- Free tier: Limited requests
- Pay-per-use: ~$0.001-0.01 per request (depends on model)
- For 10,000 recipes: ~$10-100 (one-time cost)

**Recommendation:**

- Use AI extraction only as fallback (when traditional methods fail)
- Estimate: ~5-10% of recipes would need AI extraction
- Cost: ~$0.50-5.00 per 10,000 recipes (acceptable)

## Integration Strategy

### Phase 1: Testing (Current)

- Test AI extractor on sample URLs
- Compare accuracy vs. traditional methods
- Measure speed and cost

### Phase 2: Selective Integration

- Add AI extraction as fallback in `BaseScraper`
- Only use when JSON-LD and HTML parsing both fail
- Log usage for monitoring

### Phase 3: Optimization

- Cache AI extraction results
- Batch similar requests
- Fine-tune model for better accuracy

## Alternative: Local Model

**Option:** Run model locally instead of API

- Use `@xenova/transformers` (JavaScript/TypeScript)
- No API costs
- Slower but more control
- Good for high-volume scraping

**Models to consider:**

- `Xenova/bert-base-uncased` (NER)
- `Xenova/distilbert-base-uncased` (faster)
