/**
 * Hook for managing persistent sidebar state (collapsed, hovered, expanded)
 */

import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

/**
 * Hook for managing persistent sidebar state
 *
 * @returns {Object} Sidebar state and handlers
 */
export function useSidebarState() {
  const pathname = usePathname();
  const isDashboard = pathname === '/webapp';
  const isDashboardInitial = pathname === '/webapp';
  const [isCollapsed, setIsCollapsed] = useState(!isDashboardInitial);
  const [isHovered, setIsHovered] = useState(false);
  const [persistentCollapsedState, setPersistentCollapsedState] = useState(!isDashboardInitial);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Determine if sidebar should appear expanded
  const isExpanded = isDashboard ? true : !isCollapsed || isHovered;

  // Load collapsed state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDashboard) {
        setIsCollapsed(false);
        setPersistentCollapsedState(false);
      } else {
        setIsCollapsed(true);
        const saved = localStorage.getItem('sidebar-collapsed');
        setPersistentCollapsedState(saved === 'true');
      }
      setHasInitialized(true);
    }
  }, [isDashboard]);

  // Update CSS variable for sidebar width
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const width = isExpanded ? '20rem' : '4rem';
      root.style.setProperty('--sidebar-actual-width', width);
    }
  }, [isExpanded]);

  // Dispatch sidebar-toggle event
  useEffect(() => {
    if (typeof window !== 'undefined' && hasInitialized) {
      window.dispatchEvent(
        new CustomEvent('sidebar-toggle', {
          detail: { collapsed: !isExpanded, expanded: isExpanded },
        }),
      );
    }
  }, [isExpanded, hasInitialized]);

  const handleMouseEnter = useCallback(() => {
    if (isDashboard) return;
    setIsHovered(true);
    setIsCollapsed(false);
  }, [isDashboard]);

  const handleMouseLeave = useCallback(() => {
    if (isDashboard) return;
    setIsHovered(false);
    setIsCollapsed(true);
  }, [isDashboard]);

  const handleToggleCollapse = useCallback(() => {
    if (isDashboard) return;
    const newCollapsedState = !persistentCollapsedState;
    setPersistentCollapsedState(newCollapsedState);
    setIsCollapsed(newCollapsedState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newCollapsedState));
    }
  }, [persistentCollapsedState, isDashboard]);

  return {
    isExpanded,
    isDashboard,
    persistentCollapsedState,
    handleMouseEnter,
    handleMouseLeave,
    handleToggleCollapse,
  };
}
