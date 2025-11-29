/**
 * Centralized selectors for E2E tests
 * Use these selectors to avoid brittle tests when UI changes
 */

export const Selectors = {
  // Common UI elements
  buttons: {
    add: 'button:has-text("Add"), button:has-text("➕"), button:has-text("Create")',
    save: 'button:has-text("Save"), button:has-text("Add"), button[type="submit"]',
    cancel: 'button:has-text("Cancel")',
    delete: 'button:has-text("Delete"), button:has-text("Remove")',
  },

  // Ingredient form
  ingredients: {
    addButton: 'button:has-text("Add")',
    form: {
      name: 'input[placeholder*="ingredient"], input[name="ingredient_name"]',
      packSize: 'input[name="pack_size"]',
      packSizeUnit: 'select[name="pack_size_unit"]',
      packPrice: 'input[name="pack_price"]',
      category: 'select[name="category"]',
      supplier: 'input[placeholder*="supplier"], [data-testid="supplier-input"]',
      storageLocation: 'input[placeholder*="storage"], [data-testid="storage-input"]',
      submit: 'button:has-text("Add Ingredient"), button:has-text("Save")',
    },
  },

  // Recipe form
  recipes: {
    addButton: 'button:has-text("Add Recipe")',
    form: {
      name: 'input[placeholder*="recipe"], input[name="recipe_name"]',
      yield: 'input[name="yield"]',
      instructions: 'textarea[name="instructions"]',
      submit: 'button:has-text("Add Recipe"), button:has-text("Save")',
    },
  },

  // Menu builder
  menuBuilder: {
    addDishButton: 'button:has-text("Add"), button:has-text("Add Dish")',
    category: '[data-testid="menu-category"]',
    dishPalette: '[data-testid="dish-palette"]',
  },

  // Temperature log form
  temperature: {
    addButton: 'button:has-text("Add Temperature"), button:has-text("Add Log")',
    form: {
      date: 'input[type="date"][name*="date"]',
      time: 'input[type="time"][name*="time"]',
      equipment: 'select[name*="equipment"], select[name*="temperature_type"]',
      temperature: 'input[name*="temperature"], input[type="number"]',
      location: 'input[name*="location"]',
      notes: 'textarea[name*="notes"]',
      submit: 'button:has-text("Add"), button:has-text("Log Temperature")',
    },
  },

  // Equipment maintenance form
  equipmentMaintenance: {
    addButton: 'button:has-text("Add Maintenance"), button:has-text("Add Maintenance Record")',
    form: {
      equipmentName: 'input[name*="equipment_name"]',
      equipmentType: 'select[name*="equipment_type"]',
      maintenanceDate: 'input[type="date"][name*="maintenance_date"]',
      maintenanceType: 'select[name*="maintenance_type"]',
      serviceProvider: 'input[name*="service_provider"]',
      description: 'textarea[name*="description"]',
      cost: 'input[name*="cost"]',
      nextMaintenanceDate: 'input[type="date"][name*="next_maintenance_date"]',
      isCritical: 'input[type="checkbox"][name*="is_critical"]',
      performedBy: 'input[name*="performed_by"]',
      notes: 'textarea[name*="notes"]',
      submit: 'button:has-text("Save Maintenance"), button:has-text("Save")',
    },
  },

  // Compliance form
  compliance: {
    addButton: 'button:has-text("Add Record")',
    form: {
      type: 'select[name*="compliance_type"]',
      documentName: 'input[name*="document_name"]',
      issueDate: 'input[type="date"][name*="issue_date"]',
      expiryDate: 'input[type="date"][name*="expiry_date"]',
      submit: 'button:has-text("Save Record")',
    },
  },

  // Navigation
  navigation: {
    sidebar: '[data-testid="sidebar"], nav',
    menuToggle: 'button[aria-label*="menu"], button[aria-label*="Menu"]',
    ingredientsLink: 'a[href*="/ingredients"]',
    recipesLink: 'a[href*="/recipes"]',
    menuBuilderLink: 'a[href*="/menu-builder"]',
    temperatureLink: 'a[href*="/temperature"]',
    complianceLink: 'a[href*="/compliance"]',
  },

  // Common form elements
  forms: {
    input: 'input:not([type="hidden"]):not([disabled])',
    textarea: 'textarea:not([disabled])',
    select: 'select:not([disabled])',
    button: 'button:not([disabled])',
    link: 'a[href]:not([aria-disabled="true"])',
  },
} as const;
