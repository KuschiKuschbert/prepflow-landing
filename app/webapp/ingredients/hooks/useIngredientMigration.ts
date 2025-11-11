// PrepFlow - Ingredient Migration Hook
// Extracted from IngredientsClient to meet file size limits

import { useEffect, useState } from 'react';

export function useIngredientMigration(loading: boolean, isLoading: boolean, ingredientsData: any) {
  const [migrationChecked, setMigrationChecked] = useState(false);

  useEffect(() => {
    if (migrationChecked) return;

    const checkAndMigrate = async () => {
      try {
        const migrationKey = 'ingredients_unit_migration_completed';
        const migrationDone = localStorage.getItem(migrationKey);

        if (!migrationDone) {
          const response = await fetch('/api/ingredients/migrate-units', {
            method: 'POST',
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              localStorage.setItem(migrationKey, 'true');
              if (ingredientsData) {
                window.location.reload();
              }
            }
          }
        }
      } catch (err) {
        console.warn('Migration check failed:', err);
      } finally {
        setMigrationChecked(true);
      }
    };

    if (!loading && !isLoading && ingredientsData) {
      checkAndMigrate();
    }
  }, [loading, isLoading, ingredientsData, migrationChecked]);

  return migrationChecked;
}
