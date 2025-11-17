'use client';

interface EquipmentDrawerFooterProps {
  onClose: () => void;
}

export function EquipmentDrawerFooter({ onClose }: EquipmentDrawerFooterProps) {
  return (
    <div className="large-desktop:p-6 flex flex-shrink-0 border-t border-[#2a2a2a] bg-[#0a0a0a] p-4">
      <button
        onClick={onClose}
        className="w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 text-base font-semibold text-black shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
        aria-label="Close drawer"
      >
        Done
      </button>
    </div>
  );
}
