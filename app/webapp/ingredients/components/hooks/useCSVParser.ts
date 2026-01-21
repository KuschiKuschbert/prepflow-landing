import { parseIngredientsCSV } from '@/app/webapp/ingredients/hooks/helpers/csvImport';
import { logger } from '@/lib/logger';
import { useState } from 'react';
import type { Ingredient } from './useCSVImport';

export function useCSVParser() {
  const [csvData, setCsvData] = useState<string>('');
  const [parsedIngredients, setParsedIngredients] = useState<Partial<Ingredient>[]>([]);
  const [error, setError] = useState<string | null>(null);

  const parseCSVWithAI = (csvText: string) => {
    try {
      if (!csvText || csvText.trim().length === 0) {
        setError('CSV file is empty');
        setParsedIngredients([]);
        return;
      }

      const result = parseIngredientsCSV(csvText);

      if (result.errors.length > 0) {
        setError(
          `CSV parsing errors:\n${result.errors.slice(0, 5).join('\n')}${result.errors.length > 5 ? `\n... and ${result.errors.length - 5} more errors` : ''}`,
        );
      } else {
        setError(null);
      }

      if (result.ingredients.length === 0) {
        setError('No valid ingredients found in CSV file');
        setParsedIngredients([]);
        return;
      }

      setParsedIngredients(result.ingredients);
    } catch (err) {
      logger.error('[CSV Import Modal] Failed to parse CSV:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
      setParsedIngredients([]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      const csvText = e.target?.result as string;
      setCsvData(csvText);
      parseCSVWithAI(csvText);
    };
    reader.readAsText(file);
  };

  const resetParser = () => {
    setCsvData('');
    setParsedIngredients([]);
    setError(null);
  };

  return {
    csvData,
    setCsvData,
    parsedIngredients,
    setParsedIngredients,
    error,
    setError,
    handleFileUpload,
    resetParser,
  };
}
