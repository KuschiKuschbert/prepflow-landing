'use client';

import { Icon } from '@/components/ui/Icon';
import { formatSupplierName } from '@/lib/text-utils';
import { ChevronDown, Plus, Store } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Supplier {
  id: number;
  supplier_name?: string;
  name?: string;
}

interface SupplierComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onAddNew?: (value: string) => Promise<void>;
}

export function SupplierCombobox({
  value,
  onChange,
  placeholder = 'Search suppliers...',
  className = '',
  onAddNew,
}: SupplierComboboxProps) {
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/suppliers');
        const data = await response.json();
        if (data.success && data.data) {
          setSupplierList(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
      }
    };
    fetchSuppliers();
  }, []);

  const filteredSuppliers = supplierList.filter(supplier => {
    const supplierName = supplier.supplier_name || supplier.name || '';
    return supplierName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const maxIndex = filteredSuppliers.length + (searchQuery.trim() && !filteredSuppliers.some(s => (s.supplier_name || s.name || '').toLowerCase() === searchQuery.toLowerCase()) ? 1 : 0) - 1;
      setHighlightedIndex(prev => (prev < maxIndex ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex === -1 && searchQuery.trim()) {
        if (onAddNew) {
          handleAddNew(searchQuery.trim());
        } else {
          handleSelect(searchQuery.trim());
        }
      } else if (highlightedIndex >= 0 && highlightedIndex < filteredSuppliers.length) {
        const supplier = filteredSuppliers[highlightedIndex];
        const supplierName = supplier.supplier_name || supplier.name || '';
        handleSelect(supplierName);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  };

  const handleSelect = (supplierName: string) => {
    const formattedName = formatSupplierName(supplierName);
    onChange(formattedName);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  const handleAddNew = async (supplierName: string) => {
    if (!supplierName.trim()) return;

    if (onAddNew) {
      try {
        await onAddNew(supplierName);
        // Refresh supplier list
        const response = await fetch('/api/suppliers');
        const data = await response.json();
        if (data.success && data.data) {
          setSupplierList(data.data);
        }
        // Set the new supplier as selected
        const formattedName = formatSupplierName(supplierName);
        onChange(formattedName);
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      } catch (error) {
        console.error('Failed to add supplier:', error);
      }
    } else {
      handleSelect(supplierName);
    }
  };

  const showAddNewOption = searchQuery.trim() && !filteredSuppliers.some(s => (s.supplier_name || s.name || '').toLowerCase() === searchQuery.toLowerCase());

  return (
    <div ref={comboboxRef} className={`relative ${className}`}>
      <div className="relative">
        <Icon
          icon={Store}
          size="sm"
          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
          aria-hidden={true}
        />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : value}
          onChange={e => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-10 py-2 pr-10 text-sm text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition-colors hover:text-white"
          aria-label="Toggle dropdown"
        >
          <Icon icon={ChevronDown} size="sm" aria-hidden={true} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
          {filteredSuppliers.length > 0 ? (
            <div className="py-1">
              {filteredSuppliers.map((supplier, index) => {
                const supplierName = supplier.supplier_name || supplier.name || '';
                return (
                  <button
                    key={supplier.id}
                    type="button"
                    onClick={() => handleSelect(supplierName)}
                    className={`w-full px-4 py-2 text-left text-sm text-white transition-colors hover:bg-[#2a2a2a] ${
                      highlightedIndex === index ? 'bg-[#2a2a2a]' : ''
                    } ${value === supplierName ? 'bg-[#29E7CD]/20' : ''}`}
                  >
                    {supplierName}
                  </button>
                );
              })}
            </div>
          ) : null}
          {showAddNewOption && (
            <button
              type="button"
              onClick={() => handleAddNew(searchQuery.trim())}
              className={`w-full px-4 py-2 text-left text-sm text-[#29E7CD] transition-colors hover:bg-[#2a2a2a] ${
                highlightedIndex === filteredSuppliers.length ? 'bg-[#2a2a2a]' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon icon={Plus} size="sm" aria-hidden={true} />
                <span>Add new: {searchQuery.trim()}</span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

