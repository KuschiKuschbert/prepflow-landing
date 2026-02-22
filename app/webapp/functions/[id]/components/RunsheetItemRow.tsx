'use client';

import { AllergenDisplay } from '@/components/ui/AllergenDisplay';
import { Button } from '@/components/ui/Button';
import { DietaryBadge } from '@/components/ui/DietaryBadge';
import { Icon } from '@/components/ui/Icon';
import { TimeSelect } from '@/components/ui/TimeSelect';
import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { format } from 'date-fns';
import {
  BookOpen,
  Clock,
  GripVertical,
  Pencil,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import type {
  DishOption,
  MenuOption,
  RecipeOption,
  RunsheetItemWithRelations,
} from './RunsheetPanel';

interface RunsheetItemRowProps {
  item: RunsheetItemWithRelations;
  menus: MenuOption[];
  dishes: DishOption[];
  recipes: RecipeOption[];
  onDelete: (id: string) => void;
  onUpdate: (
    itemId: string,
    data: {
      item_time?: string | null;
      description?: string;
      item_type?: 'meal' | 'activity' | 'setup' | 'other';
      menu_id?: string | null;
      dish_id?: string | null;
      recipe_id?: string | null;
    },
  ) => void;
  onMenuClick?: (menuId: string) => void;
}

const TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  meal: {
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-400',
    label: 'Meal',
  },
  activity: {
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-400',
    label: 'Activity',
  },
  setup: {
    bg: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-400',
    label: 'Setup',
  },
  other: {
    bg: 'bg-gray-500/10 border-gray-500/20',
    text: 'text-gray-400',
    label: 'Other',
  },
};

type LinkTab = 'dishes' | 'recipes' | 'menus';

const inputClasses =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-colors';

const tabClasses = (active: boolean) =>
  `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
    active
      ? 'bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30'
      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50'
  }`;

