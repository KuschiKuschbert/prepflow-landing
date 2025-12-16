'use client';

interface EquipmentDrawerFooterProps {
  onClose: () => void;
}

export function EquipmentDrawerFooter({ onClose }: EquipmentDrawerFooterProps) {
  return (
    <div className="large-desktop:p-6 flex flex-shrink-0 border-t border-[var(--border)] bg-[var(--background)] p-4">
      <button
        onClick={onClose}
        className="w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 text-base font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
        aria-label="Close drawer"
      >
        Done
      </button>
    </div>
  );
}
