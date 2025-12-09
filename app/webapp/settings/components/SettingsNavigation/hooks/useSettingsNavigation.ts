import { useState, useEffect, useCallback, useRef } from 'react';
import { categories } from '../navItems';
import type { FocusedIndex } from '../types';

/**
 * Hook for managing settings navigation state
 */
export function useSettingsNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>('#profile');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(cat => cat.id)), // All categories expanded by default
  );
  const [focusedIndex, setFocusedIndex] = useState<FocusedIndex | null>(null);
  const navRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Update active hash from URL
  useEffect(() => {
    const updateActiveHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash || '#profile';
      setActiveHash(hash);
    };

    updateActiveHash();
    window.addEventListener('hashchange', updateActiveHash);
    return () => window.removeEventListener('hashchange', updateActiveHash);
  }, []);

  const handleNavClick = useCallback((hash: string) => {
    setSidebarOpen(false);
    if (typeof window !== 'undefined') {
      // Update URL hash - use window.location.hash to trigger hashchange event
      // This will cause SettingsPage to update activeSection and render the correct content
      window.location.hash = hash;
      setActiveHash(hash);
    }
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  return {
    sidebarOpen,
    setSidebarOpen,
    activeHash,
    expandedCategories,
    setExpandedCategories,
    focusedIndex,
    setFocusedIndex,
    navRefs,
    handleNavClick,
    toggleCategory,
  };
}
