'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { UtensilsCrossed } from 'lucide-react';
import type { DishOption, MenuOption, RecipeOption } from './RunsheetPanel';

type LinkTab = 'dishes' | 'recipes' | 'menus';

const inputClasses =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-colors';

const tabClasses = (active: boolean) =>
  `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
    active
      ? 'bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30'
      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50'
  }`;

interface RunsheetAddFormMealLinkProps {
  linkTab: LinkTab;
  setLinkTab: (v: LinkTab) => void;
  selectedDishId: string;
  setSelectedDishId: (v: string) => void;
  selectedRecipeId: string;
  setSelectedRecipeId: (v: string) => void;
  selectedMenuId: string;
  setSelectedMenuId: (v: string) => void;
  clearOtherSelections: (except: LinkTab) => void;
  menus: MenuOption[];
  dishes: DishOption[];
  recipes: RecipeOption[];
  showCreateMenu: boolean;
  setShowCreateMenu: (v: boolean) => void;
  newMenuName: string;
  setNewMenuName: (v: string) => void;
  isCreatingMenu: boolean;
  onCreateMenu: () => Promise<void>;
  functionName?: string;
}

export function RunsheetAddFormMealLink({
  linkTab,
  setLinkTab,
  selectedDishId,
  setSelectedDishId,
  selectedRecipeId,
  setSelectedRecipeId,
  selectedMenuId,
  setSelectedMenuId,
  clearOtherSelections,
  menus,
  dishes,
  recipes,
  showCreateMenu,
  setShowCreateMenu,
  newMenuName,
  setNewMenuName,
  isCreatingMenu,
  onCreateMenu,
  functionName,
}: RunsheetAddFormMealLinkProps) {
  const functionMenus = menus.filter(
    m => m.menu_type === 'function' || m.menu_type?.startsWith('function_'),
  );
  const otherMenus = menus.filter(
    m => m.menu_type !== 'function' && !m.menu_type?.startsWith('function_'),
  );

  return (
    <div className="space-y-2">
      <label className="mb-1 block text-xs font-medium text-[var(--foreground-secondary)]">
        Link to dish, recipe, or menu (optional)
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
          Dishes ({dishes.length})
        </button>
        <button
          type="button"
          className={tabClasses(linkTab === 'recipes')}
          onClick={() => {
            setLinkTab('recipes');
            clearOtherSelections('recipes');
          }}
        >
          Recipes ({recipes.length})
        </button>
        <button
          type="button"
          className={tabClasses(linkTab === 'menus')}
          onClick={() => {
            setLinkTab('menus');
            clearOtherSelections('menus');
          }}
        >
          Menus ({menus.length})
        </button>
      </div>
      {linkTab === 'dishes' &&
        (dishes.length > 0 ? (
          <select
            className={inputClasses}
            value={selectedDishId}
            onChange={e => setSelectedDishId(e.target.value)}
          >
            <option value="">No dish linked</option>
            {dishes.map(d => (
              <option key={d.id} value={d.id}>
                {d.dish_name} {d.selling_price ? `($${d.selling_price.toFixed(2)})` : ''}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-xs text-[var(--foreground-muted)] italic">No dishes created yet.</p>
        ))}
      {linkTab === 'recipes' &&
        (recipes.length > 0 ? (
          <select
            className={inputClasses}
            value={selectedRecipeId}
            onChange={e => setSelectedRecipeId(e.target.value)}
          >
            <option value="">No recipe linked</option>
            {recipes.map(r => (
              <option key={r.id} value={r.id}>
                {r.recipe_name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-xs text-[var(--foreground-muted)] italic">No recipes created yet.</p>
        ))}
      {linkTab === 'menus' && (
        <>
          {menus.length > 0 ? (
            <select
              className={inputClasses}
              value={selectedMenuId}
              onChange={e => setSelectedMenuId(e.target.value)}
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
          ) : (
            <p className="text-xs text-[var(--foreground-muted)] italic">No menus available yet.</p>
          )}
          {!showCreateMenu ? (
            <button
              type="button"
              onClick={() => {
                setShowCreateMenu(true);
                setNewMenuName(functionName ? `${functionName} Menu` : '');
              }}
              className="flex items-center gap-1.5 text-xs text-[var(--primary)] transition-colors hover:underline"
            >
              <Icon icon={UtensilsCrossed} size="xs" />
              Create a new function menu
            </button>
          ) : (
            <div className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-3">
              <input
                type="text"
                placeholder="Function menu name..."
                className={inputClasses}
                value={newMenuName}
                onChange={e => setNewMenuName(e.target.value)}
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateMenu(false)}
                  disabled={isCreatingMenu}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={onCreateMenu}
                  loading={isCreatingMenu}
                  disabled={!newMenuName.trim()}
                >
                  Create
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
