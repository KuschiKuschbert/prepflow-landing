# Recipe Scraper Optimization Plan

**Date:** 2026-01-03
**Goal:** Further optimize scraping speed beyond parallel source processing

## Current Performance

- **Parallel Sources:** ✅ Implemented (all 5 sources simultaneously)
- **Within-Source Processing:** ❌ Sequential (one recipe at a time)
- **Delay Between Requests:** 2 seconds (conservative)
- **Estimated Time:** ~1.1 days (26 hours)

## Optimization Opportunities

### 1. Within-Source Parallelization (HIGHEST IMPACT) ⚡

**Current:** Process recipes one at a time within each source
**Optimization:** Process 3-5 recipes concurrently per source

**Impact:**
- **3x-5x faster** within each source
- **Total time reduction:** ~75-80% (from 26h to ~5-7 hours)

**Implementation:**
- Use `Promise.all()` with concurrency limit (3-5 concurrent requests per source)
- Each source can have 3-5 requests in flight simultaneously
- With 5 sources × 3-5 concurrent = 15-25 total concurrent requests

**Risk:** Low - Each source has independent rate limiting

### 2. Adaptive Rate Limiting (MEDIUM IMPACT) 📊

**Current:** Fixed 2-second delay between requests
**Optimization:** Start with 1 second, increase if rate limited

**Impact:**
- **2x faster** if no rate limits hit
- Falls back to 2 seconds if rate limited

**Implementation:**
- Start with 1-second delay
- Monitor for 429 errors
- Increase delay if rate limited
- Decrease delay if no errors for N requests

**Risk:** Low - Has fallback mechanism

### 3. HTTP Connection Reuse (LOW-MEDIUM IMPACT) 🔗

**Current:** Axios already uses connection pooling
**Optimization:** Explicit keep-alive, connection limits

**Impact:**
- **10-20% faster** (reduces connection overhead)
- Better for high-volume scraping

**Implementation:**
- Configure HTTP agent with keep-alive
- Set max connections per host
- Reuse connections across requests

**Risk:** Very Low - Standard HTTP optimization

### 4. Batch URL Discovery (LOW IMPACT) 📋

**Current:** Discover all URLs upfront
**Optimization:** Already optimal (sitemap parsing is fast)

**Impact:** Minimal - URL discovery is already fast

### 5. Streaming Parsers (LOW IMPACT) 🌊

**Current:** Load full HTML into memory
**Optimization:** Stream parsing for very large pages

**Impact:**
- **5-10% faster** for large pages
- Lower memory usage

**Risk:** Low - Only affects very large pages

## Recommended Implementation Order

1. **Within-Source Parallelization** (3-5 concurrent per source) - **HIGHEST IMPACT**
2. **Adaptive Rate Limiting** (1s default, increase if needed) - **MEDIUM IMPACT**
3. **HTTP Connection Optimization** (keep-alive, pooling) - **LOW-MEDIUM IMPACT**

## Expected Performance After Optimizations

| Optimization | Time Reduction | New Estimated Time |
|--------------|----------------|-------------------|
| Current (Parallel Sources) | Baseline | ~26 hours |
| + Within-Source Parallel (3x) | -67% | ~8.5 hours |
| + Adaptive Rate Limiting (2x) | -50% | ~4-5 hours |
| + HTTP Optimization (10%) | -10% | ~4-4.5 hours |

**Total Improvement:** From ~26 hours to **~4-5 hours** (80-85% faster!)

## Implementation Strategy

### Phase 1: Within-Source Parallelization (Implement Now)

- Add concurrency limit (3-5) per source
- Use `p-limit` or similar for concurrency control
- Process batches with parallel requests

### Phase 2: Adaptive Rate Limiting (Implement Next)

- Start with 1-second delay
- Track rate limit errors
- Adjust delay dynamically

### Phase 3: HTTP Optimization (Optional)

- Configure HTTP agent
- Set connection limits
- Monitor connection reuse

## Risk Assessment

**Low Risk:**
- Each optimization has fallback mechanisms
- Rate limiting prevents abuse
- Progress tracking remains accurate
- Error handling isolated per request

**Monitoring:**
- Track rate limit errors
- Monitor request success rate
- Watch for connection errors
- Log performance metrics
