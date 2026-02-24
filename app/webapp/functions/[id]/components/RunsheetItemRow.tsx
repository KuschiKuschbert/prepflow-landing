'use client';

import { AllergenDisplay } from '@/components/ui/AllergenDisplay';
import { DietaryBadge } from '@/components/ui/DietaryBadge';
import { Icon } from '@/components/ui/Icon';
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
import { RunsheetItemRowEditForm } from './RunsheetItemRowEditForm';
import type {
  DishOption,
  MenuOption,
  RecipeOption,
  RunsheetItemWithRelations,
} from './runsheet-types';

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
  /** Function attendees; used to show "Est. total for X PAX" when a function menu is linked */
  attendees?: number;
  /** Map of menu ID to price per person (for function menus) */
  menuPricePerPerson?: Record<string, number>;
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

export function RunsheetItemRow({
  item,
  menus = [],
  dishes = [],
  recipes = [],
  onDelete,
  onUpdate,
  onMenuClick,
  attendees = 0,
  menuPricePerPerson = {},
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
      <RunsheetItemRowEditForm
        editTime={editTime}
        setEditTime={setEditTime}
        editDescription={editDescription ?? ''}
        setEditDescription={setEditDescription}
        editType={editType}
        setEditType={setEditType}
        linkTab={linkTab}
        setLinkTab={setLinkTab}
        editDishId={editDishId}
        setEditDishId={setEditDishId}
        editRecipeId={editRecipeId}
        setEditRecipeId={setEditRecipeId}
        editMenuId={editMenuId}
        setEditMenuId={setEditMenuId}
        clearOtherSelections={clearOtherSelections}
        menus={menus}
        dishes={dishes}
        recipes={recipes}
        isSaving={isSaving}
        onCancel={cancelEdit}
        onSave={saveEdit}
      />
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
            <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <button
                onClick={() => onMenuClick?.(item.menus!.id)}
                className="flex items-center gap-1 text-xs text-[var(--primary)] transition-colors hover:underline"
              >
                <Icon icon={UtensilsCrossed} size="xs" />
                {item.menus!.menu_name}
              </button>
              {item.menu_id &&
                attendees > 0 &&
                menuPricePerPerson[item.menu_id] != null &&
                menuPricePerPerson[item.menu_id] > 0 && (
                  <span className="text-xs text-[var(--foreground-muted)]">
                    Est. total for {attendees} PAX: $
                    {(menuPricePerPerson[item.menu_id] * attendees).toFixed(2)}
                  </span>
                )}
            </span>
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
