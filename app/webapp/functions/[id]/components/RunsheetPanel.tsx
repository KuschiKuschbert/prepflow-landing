'use client';

import type { AppFunction } from '@/app/api/functions/helpers/schemas';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ClipboardList } from 'lucide-react';
import { DayTabBar } from './DayTabBar';
import { ExportDayButton } from './ExportDayButton';
import { FunctionAllergenSummary } from './FunctionAllergenSummary';
import { RunsheetAddForm } from './RunsheetAddForm';
import { RunsheetItemRow } from './RunsheetItemRow';
import type {
  DishOption,
  MenuOption,
  RecipeOption,
  RunsheetItemWithRelations,
} from './runsheet-types';
import { useRunsheetPanel } from '../hooks/useRunsheetPanel';

export type { DishOption, MenuOption, RecipeOption, RunsheetItemWithRelations } from './runsheet-types';

interface RunsheetPanelProps {
  func: AppFunction;
  initialItems: RunsheetItemWithRelations[];
  functionId: string;
}

export function RunsheetPanel({ func, initialItems, functionId }: RunsheetPanelProps) {
  const {
    items,
    activeDay,
    setActiveDay,
    menus,
    dishes,
    recipes,
    menuPricePerPerson,
    dayItems,
    totalDays,
    fetchMenus,
    handleAddItem,
    handleDeleteItem,
    handleUpdateItem,
    handleMenuClick,
  } = useRunsheetPanel({ func, initialItems, functionId });

  return (
    <Card>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--foreground)]">
            <Icon icon={ClipboardList} size="sm" className="text-[var(--primary)]" />
            Runsheet
          </h3>
          <div className="flex items-center gap-2">
            {totalDays > 1 && (
              <>
                <ExportDayButton functionId={functionId} dayNumber={activeDay} />
                <ExportDayButton functionId={functionId} />
              </>
            )}
            {totalDays === 1 && <ExportDayButton functionId={functionId} dayNumber={1} />}
          </div>
        </div>

        <FunctionAllergenSummary items={items} />

        {totalDays > 1 && (
          <DayTabBar
            startDate={func.start_date}
            endDate={func.end_date || null}
            activeDay={activeDay}
            onDayChange={setActiveDay}
          />
        )}

        {dayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon
              icon={ClipboardList}
              size="xl"
              className="mb-3 text-[var(--foreground-muted)]"
              aria-hidden
            />
            <p className="text-sm text-[var(--foreground-muted)]">
              No items on {totalDays > 1 ? `Day ${activeDay}` : 'the runsheet'} yet.
            </p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Add activities, meal services, and setup tasks below.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {dayItems.map(item => (
              <RunsheetItemRow
                key={item.id}
                item={item}
                menus={menus}
                dishes={dishes}
                recipes={recipes}
                onDelete={handleDeleteItem}
                onUpdate={handleUpdateItem}
                onMenuClick={handleMenuClick}
                attendees={func.attendees}
                menuPricePerPerson={menuPricePerPerson}
              />
            ))}
          </div>
        )}

        <RunsheetAddForm
          dayNumber={activeDay}
          onAdd={handleAddItem}
          menus={menus}
          dishes={dishes}
          recipes={recipes}
          onMenuCreated={fetchMenus}
          functionName={func.name}
        />
      </div>
    </Card>
  );
}
