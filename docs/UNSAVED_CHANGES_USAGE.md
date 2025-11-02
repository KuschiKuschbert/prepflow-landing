# Unsaved Changes Tracking Usage Guide

## Overview

The webapp now includes a universal logout button that detects unsaved changes across all workspaces. If you attempt to logout with unsaved changes, a confirmation dialog will prompt you to save your work.

## How It Works

### 1. Unsaved Changes Context

The `UnsavedChangesContext` provides a global state for tracking unsaved changes across the entire webapp. Components can register/unregister their unsaved state.

### 2. Logout Button

The `LogoutButton` component in the navigation header:

- Automatically detects if there are any unsaved changes
- Shows a warning icon (red dot) when changes are present
- Displays a confirmation dialog before logging out
- Lists which workspaces have unsaved changes

### 3. Confirmation Dialog

When logout is attempted with unsaved changes:

- Shows a warning dialog
- Lists the workspaces with unsaved changes
- Provides "Cancel" and "Logout Anyway" options
- Uses Material Design 3 styling

## Usage in Forms

To track unsaved changes in your forms, use the `useUnsavedChanges` hook:

```tsx
'use client';

import { useUnsavedChanges } from '@/contexts/UnsavedChangesContext';
import { useState, useEffect } from 'react';

export function MyFormComponent() {
  const { registerUnsavedChanges } = useUnsavedChanges();
  const [formData, setFormData] = useState(initialData);
  const [originalData, setOriginalData] = useState(initialData);

  // Register/unregister unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    if (hasChanges) {
      // Register this component as having unsaved changes
      const unregister = registerUnsavedChanges('My Form');

      // Return cleanup function to unregister when component unmounts or changes are saved
      return unregister;
    }
  }, [formData, originalData, registerUnsavedChanges]);

  const handleSave = async () => {
    // Save data...
    await saveData(formData);

    // Update original data to clear unsaved state
    setOriginalData(formData);
    // Component will automatically unregister when hasChanges becomes false
  };

  return <form>{/* Your form fields */}</form>;
}
```

## Example: Ingredients Form

```tsx
'use client';

import { useUnsavedChanges } from '@/contexts/UnsavedChangesContext';
import { useState, useEffect } from 'react';

export function IngredientsForm({ ingredient }: { ingredient?: Ingredient }) {
  const { registerUnsavedChanges } = useUnsavedChanges();
  const [name, setName] = useState(ingredient?.name || '');
  const [cost, setCost] = useState(ingredient?.cost || 0);
  const [hasChanged, setHasChanged] = useState(false);

  // Track changes
  useEffect(() => {
    const changed = name !== (ingredient?.name || '') || cost !== (ingredient?.cost || 0);

    setHasChanged(changed);

    if (changed) {
      return registerUnsavedChanges('Ingredients');
    }
  }, [name, cost, ingredient, registerUnsavedChanges]);

  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} />
    </form>
  );
}
```

## Example: Recipe Editor

```tsx
'use client';

import { useUnsavedChanges } from '@/contexts/UnsavedChangesContext';
import { useState, useEffect } from 'react';

export function RecipeEditor({ recipe }: { recipe: Recipe }) {
  const { registerUnsavedChanges } = useUnsavedChanges();
  const [recipeData, setRecipeData] = useState(recipe);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const dirty = JSON.stringify(recipeData) !== JSON.stringify(recipe);
    setIsDirty(dirty);

    if (dirty) {
      return registerUnsavedChanges('Recipe Editor');
    }
  }, [recipeData, recipe, registerUnsavedChanges]);

  const handleSave = async () => {
    await saveRecipe(recipeData);
    setIsDirty(false);
    // Will automatically unregister when isDirty becomes false
  };

  return (
    <div>
      {/* Recipe editor */}
      <button onClick={handleSave} disabled={!isDirty}>
        Save
      </button>
    </div>
  );
}
```

## Best Practices

1. **Register Early**: Register unsaved changes as soon as the user makes a change
2. **Clean Up**: Always return the cleanup function from `registerUnsavedChanges`
3. **Descriptive Names**: Use clear, descriptive names for your sources (e.g., "Ingredients", "Recipe Editor", "COGS Calculator")
4. **Auto-Unregister**: The hook automatically unregisters when changes are saved (when `hasUnsavedChanges` becomes false)
5. **Multiple Sources**: Multiple components can register simultaneously - the logout button will list them all

## API Reference

### `useUnsavedChanges()`

Returns:

- `hasUnsavedChanges: boolean` - Whether any component has unsaved changes
- `setHasUnsavedChanges: (hasChanges: boolean) => void` - Manually set unsaved state
- `registerUnsavedChanges: (source: string) => () => void` - Register a component with unsaved changes, returns cleanup function
- `clearUnsavedChanges: () => void` - Clear all unsaved changes
- `unsavedSources: string[]` - List of components with unsaved changes

### Example Hook Usage

```tsx
const { hasUnsavedChanges, registerUnsavedChanges, clearUnsavedChanges, unsavedSources } =
  useUnsavedChanges();

// Register
const unregister = registerUnsavedChanges('My Component');

// Later, unregister
unregister();

// Or clear all
clearUnsavedChanges();
```

## Testing

To test the logout flow:

1. **Without Unsaved Changes:**
   - Click "Logout" button
   - Should logout immediately without dialog

2. **With Unsaved Changes:**
   - Make changes in any form (ingredients, recipes, etc.)
   - Click "Logout" button
   - Should show confirmation dialog
   - Dialog should list which workspace has unsaved changes
   - "Cancel" should close dialog and keep you logged in
   - "Logout Anyway" should proceed with logout

3. **Visual Indicators:**
   - Logout button should show red dot when unsaved changes exist
   - Hover tooltip should indicate unsaved changes
