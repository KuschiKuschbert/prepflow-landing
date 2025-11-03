import { useState } from 'react';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
}

export function useIngredientFormState() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [csvData, setCsvData] = useState<string>('');
  const [parsedIngredients, setParsedIngredients] = useState<Partial<Ingredient>[]>([]);
  const [importing, setImporting] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    ingredient_name: '',
    brand: '',
    pack_size: '',
    pack_size_unit: 'g',
    pack_price: 0,
    unit: 'g',
    cost_per_unit: 0,
    supplier: '',
    product_code: '',
    storage_location: '',
    min_stock_level: 0,
    current_stock: 0,
  });

  const resetWizard = () => {
    setWizardStep(1);
    setNewIngredient({
      ingredient_name: '',
      brand: '',
      pack_size: '',
      pack_size_unit: 'g',
      pack_price: 0,
      unit: 'g',
      cost_per_unit: 0,
      supplier: '',
      product_code: '',
      storage_location: '',
      min_stock_level: 0,
      current_stock: 0,
    });
  };

  const resetCSVImport = () => {
    setCsvData('');
    setParsedIngredients([]);
  };

  return {
    showAddForm,
    setShowAddForm,
    editingIngredient,
    setEditingIngredient,
    showCSVImport,
    setShowCSVImport,
    csvData,
    setCsvData,
    parsedIngredients,
    setParsedIngredients,
    importing,
    setImporting,
    wizardStep,
    setWizardStep,
    newIngredient,
    setNewIngredient,
    resetWizard,
    resetCSVImport,
  };
}
