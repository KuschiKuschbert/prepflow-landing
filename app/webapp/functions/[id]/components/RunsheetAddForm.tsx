'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TimeSelect } from '@/components/ui/TimeSelect';
import { logger } from '@/lib/logger';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DishOption, MenuOption, RecipeOption } from './RunsheetPanel';

type LinkTab = 'dishes' | 'recipes' | 'menus';

interface RunsheetAddFormProps {
  dayNumber: number;
  onAdd: (data: {
    day_number: number;
    item_time: string | null;
    description: string;
    item_type: 'meal' | 'activity' | 'setup' | 'other';
    menu_id: string | null;
    dish_id: string | null;
    recipe_id: string | null;
  }) => Promise<void>;
  menus?: MenuOption[];
  dishes?: DishOption[];
  recipes?: RecipeOption[];
  onMenuCreated?: () => void;
  functionName?: string;
}

const inputClasses =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-colors';

const tabClasses = (active: boolean) =>
  `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
    active
      ? 'bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30'
      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50'
  }`;

export function RunsheetAddForm({
  dayNumber,
  onAdd,
  menus = [],
  dishes = [],
  recipes = [],
  onMenuCreated,
  functionName,
}: RunsheetAddFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [itemType, setItemType] = useState<'meal' | 'activity' | 'setup' | 'other'>('activity');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [linkTab, setLinkTab] = useState<LinkTab>('dishes');
  const [selectedDishId, setSelectedDishId] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState('');

  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [isCreatingMenu, setIsCreatingMenu] = useState(false);

  const { functionMenus, otherMenus } = useMemo(() => {
    const isFn = (t: string) => t === 'function' || t.startsWith('function_');
    return {
      functionMenus: menus.filter(m => isFn(m.menu_type)),
      otherMenus: menus.filter(m => !isFn(m.menu_type)),
    };
  }, [menus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        day_number: dayNumber,
        item_time: time || null,
        description: description.trim(),
        item_type: itemType,
        menu_id: selectedMenuId || null,
        dish_id: selectedDishId || null,
        recipe_id: selectedRecipeId || null,
      });
      setTime('');
      setDescription('');
      setItemType('activity');
      setSelectedDishId('');
      setSelectedRecipeId('');
      setSelectedMenuId('');
      setIsExpanded(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateMenu = async () => {
    if (!newMenuName.trim()) return;
    setIsCreatingMenu(true);
    try {
      const res = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menu_name: newMenuName.trim(),
          menu_type: 'function',
          description: functionName ? `Menu for ${functionName}` : '',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.menu?.id) setSelectedMenuId(data.menu.id);
        setShowCreateMenu(false);
        setNewMenuName('');
        onMenuCreated?.();
      }
    } catch (err) {
      logger.error('Failed to create menu from runsheet:', { error: err });
    } finally {
      setIsCreatingMenu(false);
    }
  };

  const clearOtherSelections = (except: LinkTab) => {
    if (except !== 'dishes') setSelectedDishId('');
    if (except !== 'recipes') setSelectedRecipeId('');
    if (except !== 'menus') setSelectedMenuId('');
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] p-3 text-sm text-[var(--foreground-muted)] transition-colors hover:border-[var(--primary)]/50 hover:text-[var(--primary)]"
      >
        <Icon icon={Plus} size="sm" />
        Add runsheet item
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--foreground-secondary)]">
            Time
          </label>
          <TimeSelect value={time} onChange={setTime} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--foreground-secondary)]">
            Type
          </label>
          <select
            className={inputClasses}
            value={itemType}
            onChange={e => setItemType(e.target.value as typeof itemType)}
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
          Description <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Guests arrive, Canapes served, Band setup..."
          className={inputClasses}
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          autoFocus
        />
      </div>

      {itemType === 'meal' && (
        <div className="space-y-2">
          <label className="mb-1 block text-xs font-medium text-[var(--foreground-secondary)]">
            Link to dish, recipe, or menu (optional)
          </label>

          {/* Tab bar */}
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

          {/* Dishes tab */}
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
              <p className="text-xs text-[var(--foreground-muted)] italic">
                No dishes created yet.
              </p>
            ))}

          {/* Recipes tab */}
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
              <p className="text-xs text-[var(--foreground-muted)] italic">
                No recipes created yet.
              </p>
            ))}

          {/* Menus tab */}
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
                <p className="text-xs text-[var(--foreground-muted)] italic">
                  No menus available yet.
                </p>
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
                      onClick={handleCreateMenu}
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
      )}

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(false)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={isSubmitting}
          disabled={!description.trim()}
        >
          Add
        </Button>
      </div>
    </form>
  );
}
