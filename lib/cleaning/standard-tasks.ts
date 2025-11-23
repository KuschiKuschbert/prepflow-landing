/**
 * Standard Task Templates for Cleaning
 * Defines standard cleaning tasks that can be pre-populated
 */

import { FrequencyType } from './frequency-calculator';

export type StandardTaskType =
  | 'floor'
  | 'fridge_seals'
  | 'oven'
  | 'bench'
  | 'grill'
  | 'flat_top'
  | 'cooker'
  | 'equipment'
  | 'section';

export interface StandardTaskTemplate {
  standard_task_type: StandardTaskType;
  name: string;
  frequency_type: FrequencyType;
  description?: string;
  equipment_type_filter?: string[]; // Filter equipment by type
  equipment_name_filter?: string[]; // Filter equipment by name keywords
}

export interface Equipment {
  id: string;
  name: string;
  equipment_type: string;
  location?: string;
}

export interface KitchenSection {
  id: string;
  name: string;
  description?: string;
}

export interface StandardTaskToCreate {
  task_name: string;
  frequency_type: FrequencyType;
  area_id: string; // Required - tasks belong to areas
  equipment_id?: string;
  section_id?: string;
  is_standard_task: boolean;
  standard_task_type: StandardTaskType;
  description?: string;
}

export interface CleaningArea {
  id: string;
  area_name: string;
  description?: string;
}

/**
 * Standard task templates
 */
export const STANDARD_TASK_TEMPLATES: StandardTaskTemplate[] = [
  {
    standard_task_type: 'floor',
    name: 'Clean {name} floor',
    frequency_type: 'daily',
    description: 'Sweep and mop floor area',
  },
  {
    standard_task_type: 'fridge_seals',
    name: 'Clean {name} seals',
    frequency_type: 'weekly',
    description: 'Clean and sanitize fridge/freezer door seals',
    equipment_type_filter: ['Cold Storage', 'Freezer'],
  },
  {
    standard_task_type: 'oven',
    name: 'Clean {name}',
    frequency_type: 'weekly',
    description: 'Deep clean oven interior and exterior',
    equipment_name_filter: ['oven', 'Oven'],
  },
  {
    standard_task_type: 'bench',
    name: 'Clean {name} benches',
    frequency_type: 'daily',
    description: 'Clean and sanitize work benches',
  },
  {
    standard_task_type: 'grill',
    name: 'Clean {name}',
    frequency_type: 'daily',
    description: 'Clean grill grates and surfaces',
    equipment_name_filter: ['grill', 'Grill'],
  },
  {
    standard_task_type: 'flat_top',
    name: 'Clean {name}',
    frequency_type: 'daily',
    description: 'Clean flat top cooking surface',
    equipment_name_filter: ['flat top', 'flat-top', 'Flat Top'],
  },
  {
    standard_task_type: 'cooker',
    name: 'Clean {name}',
    frequency_type: 'weekly',
    description: 'Clean cooker surfaces and burners',
    equipment_name_filter: ['cooker', 'Cooker', 'stove', 'Stove'],
  },
];

/**
 * Generate standard tasks for equipment
 *
 * @param equipment - Equipment items
 * @param areas - Cleaning areas to assign tasks to
 * @param templates - Task templates to use
 * @returns Array of tasks to create
 */
