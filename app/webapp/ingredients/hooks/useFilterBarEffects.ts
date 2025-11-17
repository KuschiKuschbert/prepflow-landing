import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface UseFilterBarEffectsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showSupplierMenu: boolean;
  showStorageMenu: boolean;
  showSortMenu: boolean;
  setShowSupplierMenu: (show: boolean) => void;
  setShowStorageMenu: (show: boolean) => void;
  setShowSortMenu: (show: boolean) => void;
}

export function useFilterBarEffects({
  searchTerm,
  onSearchChange,
  showSupplierMenu,
  showStorageMenu,
  showSortMenu,
  setShowSupplierMenu,
  setShowStorageMenu,
  setShowSortMenu,
}: UseFilterBarEffectsProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSupplierMenu(false);
        setShowStorageMenu(false);
        setShowSortMenu(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [setShowSupplierMenu, setShowStorageMenu, setShowSortMenu]);

  return {
    localSearchTerm,
    setLocalSearchTerm,
  };
}
