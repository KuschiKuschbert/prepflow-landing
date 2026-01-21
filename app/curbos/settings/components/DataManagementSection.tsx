'use client';

import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';
import { RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { seedInitialData } from '../../seed-actions';

export function DataManagementSection() {
  const [seeding, setSeeding] = useState(false);
  const { showConfirm, ConfirmDialog } = useConfirm();
  const router = useRouter();

  async function handleRestoreDefaults() {
    const confirmed = await showConfirm({
      title: 'Restore Default Data?',
      message:
        'This will add default menu items and modifiers to your database. Only missing items will be added - existing data will not be deleted or modified. Continue?',
      variant: 'info',
      confirmLabel: 'Restore Defaults',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

    setSeeding(true);
    try {
      await seedInitialData();
      toast.success('Default data restored successfully!');
      router.refresh();
    } catch (error) {
      logger.error('[CurbOS Settings] Error restoring defaults:', error);
      toast.error('Failed to restore default data. Please try again.');
    } finally {
      setSeeding(false);
    }
  }

  return (
    <>
      <div className="bg-neutral-900 rounded-2xl p-6 tablet:p-8 border border-neutral-800 mt-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">Data Management</h3>
        </div>
        <p className="text-gray-400 mb-6 text-sm tablet:text-base">
          Restore default menu items and modifiers. This action only adds missing items - it will
          never delete or modify existing data. Useful for setting up a new CurbOS instance or
          adding demo data.
        </p>
        <button
          onClick={handleRestoreDefaults}
          disabled={seeding}
          className="flex items-center gap-2 px-6 py-3 bg-[#C0FF02] text-black font-bold rounded-lg hover:bg-[#b0eb02] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCw size={16} className={seeding ? 'animate-spin' : ''} />
          {seeding ? 'Restoring...' : 'Restore Defaults'}
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Default items include: Al Pastor Elysium, Carne Asada Supreme, Baja Fish Nirvana, and
          more. Default modifiers include: Extra Cheese, Guacamole, Salsa Verde, and No Onions.
        </p>
      </div>
      <ConfirmDialog />
    </>
  );
}
