import { useState } from 'react';

import { ExistingIngredient as Ingredient } from '../components/types';

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
