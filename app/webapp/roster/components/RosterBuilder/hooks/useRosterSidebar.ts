import { useState, useEffect } from 'react';

/**
 * Hook for managing sidebar collapsed state
 */
export function useRosterSidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkSidebarState = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('sidebar-collapsed');
        setSidebarCollapsed(saved === 'true');
      }
    };
    checkSidebarState();

    // Listen for custom sidebar-toggle event (immediate update)
    const handleSidebarToggle = ((e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed);
    }) as EventListener;
    window.addEventListener('sidebar-toggle', handleSidebarToggle);

    // Listen for storage changes (when sidebar is toggled in another tab)
    window.addEventListener('storage', checkSidebarState);

    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle);
      window.removeEventListener('storage', checkSidebarState);
    };
  }, []);

  return sidebarCollapsed;
}
