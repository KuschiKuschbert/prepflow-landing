'use client';

import React from 'react';
import { equipmentTypes } from './equipment-config';
import { EquipmentType } from '../types';

interface EquipmentTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}

export function EquipmentTypeModal({ isOpen, onClose, onSelect }: EquipmentTypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Select Equipment Type</h3>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {equipmentTypes.map(type => (
            <button
              key={type.value}
              onClick={() => onSelect(type.value)}
              className="rounded-2xl bg-[#2a2a2a] p-4 text-left transition-all duration-200 hover:bg-[#3a3a3a]"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <h4 className="font-semibold text-white">{type.label}</h4>
                  <p className="text-sm text-gray-400">{type.category}</p>
                  <p className="text-xs text-[#29E7CD]">
                    {type.defaultMin}°C - {type.defaultMax}°C
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
