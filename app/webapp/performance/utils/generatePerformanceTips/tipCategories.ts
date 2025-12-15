import { generateCleanupTips } from './tipCategories/helpers/generateCleanupTips';
import { generateDataQualityTips } from './tipCategories/helpers/generateDataQualityTips';
import { generateGrowthTips } from './tipCategories/helpers/generateGrowthTips';
import { generateMarketingTips } from './tipCategories/helpers/generateMarketingTips';
import { generatePricingTips } from './tipCategories/helpers/generatePricingTips';
import { generateStrategyTips } from './tipCategories/helpers/generateStrategyTips';
import type { PerformanceItem } from '../../types';

export interface PerformanceTip {
  priority: 'high' | 'medium' | 'low';
  category: string;
  message: string;
  action?: string;
}

export { generateStrategyTips, generateCleanupTips, generateMarketingTips, generatePricingTips, generateGrowthTips, generateDataQualityTips };