export function RunsheetItemRow({
  item,
  menus = [],
  dishes = [],
  recipes = [],
  onDelete,
  onUpdate,
  onMenuClick,
}: RunsheetItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTime, setEditTime] = useState(item.item_time || '');
  const [editDescription, setEditDescription] = useState(item.description);
  const [editType, setEditType] = useState<'meal' | 'activity' | 'setup' | 'other'>(item.item_type);
  const [linkTab, setLinkTab] = useState<LinkTab>('dishes');
  const [editDishId, setEditDishId] = useState(item.dish_id || '');
  const [editRecipeId, setEditRecipeId] = useState(item.recipe_id || '');
  const [editMenuId, setEditMenuId] = useState(item.menu_id || '');
  const [isSaving, setIsSaving] = useState(false);

  const style = TYPE_STYLES[item.item_type] || TYPE_STYLES.other;

  const timeDisplay = item.item_time
    ? format(new Date(`1970-01-01T${item.item_time}`), 'HH:mm')
    : null;

  const hasDish = item.item_type === 'meal' && item.dishes;
  const hasRecipe = item.item_type === 'meal' && item.recipes;
  const hasMenu = item.item_type === 'meal' && item.menus;

  const functionMenus = menus.filter(
    m => m.menu_type === 'function' || m.menu_type?.startsWith('function_'),
  );
  const otherMenus = menus.filter(
    m => m.menu_type !== 'function' && !m.menu_type?.startsWith('function_'),
  );

  const startEdit = useCallback(() => {
    setEditTime(item.item_time || '');
    setEditDescription(item.description);
    setEditType(item.item_type);
    setEditDishId(item.dish_id || '');
    setEditRecipeId(item.recipe_id || '');
    setEditMenuId(item.menu_id || '');
    setLinkTab(item.dish_id ? 'dishes' : item.recipe_id ? 'recipes' : 'menus');
    setIsEditing(true);
  }, [item]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editDescription.trim()) return;
    setIsSaving(true);
    try {
      await onUpdate(item.id, {
        item_time: editTime || null,
        description: editDescription.trim(),
        item_type: editType,
        menu_id: editType === 'meal' ? editMenuId || null : null,
        dish_id: editType === 'meal' ? editDishId || null : null,
        recipe_id: editType === 'meal' ? editRecipeId || null : null,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  }, [
    item.id,
    editTime,
    editDescription,
    editType,
    editMenuId,
    editDishId,
    editRecipeId,
    onUpdate,
  ]);

  const clearOtherSelections = (except: LinkTab) => {
    if (except !== 'dishes') setEditDishId('');
    if (except !== 'recipes') setEditRecipeId('');
    if (except !== 'menus') setEditMenuId('');
  };

  if (isEditing) {
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={cancelEdit}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={saveEdit}
            loading={isSaving}
            disabled={!editDescription.trim()}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-[var(--border)] p-3 transition-colors hover:bg-[var(--muted)]/50">
      <div className="cursor-grab text-[var(--foreground-muted)] opacity-0 transition-opacity group-hover:opacity-100">
        <Icon icon={GripVertical} size="sm" />
      </div>

      {/* Time */}
      <div className="flex w-20 shrink-0 items-center gap-1.5">
        {timeDisplay ? (
          <>
            <Icon icon={Clock} size="xs" className="text-[var(--foreground-muted)]" />
            <span className="text-sm font-medium text-[var(--foreground)]">{timeDisplay}</span>
          </>
        ) : (
          <span className="text-xs text-[var(--foreground-muted)] italic">No time</span>
        )}
      </div>

      {/* Description + linked items */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-[var(--foreground)]">{item.description}</p>
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
          {hasDish && (
            <span className="flex items-center gap-1 text-xs text-orange-400">
              <Icon icon={ShoppingBag} size="xs" />
              {item.dishes!.dish_name}
              {item.dishes!.selling_price ? ` ($${item.dishes!.selling_price.toFixed(2)})` : ''}
            </span>
          )}
          {hasRecipe && (
            <span className="flex items-center gap-1 text-xs text-purple-400">
              <Icon icon={BookOpen} size="xs" />
              {item.recipes!.recipe_name}
            </span>
          )}
          {hasMenu && (
            <button
              onClick={() => onMenuClick?.(item.menus!.id)}
              className="flex items-center gap-1 text-xs text-[var(--primary)] transition-colors hover:underline"
            >
              <Icon icon={UtensilsCrossed} size="xs" />
              {item.menus!.menu_name}
            </button>
          )}
        </div>
        {(hasDish || hasRecipe) &&
          (() => {
            const dishAllergens = hasDish && item.dishes?.allergens ? item.dishes.allergens : [];
            const recipeAllergens =
              hasRecipe && item.recipes?.allergens ? item.recipes.allergens : [];
            const allergens = consolidateAllergens([...dishAllergens, ...recipeAllergens]);
            const isVegetarian =
              (hasDish && item.dishes?.is_vegetarian) || (hasRecipe && item.recipes?.is_vegetarian);
            const isVegan =
              (hasDish && item.dishes?.is_vegan) || (hasRecipe && item.recipes?.is_vegan);
            const hasAllergensOrDietary =
              allergens.length > 0 || isVegetarian === true || isVegan === true;
            if (!hasAllergensOrDietary) return null;
            return (
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <AllergenDisplay
                  allergens={allergens}
                  size="sm"
                  showEmpty={false}
                  className="flex-wrap"
                />
                <DietaryBadge isVegetarian={isVegetarian} isVegan={isVegan} size="sm" />
              </div>
            );
          })()}
      </div>

      {/* Type Badge */}
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${style.bg} ${style.text}`}
      >
        {style.label}
      </span>

      {/* Edit */}
      <button
        onClick={startEdit}
        className="rounded-lg p-1.5 text-[var(--foreground-muted)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
        aria-label={`Edit runsheet item: ${item.description}`}
      >
        <Icon icon={Pencil} size="sm" />
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(item.id)}
        className="rounded-lg p-1.5 text-[var(--foreground-muted)] opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
        aria-label={`Delete runsheet item: ${item.description}`}
      >
        <Icon icon={Trash2} size="sm" />
      </button>
    </div>
  );
}
