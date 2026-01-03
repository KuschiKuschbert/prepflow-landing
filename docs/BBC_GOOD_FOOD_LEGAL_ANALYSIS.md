# BBC Good Food Legal Compliance Analysis

**Date:** 2026-01-03
**Site:** bbcgoodfood.com
**Operator:** Immediate Media Company Limited
**Terms of Service:** https://www.immediate.co.uk/terms-and-conditions/

## Executive Summary

⚠️ **CRITICAL LEGAL CONCERN:** BBC Good Food's Terms of Service explicitly prohibit:
1. **Commercial use** of their content
2. **Copying/storing** their content in any medium

**Recommendation:** Remove BBC Good Food from production scraper OR obtain written permission from Immediate Media Company.

---

## Robots.txt Compliance ✅

**Status:** ✅ Compliant

**URL:** https://www.bbcgoodfood.com/robots.txt

**Findings:**
- Recipe pages (`/recipes/`) are **NOT disallowed** - scraping is technically allowed
- Sitemap available: `https://www.bbcgoodfood.com/sitemap.xml`
- No crawl-delay specified for general user-agents
- Disallowed paths: `/account/*`, `/api/*`, `/search*`, `/subscribe/`, etc. (we don't scrape these)

**Our Implementation:**
- ✅ Respects robots.txt directives
- ✅ Only scrapes `/recipes/` paths (allowed)
- ✅ Uses sitemap for URL discovery (recommended method)
- ✅ Implements rate limiting (2-second default delay)
- ✅ Uses proper User-Agent with contact information

**Conclusion:** From a robots.txt perspective, scraping BBC Good Food recipe pages is allowed.

---

## Terms of Service Analysis ⚠️

**Source:** https://www.immediate.co.uk/terms-and-conditions/
**Last Updated:** September 2025

### Critical Restrictions

#### Section 5 - Personal and Non-Commercial Use Only

> "In accessing our Services, you agree that you will only access its contents for your own **personal and non-commercial use** and not for any commercial or other purposes, including advertising or selling any goods or services."

**Analysis:**
- ❌ **PrepFlow is a commercial SaaS product** - violates this restriction
- ❌ **Storing recipes for AI use in a commercial product** - likely violates this restriction
- ⚠️ **"Personal and non-commercial use"** is explicitly required

#### Section 10 - Prohibition on Copying/Storing

> "Except as specifically permitted on our Services, you undertake not to **copy, store in any medium** (including on any other website), distribute, transmit, re-transmit, re-publish, broadcast, modify, or show in public any part of our Services without our prior written permission."

**Analysis:**
- ❌ **Storing recipe data** - explicitly prohibited
- ❌ **Copying recipe content** - explicitly prohibited
- ⚠️ **"Prior written permission"** required for any use beyond personal/non-commercial

### Legal Assessment

**Violations:**
1. ❌ **Commercial Use:** PrepFlow is a commercial SaaS product, violating Section 5
2. ❌ **Copying/Storing:** Storing recipe data violates Section 10
3. ⚠️ **Written Permission Required:** Any use beyond personal/non-commercial requires written permission

**Risk Level:** 🔴 **HIGH** - Explicit terms violations

---

## Recommendations

### Option 1: Remove BBC Good Food (Safest) ⭐ **RECOMMENDED**

**Action:**
- Remove `SOURCES.BBC_GOOD_FOOD` from scraper sources
- Remove `BBCGoodFoodScraper` from production code
- Keep scraper code for reference but disable in production

**Pros:**
- ✅ Eliminates legal risk
- ✅ No need for licensing negotiations
- ✅ Simplifies compliance

**Cons:**
- ❌ Loses access to BBC Good Food recipes
- ❌ Need to find alternative sources

**Implementation:**
```typescript
// In config.ts - remove from default sources
export const DEFAULT_SOURCES = [
  SOURCES.ALLRECIPES,
  // SOURCES.BBC_GOOD_FOOD, // REMOVED - Terms of Service violation
  SOURCES.FOOD_NETWORK,
  SOURCES.EPICURIOUS,
  SOURCES.BON_APPETIT,
  SOURCES.TASTY,
];
```

### Option 2: Obtain Written Permission

**Action:**
- Contact Immediate Media Company for licensing agreement
- Email: legal@immediate.co.uk (from terms)
- Request permission for recipe data collection for internal AI use
- Document permission if granted

**Request Template:**
```
Subject: Request for Permission to Use BBC Good Food Recipe Data

Dear Immediate Media Legal Team,

I am writing to request written permission to collect recipe data from
bbcgoodfood.com for use in our commercial SaaS product, PrepFlow.

Use Case:
- Internal AI recipe suggestions
- Recipe data stored locally (not republished)
- Attribution maintained (source URLs stored)
- Commercial SaaS product ($29/month subscription)

We currently:
- Respect robots.txt directives
- Implement rate limiting (2-second delays)
- Use structured data (JSON-LD) when available
- Store source attribution for all recipes

We would like to:
- Collect recipe data (ingredients, instructions, metadata)
- Store data locally for internal AI use
- Not republish recipes verbatim
- Maintain source attribution

Please advise if this use case is permitted under your Terms of Service,
or if a licensing agreement is required.

Thank you for your consideration.

Best regards,
[Your Name]
PrepFlow Team
hello@prepflow.org
```

**Pros:**
- ✅ Legal compliance if permission granted
- ✅ Maintains access to BBC Good Food recipes
- ✅ Professional approach

**Cons:**
- ❌ May be denied
- ❌ May require licensing fees
- ❌ Time-consuming process
- ❌ No guarantee of approval

### Option 3: Personal/Non-Commercial Use Only

**Action:**
- Only use for personal, non-commercial purposes
- Remove from production scraper
- Keep for personal use only

**Pros:**
- ✅ Complies with terms (if truly non-commercial)

**Cons:**
- ❌ Not suitable for PrepFlow (commercial SaaS product)
- ❌ Would require removing from production scraper
- ❌ Defeats purpose of commercial product

---

## Current Status

**Scraper Status:**
- ✅ **Technically Working:** Scraper successfully extracts recipe data
- ✅ **Robots.txt Compliant:** Respects robots.txt directives
- ⚠️ **Terms of Service:** Likely violates Section 5 (commercial use) and Section 10 (copying/storing)

**Action Required:**
- [ ] **DECISION NEEDED:** Remove BBC Good Food OR obtain written permission
- [ ] If removing: Update scraper configuration to exclude BBC Good Food
- [ ] If obtaining permission: Contact legal@immediate.co.uk
- [ ] Document decision and rationale

---

## Legal Disclaimer

This analysis is for informational purposes only and does not constitute legal advice. Always consult with qualified legal counsel before making decisions about content usage and compliance.

**Contact for Legal Questions:**
- Immediate Media Legal: legal@immediate.co.uk
- PrepFlow Contact: hello@prepflow.org

---

## References

- **Terms of Service:** https://www.immediate.co.uk/terms-and-conditions/
- **Robots.txt:** https://www.bbcgoodfood.com/robots.txt
- **Privacy Policy:** https://www.immediate.co.uk/privacy/
- **Company:** Immediate Media Company Limited (Company No. 07635200)
