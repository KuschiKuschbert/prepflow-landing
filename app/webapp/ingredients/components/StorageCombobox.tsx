'use client';

import { Icon } from '@/components/ui/Icon';
import { formatStorageLocation } from '@/lib/text-utils';
import { ChevronDown, Package } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { logger } from '../../lib/logger';
interface TemperatureEquipment {
  id: string;
  name: string;
  equipment_type: string;
  location: string | null;
}

interface StorageComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function StorageCombobox({
  value,
  onChange,
  placeholder = 'Search equipment...',
  className = '',
}: StorageComboboxProps) {
  const [equipmentList, setEquipmentList] = useState<TemperatureEquipment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch('/api/temperature-equipment');
        const data = await response.json();
        if (data.success && data.data) {
          setEquipmentList(data.data);
        }
      } catch (error) {
        logger.error('Failed to fetch equipment:', error);
      }
    };
    fetchEquipment();
  }, []);

  const filteredEquipment = equipmentList.filter(equipment => {
    return equipment.name.toLowerCase().includes(searchQuery.toLowerCase());
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
      setHighlightedIndex(prev => (prev < filteredEquipment.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredEquipment.length) {
        const equipment = filteredEquipment[highlightedIndex];
        handleSelect(equipment.name);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  };

  const handleSelect = (equipmentName: string) => {
    const formattedName = formatStorageLocation(equipmentName);
    onChange(formattedName);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  return (
    <div ref={comboboxRef} className={`relative ${className}`}>
      <div className="relative">
        <Icon
          icon={Package}
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
          {filteredEquipment.length > 0 ? (
            <div className="py-1">
              {filteredEquipment.map((equipment, index) => (
                <button
                  key={equipment.id}
                  type="button"
                  onClick={() => handleSelect(equipment.name)}
                  className={`w-full px-4 py-2 text-left text-sm text-white transition-colors hover:bg-[#2a2a2a] ${
                    highlightedIndex === index ? 'bg-[#2a2a2a]' : ''
                  } ${value === equipment.name ? 'bg-[#29E7CD]/20' : ''}`}
                >
                  {equipment.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-400">No equipment found</div>
          )}
        </div>
      )}
    </div>
  );
}
