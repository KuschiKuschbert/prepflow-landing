import { Icon } from '@/components/ui/Icon';
import { Check, ChevronDown, ChevronRight, Printer } from 'lucide-react';
import type { QRCodeEntity } from '../types';
import { typeConfig, defaultTypeConfig } from '../config';
import { QRCodeCard } from './QRCodeCard';

interface QRCodeSectionProps {
  type: string;
  entities: QRCodeEntity[];
  isExpanded: boolean;
  selectedItems: Set<string>;
  onToggleSection: () => void;
  onToggleSelect: (id: string) => void;
  onSelectAllInSection: () => void;
  onPrintSection: () => void;
}

/**
 * QR code section component (collapsible)
 */
export function QRCodeSection({
  type,
  entities,
  isExpanded,
  selectedItems,
  onToggleSection,
  onToggleSelect,
  onSelectAllInSection,
  onPrintSection,
}: QRCodeSectionProps) {
  const config = typeConfig[type] || defaultTypeConfig;
  const selectedInSection = entities.filter(e => selectedItems.has(e.id)).length;
  const allSelected = selectedInSection === entities.length && entities.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a]">
      {/* Section Header */}
      <div
        className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-[#222]"
        onClick={onToggleSection}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icon icon={config.icon} size="sm" style={{ color: config.color }} />
          </div>
          <div>
            <div className="font-medium text-white">{config.label}</div>
            <div className="text-xs text-gray-500">{entities.length} items</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Print Section Button */}
          <button
            onClick={e => {
              e.stopPropagation();
              onPrintSection();
            }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
          >
            <Icon icon={Printer} size="xs" />
            Print
          </button>
          {/* Expand/Collapse Icon */}
          <Icon
            icon={isExpanded ? ChevronDown : ChevronRight}
            size="sm"
            className="text-gray-500"
          />
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="border-t border-[#2a2a2a] p-4">
          {/* Select All in Section */}
          <div className="mb-3 flex items-center justify-between">
            <button
              onClick={onSelectAllInSection}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white"
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded border ${
                  allSelected ? 'border-[#29E7CD] bg-[#29E7CD]' : 'border-gray-500'
                }`}
              >
                {allSelected && <Icon icon={Check} size="xs" className="text-black" />}
              </div>
              Select All ({entities.length})
            </button>
            {selectedInSection > 0 && (
              <span className="text-xs text-[#29E7CD]">{selectedInSection} selected</span>
            )}
          </div>

          {/* QR Code Grid */}
          <div className="tablet:grid-cols-4 desktop:grid-cols-5 grid grid-cols-3 gap-2 xl:grid-cols-6">
            {entities.map(entity => (
              <QRCodeCard
                key={entity.id}
                entity={entity}
                isSelected={selectedItems.has(entity.id)}
                onToggle={() => onToggleSelect(entity.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
