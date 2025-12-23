/**
 * Mock data for testing exports
 */
export const mockExportData = {
  orderList: {
    menuName: 'Test Menu',
    groupedIngredients: {
      Vegetables: [
        {
          id: '1',
          ingredient_name: 'Tomatoes',
          brand: 'Fresh Farm',
          pack_size: '5',
          pack_size_unit: 'kg',
          pack_price: 25.99,
          cost_per_unit: 5.198,
          unit: 'kg',
          storage: 'Dry Store',
          category: 'Vegetables',
          par_level: 10,
          par_unit: 'kg',
        },
      ],
    },
    sortBy: 'name',
  },
  temperatureLogs: [
    {
      id: 1,
      log_date: '2025-01-15',
      log_time: '10:30:00',
      temperature_celsius: 3.5,
      location: 'Main Fridge',
      temperature_type: 'cold',
      logged_by: 'Test User',
      notes: 'Test note',
      created_at: '2025-01-15T10:30:00Z',
    },
  ],
  cleaningTasks: [
    {
      id: 1,
      task_name: 'Clean Prep Area',
      cleaning_areas: { area_name: 'Prep Station' },
      frequency_type: 'daily',
      completions: [],
    },
  ],
};
