import { type TemplateVariant } from '../print-template';

import type { PreviewData } from './preview-data/types';
import { compliancePreview } from './preview-data/variants/compliance';
import { defaultPreview } from './preview-data/variants/default';
import { kitchenPreview } from './preview-data/variants/kitchen';
import { menuPreview } from './preview-data/variants/menu';
import { recipePreview } from './preview-data/variants/recipe';
import { runsheetPreview } from './preview-data/variants/runsheet';
import { supplierPreview } from './preview-data/variants/supplier';

export type { PreviewData } from './preview-data/types';

const VARIANT_MAP: Partial<Record<TemplateVariant, PreviewData>> = {
  menu: menuPreview,
  recipe: recipePreview,
  kitchen: kitchenPreview,
  supplier: supplierPreview,
  runsheet: runsheetPreview,
  compliance: compliancePreview,
};

export function getPreviewData(variant: TemplateVariant): PreviewData {
  return VARIANT_MAP[variant] ?? defaultPreview;
}