export function generateEquipmentTasks(
  equipment: Equipment[],
  areas: CleaningArea[],
  templates: StandardTaskTemplate[] = STANDARD_TASK_TEMPLATES,
): StandardTaskToCreate[] {
  const tasks: StandardTaskToCreate[] = [];

  // Find or create a default "Kitchen Equipment" area
  let equipmentArea = areas.find(
    a =>
      a.area_name.toLowerCase().includes('equipment') ||
      a.area_name.toLowerCase().includes('kitchen'),
  );

  // If no equipment area exists, use first area or create a default
  if (!equipmentArea && areas.length > 0) {
    equipmentArea = areas[0];
  }

  if (!equipmentArea) {
    // No areas available, can't create tasks
    return tasks;
  }

  for (const template of templates) {
    // Skip templates that don't apply to equipment
    if (!template.equipment_type_filter && !template.equipment_name_filter) {
      continue;
    }

    for (const item of equipment) {
      // Check equipment type filter
      if (
        template.equipment_type_filter &&
        !template.equipment_type_filter.includes(item.equipment_type)
      ) {
        continue;
      }

      // Check equipment name filter
      if (template.equipment_name_filter) {
        const nameMatches = template.equipment_name_filter.some(filter =>
          item.name.toLowerCase().includes(filter.toLowerCase()),
        );
        if (!nameMatches) {
          continue;
        }
      }

      // Generate task name
      const taskName = template.name.replace('{name}', item.name);

      tasks.push({
        task_name: taskName,
        frequency_type: template.frequency_type,
        area_id: equipmentArea.id,
        equipment_id: item.id,
        is_standard_task: true,
        standard_task_type: template.standard_task_type,
        description: template.description,
      });
    }
  }

  return tasks;
}

/**
 * Generate standard tasks for kitchen sections
 *
 * @param sections - Kitchen sections
 * @param areas - Cleaning areas to assign tasks to
 * @param templates - Task templates to use
 * @returns Array of tasks to create
 */
export function generateSectionTasks(
  sections: KitchenSection[],
  areas: CleaningArea[],
  templates: StandardTaskTemplate[] = STANDARD_TASK_TEMPLATES,
): StandardTaskToCreate[] {
  const tasks: StandardTaskToCreate[] = [];

  // Filter templates that apply to sections (floor, bench)
  const sectionTemplates = templates.filter(
    t => t.standard_task_type === 'floor' || t.standard_task_type === 'bench',
  );

  // Find matching area for each section, or use a default area
  for (const template of sectionTemplates) {
    for (const section of sections) {
      // Try to find an area that matches the section name or location
      let matchingArea = areas.find(
        a =>
          a.area_name.toLowerCase().includes(section.name.toLowerCase()) ||
          section.name.toLowerCase().includes(a.area_name.toLowerCase()),
      );

      // If no match, try to find a general area (Kitchen, Prep, etc.)
      if (!matchingArea) {
        matchingArea = areas.find(
          a =>
            a.area_name.toLowerCase().includes('kitchen') ||
            a.area_name.toLowerCase().includes('prep') ||
            a.area_name.toLowerCase().includes('section'),
        );
      }

      // Fallback to first area if no match
      if (!matchingArea && areas.length > 0) {
        matchingArea = areas[0];
      }

      if (!matchingArea) {
        // No areas available, skip this task
        continue;
      }

      // Generate task name
      const taskName = template.name.replace('{name}', section.name);

      tasks.push({
        task_name: taskName,
        frequency_type: template.frequency_type,
        area_id: matchingArea.id,
        section_id: section.id,
        is_standard_task: true,
        standard_task_type: template.standard_task_type,
        description: template.description,
      });
    }
  }

  return tasks;
}

/**
 * Generate all standard tasks
 *
 * @param equipment - Equipment items
 * @param sections - Kitchen sections
 * @param areas - Cleaning areas to assign tasks to
 * @returns Array of all tasks to create
 */
export function generateAllStandardTasks(
  equipment: Equipment[],
  sections: KitchenSection[],
  areas: CleaningArea[],
): StandardTaskToCreate[] {
  if (areas.length === 0) {
    // No areas available, can't create tasks
    return [];
  }

  const equipmentTasks = generateEquipmentTasks(equipment, areas);
  const sectionTasks = generateSectionTasks(sections, areas);
  return [...equipmentTasks, ...sectionTasks];
}

/**
 * Get standard task templates
 *
 * @returns Array of standard task templates
 */
export function getStandardTaskTemplates(): StandardTaskTemplate[] {
  return STANDARD_TASK_TEMPLATES;
}
