/**
 * Navigation optimization types.
 * Shared between nav-items (app) and optimizer (lib).
 */

export interface NavigationItemConfig {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  category?: string;
  children?: NavigationItemConfig[];
}
