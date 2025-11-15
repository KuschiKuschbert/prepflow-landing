'use client';

import IngredientsClient from '../../ingredients/components/IngredientsClient';

/**
 * IngredientsTab - Wrapper component for IngredientsClient
 * Used in Recipe Book to embed ingredients management without duplicate PageHeader
 */
export function IngredientsTab() {
  return <IngredientsClient hideHeader={true} />;
}
