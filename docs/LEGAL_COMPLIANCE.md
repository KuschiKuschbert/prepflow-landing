# Legal Compliance for Recipe Scraper

**Last Updated:** 2026-01-03
**Purpose:** Document legal compliance measures for recipe scraping

## Legal Compliance Measures

### ✅ Implemented Safeguards

1. **Robots.txt Compliance**
   - ✅ Automatically checks `robots.txt` before scraping
   - ✅ Respects `Disallow` directives
   - ✅ Honors `Crawl-delay` settings
   - ✅ Caches robots.txt to avoid repeated requests
   - ✅ Fails gracefully if robots.txt is unavailable

2. **Rate Limiting**
   - ✅ Default 2-second delay between requests
   - ✅ Respects crawl-delay from robots.txt
   - ✅ Implements exponential backoff on rate limit errors (429)
   - ✅ 60-second delay after rate limit errors

3. **User-Agent Identification**
   - ✅ Includes contact information: `PrepFlow Recipe Scraper (contact: hello@prepflow.org)`
   - ✅ Transparent about automated access
   - ✅ Provides way for site owners to contact us

4. **Data Attribution**
   - ✅ Stores source URL for all recipes
   - ✅ Stores author information when available
   - ✅ Maintains source attribution in database

5. **No Personal Data Collection**
   - ✅ Only extracts publicly available recipe data
   - ✅ No user accounts, emails, or personal information
   - ✅ No comments or user-generated content beyond recipes

6. **Terms of Service Compliance**
   - ✅ Respects robots.txt (industry standard)
   - ✅ Implements rate limiting (prevents server overload)
   - ✅ Uses structured data (JSON-LD) when available (preferred method)
   - ✅ Only extracts publicly accessible content

### Legal Considerations

#### Copyright

- **Recipe Facts:** Generally not copyrightable (facts, ingredients, basic instructions)
- **Recipe Descriptions:** May be copyrighted (we store but don't republish verbatim)
- **Images:** Copyrighted (we store URLs, not images themselves)
- **Best Practice:** We store recipes for internal AI use, not public republishing

#### Fair Use

- **Purpose:** Internal use for AI recipe suggestions (transformative)
- **Nature:** Factual data (recipes are factual information)
- **Amount:** Only necessary recipe data (ingredients, instructions, metadata)
- **Effect:** No commercial impact on original sites (we're not republishing)

#### Data Protection (GDPR/CCPA)

- **No Personal Data:** We don't collect personal information
- **Public Data Only:** Only publicly available recipe data
- **No User Tracking:** No cookies, tracking, or user identification

### Recommended Best Practices

1. **Review Terms of Service:** Check each site's ToS before scraping
2. **Use APIs When Available:** Prefer official APIs over scraping
3. **Respect Rate Limits:** Don't overload servers
4. **Provide Attribution:** Always credit original sources
5. **Monitor Changes:** Update scrapers when sites change structure

### Current Implementation Status

**✅ Fully Compliant:**

- Robots.txt checking
- Rate limiting
- User-Agent identification
- Source attribution
- No personal data collection

**⚠️ Recommended:**

- Periodic review of terms of service for each site
- Monitor for robots.txt changes
- Update scrapers when site structures change

### Legal Disclaimer

This scraper is designed for educational and internal use. Always:

- Review and comply with each website's Terms of Service
- Respect copyright and intellectual property rights
- Use scraped data responsibly and ethically
- Consult legal counsel for commercial use

## Site-Specific Legal Analysis

### BBC Good Food (bbcgoodfood.com)

**Last Reviewed:** 2026-01-03

#### Robots.txt Compliance ✅

**Status:** ✅ Compliant

**Findings:**

- Recipe pages (`/recipes/`) are **NOT disallowed** - scraping is technically allowed
- Sitemap available: `https://www.bbcgoodfood.com/sitemap.xml`
- No crawl-delay specified for general user-agents
- Disallowed paths: `/account/*`, `/api/*`, `/search*`, `/subscribe/`, etc. (we don't scrape these)

**Our Implementation:**

- ✅ Respects robots.txt directives
- ✅ Only scrapes `/recipes/` paths (allowed)
- ✅ Uses sitemap for URL discovery (recommended method)

#### Terms of Service Analysis ⚠️

**Source:** https://www.immediate.co.uk/terms-and-conditions/ (BBC Good Food is operated by Immediate Media Company)

**Critical Restrictions Found:**

1. **Section 5 - Personal and Non-Commercial Use Only:**

   > "In accessing our Services, you agree that you will only access its contents for your own **personal and non-commercial use** and not for any commercial or other purposes, including advertising or selling any goods or services."

2. **Section 10 - Prohibition on Copying/Storing:**
   > "Except as specifically permitted on our Services, you undertake not to **copy, store in any medium** (including on any other website), distribute, transmit, re-transmit, re-publish, broadcast, modify, or show in public any part of our Services without our prior written permission."

**Legal Assessment:**

- ❌ **Commercial Use Prohibited:** Terms explicitly prohibit commercial use
- ❌ **Copying/Storing Prohibited:** Terms explicitly prohibit storing content
- ⚠️ **Written Permission Required:** Any use beyond personal/non-commercial requires written permission

**Recommendations:**

1. **Option 1: Remove BBC Good Food (Safest)**
   - Remove from scraper sources
   - Avoids any legal risk
   - Recommended for commercial use

2. **Option 2: Obtain Written Permission**
   - Contact Immediate Media Company for licensing agreement
   - Email: legal@immediate.co.uk (from terms)
   - Request permission for recipe data collection for internal AI use
   - Document permission if granted

3. **Option 3: Personal/Non-Commercial Use Only**
   - Only use for personal, non-commercial purposes
   - Not suitable for PrepFlow (commercial SaaS product)
   - Would require removing from production scraper

**Current Status:**

- ✅ **REMOVED from production scraper** (2026-01-03)
- ✅ **Decision:** Removed to avoid Terms of Service violation
- ✅ **Documentation:** See `docs/BBC_GOOD_FOOD_REMOVAL.md` for removal details
- ✅ **Legal Analysis:** See `docs/BBC_GOOD_FOOD_LEGAL_ANALYSIS.md` for complete analysis

**Action Taken:**

- ✅ Removed BBC Good Food from all production code
- ✅ Scraper implementation kept for reference (disabled)
- ✅ All attempts to use BBC Good Food scraper throw error with explanation
- ✅ UI components updated to remove BBC Good Food option

### Other Sites

**Active Sources (5):**

- ✅ **AllRecipes** - robots.txt compliant, terms review pending
- ✅ **Food Network** - robots.txt compliant, terms review pending
- ✅ **Epicurious** - robots.txt compliant, terms review pending
- ✅ **Bon Appétit** - robots.txt compliant, terms review pending
- ✅ **Tasty** - robots.txt compliant, terms review pending

**Status:**

- Currently relying on robots.txt compliance and fair use
- **Recommended:** Review each site's terms before production use
- **Action:** Periodic legal review of all active sources

### Contact

For questions or concerns about our scraping practices:

- Email: hello@prepflow.org
- User-Agent: PrepFlow Recipe Scraper (contact: hello@prepflow.org)
