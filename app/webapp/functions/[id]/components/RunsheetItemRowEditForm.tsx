'use client';

import { Button } from '@/components/ui/Button';
import { TimeSelect } from '@/components/ui/TimeSelect';
import type { DishOption, MenuOption, RecipeOption } from './RunsheetPanel';

const inputClasses =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-colors';

const tabClasses = (active: boolean) =>
  `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
    active
      ? 'bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30'
      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50'
  }`;

type LinkTab = 'dishes' | 'recipes' | 'menus';

interface RunsheetItemRowEditFormProps {
  editTime: string;
  setEditTime: (v: string) => void;
  editDescription: string;
  setEditDescription: (v: string) => void;
  editType: 'meal' | 'activity' | 'setup' | 'other';
  setEditType: (v: 'meal' | 'activity' | 'setup' | 'other') => void;
  linkTab: LinkTab;
  setLinkTab: (v: LinkTab) => void;
  editDishId: string;
  setEditDishId: (v: string) => void;
  editRecipeId: string;
  setEditRecipeId: (v: string) => void;
  editMenuId: string;
  setEditMenuId: (v: string) => void;
  clearOtherSelections: (except: LinkTab) => void;
  menus: MenuOption[];
  dishes: DishOption[];
  recipes: RecipeOption[];
  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export function RunsheetItemRowEditForm({
  editTime,
  setEditTime,
  editDescription,
  setEditDescription,
  editType,
  setEditType,
  linkTab,
  setLinkTab,
  editDishId,
  setEditDishId,
  editRecipeId,
  setEditRecipeId,
  editMenuId,
  setEditMenuId,
  clearOtherSelections,
  menus,
  dishes,
  recipes,
  isSaving,
  onCancel,
  onSave,
}: RunsheetItemRowEditFormProps) {
  const functionMenus = menus.filter(
    m => m.menu_type === 'function' || m.menu_type?.startsWith('function_'),
  );
  const otherMenus = menus.filter(
    m => m.menu_type !== 'function' && !m.menu_type?.startsWith('function_'),
  );

  return (
    <div className="space-y-3 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--foreground-secondary)]">
            Time
          </label>
          <TimeSelect value={editTime} onChange={setEditTime} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--foreground-secondary)]">
            Type
          </label>
          <select
            className={inputClasses}
            value={editType}
            onChange={e => setEditType(e.target.value as 'meal' | 'activity' | 'setup' | 'other')}
          >
            <option value="activity">Activity</option>
            <option value="meal">Meal Service</option>
            <option value="setup">Setup</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-[var(--foreground-secondary)]">
          Description
        </label>
        <input
          type="text"
          className={inputClasses}
          value={editDescription}
          onChange={e => setEditDescription(e.target.value)}
          placeholder="e.g., Guests arrive, Canapes served..."
          autoFocus
        />
      </div>

      {editType === 'meal' && (
        <div className="space-y-2">
          <label className="mb-1 block text-xs font-medium text-[var(--foreground-secondary)]">
            Link to dish, recipe, or menu
          </label>
          <div className="flex gap-1.5">
            <button
              type="button"
              className={tabClasses(linkTab === 'dishes')}
              onClick={() => {
                setLinkTab('dishes');
                clearOtherSelections('dishes');
              }}
            >
              Dishes
            </button>
            <button
              type="button"
              className={tabClasses(linkTab === 'recipes')}
              onClick={() => {
                setLinkTab('recipes');
                clearOtherSelections('recipes');
              }}
            >
              Recipes
            </button>
            <button
              type="button"
              className={tabClasses(linkTab === 'menus')}
              onClick={() => {
                setLinkTab('menus');
                clearOtherSelections('menus');
              }}
            >
              Menus
            </button>
          </div>
          {linkTab === 'dishes' && dishes.length > 0 && (
            <select
              className={inputClasses}
              value={editDishId}
              onChange={e => setEditDishId(e.target.value)}
            >
              <option value="">No dish linked</option>
              {dishes.map(d => (
                <option key={d.id} value={d.id}>
                  {d.dish_name} {d.selling_price ? `($${d.selling_price.toFixed(2)})` : ''}
                </option>
              ))}
            </select>
          )}
          {linkTab === 'recipes' && recipes.length > 0 && (
            <select
              className={inputClasses}
              value={editRecipeId}
              onChange={e => setEditRecipeId(e.target.value)}
            >
              <option value="">No recipe linked</option>
              {recipes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.recipe_name}
                </option>
              ))}
            </select>
          )}
          {linkTab === 'menus' && menus.length > 0 && (
            <select
              className={inputClasses}
              value={editMenuId}
              onChange={e => setEditMenuId(e.target.value)}
            >
              <option value="">No menu linked</option>
              {functionMenus.length > 0 && (
                <optgroup label="Function Menus">
                  {functionMenus.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.menu_name}
                    </option>
                  ))}
                </optgroup>
              )}
              {otherMenus.length > 0 && (
                <optgroup label="A La Carte Menus">
                  {otherMenus.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.menu_name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onSave}
          loading={isSaving}
          disabled={!editDescription.trim()}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
