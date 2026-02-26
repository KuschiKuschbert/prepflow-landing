# PERFORMANCE ANALYSIS SKILL

## PURPOSE

Load when working on the performance analysis page, COGS dashboard, dish profitability analysis, PrepFlow COGS Dynamic methodology, or AI-powered performance insights.

## HOW IT WORKS IN THIS CODEBASE

**PrepFlow COGS Dynamic Methodology:**

- Categories dishes dynamically based on average profit margin and popularity
- `profitThreshold = averageProfitMargin` (above = HIGH, below = LOW)
- `popularityThreshold = averagePopularity × 0.8` (≥ 80% of average = HIGH)
- GST (10%) excluded from all gross profit calculations (Australian standard)
- Only dishes with `number_sold > 0` are included in analysis

**Four classifications:**
| Classification | Profit | Popularity | Action |
|---|---|---|---|
| Chef's Kiss | HIGH | HIGH | Feature it, flaunt it |
| Hidden Gem | HIGH | LOW | Market it, plate it better |
| Bargain Bucket | LOW | HIGH | Adjust price or portion |
| Burnt Toast | LOW | LOW | Remove from menu |

**Data flow:**

1. UI: `app/webapp/performance/page.tsx` + `app/webapp/performance/components/`
2. API: `GET /api/performance` — returns classified dishes with thresholds
3. DB: reads `menu_dishes` with `selling_price`, `number_sold`, `recipe_id`
4. AI tips: `POST /api/ai/performance-tips` — suggestions for underperformers
5. AI insights: `POST /api/ai/performance-insights` — contextual analysis

**Charts:**

- `app/webapp/performance/components/charts/` — Recharts-based performance charts
- Charts show historical COGS trends, profit by category, sales distribution

## STEP-BY-STEP: Understand a performance anomaly

1. Check if dish has `number_sold > 0` (excluded otherwise)
2. Calculate: `gross_profit = (selling_price / 1.1) - recipe_cost` (exclude GST)
3. Compare against `profitThreshold` (= averageProfitMargin across all dishes)
4. Check `popularityThreshold` (= averagePopularity × 0.8)
5. Use `POST /api/ai/performance-tips` for AI-suggested improvements

## GOTCHAS

- **Dynamic thresholds:** Classifications change as the menu changes. A dish may move from "Hidden Gem" to "Burnt Toast" if you add a high-profit dish that raises the average.
- **GST exclusion:** Always use `selling_price / 1.1` for gross profit calculations (Australian 10% GST)
- **Only includes dishes with sales data** — zero-sold dishes won't appear in analysis
- **AI tips are non-critical** — gracefully handle AI service failures

## REFERENCE FILES

- `app/api/performance/route.ts` — main performance calculation
- `app/webapp/performance/page.tsx` — performance dashboard
- `app/webapp/performance/components/charts/index.ts` — chart components
- `app/api/ai/performance-tips/route.ts` — AI improvement suggestions

## RETROFIT LOG

### 2025-02-26 — Batch 2 (primary business domains)

- `app/webapp/performance/components/PerformanceCharts.tsx`: fixed `RefObject<HTMLDivElement>` cast → `RefObject<HTMLDivElement | null>` per project ref type standard

## LAST UPDATED

2025-02-26
