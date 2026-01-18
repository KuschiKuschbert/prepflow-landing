export interface PrepListToCreate {
  sectionId: string | null;
  name: string;
  notes?: string;
  items: Array<{
    ingredientId: string;
    quantity?: string;
    unit?: string;
    notes?: string;
  }>;
}

export interface BatchCreateResult {
  createdIds: string[];
  errors: Array<{ prepListName: string; error: string }>;
}
