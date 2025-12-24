import { useState, useRef, useEffect } from 'react';
import { getAvailableCountries } from '@/lib/country-config';

export function useCountryDropdown() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const availableCountries = getAvailableCountries();
  const filteredCountries = availableCountries.filter(
    country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, onSelect: (code: string) => void) => {
    if (!showDropdown) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev < filteredCountries.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredCountries.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredCountries[highlightedIndex]) {
          onSelect(filteredCountries[highlightedIndex].code);
          setSearchTerm('');
          setShowDropdown(false);
          setHighlightedIndex(-1);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    showDropdown,
    setShowDropdown,
    highlightedIndex,
    setHighlightedIndex,
    dropdownRef,
    filteredCountries,
    handleKeyDown,
  };
}
