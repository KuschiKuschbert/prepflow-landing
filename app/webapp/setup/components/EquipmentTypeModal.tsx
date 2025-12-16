'use client';

import React from 'react';
import { equipmentTypes } from './equipment-config';
import { EquipmentType } from '../types';
import { X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface EquipmentTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}

export function EquipmentTypeModal({ isOpen, onClose, onSelect }: EquipmentTypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[80vh] w-full max-w-2xl rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-lg">
        <div className="max-h-[80vh] w-full overflow-y-auto rounded-3xl bg-[var(--surface)]/95 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-[var(--button-active-text)]">Select Equipment Type</h3>
            <button
              onClick={onClose}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              aria-label="Close modal"
            >
              <Icon icon={X} size="lg" className="text-[var(--foreground-muted)]" aria-hidden={true} />
            </button>
          </div>
          <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
            {equipmentTypes.map(type => (
              <button
                key={type.value}
                onClick={() => onSelect(type.value)}
                className="rounded-2xl bg-[var(--muted)] p-4 text-left transition-all duration-200 hover:bg-[var(--surface-variant)]"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)]">{type.label}</h4>
                    <p className="text-sm text-[var(--foreground-muted)]">{type.category}</p>
                    <p className="text-xs text-[var(--primary)]">
                      {type.defaultMin}°C - {type.defaultMax}°C
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
