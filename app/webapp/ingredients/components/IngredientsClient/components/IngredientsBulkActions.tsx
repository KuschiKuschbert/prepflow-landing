import { BulkAllergenDetection } from '../../BulkAllergenDetection';

interface IngredientsBulkActionsProps {
  hideHeader: boolean;
  onComplete: () => void;
}

/**
 * Component for bulk actions section
 */
export function IngredientsBulkActions({ hideHeader, onComplete }: IngredientsBulkActionsProps) {
  if (hideHeader) return null;

  return (
    <div className="mb-6 flex justify-end">
      <BulkAllergenDetection onComplete={onComplete} />
    </div>
  );
}
