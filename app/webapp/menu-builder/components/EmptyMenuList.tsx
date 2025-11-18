'use client';

import { Icon } from '@/components/ui/Icon';
import { FileText } from 'lucide-react';

/**
 * Empty state component for when no menus exist.
 *
 * @component
 * @returns {JSX.Element} Empty menu list message
 */
export function EmptyMenuList() {
  return (
    <div className="py-16 text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 p-6">
          <Icon icon={FileText} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
        </div>
      </div>
      <h3 className="mb-3 text-2xl font-semibold text-white">No menus yet</h3>
      <p className="mx-auto mb-6 max-w-md text-gray-400">
        Create your first menu to organize your dishes into categories. You can drag and drop
        dishes from your recipe collection into menu categories.
      </p>
      <div className="mx-auto max-w-md rounded-lg border border-[#2a2a2a] bg-[#1f1f1f]/50 p-4">
        <p className="mb-2 text-sm text-gray-300">
          💡 <strong>Tip:</strong> Before creating a menu, make sure you have:
        </p>
        <ul className="ml-6 list-disc space-y-1 text-left text-sm text-gray-400">
          <li>
            Created some dishes in the <strong>Dish Builder</strong>
          </li>
          <li>Or linked recipes to dishes</li>
        </ul>
      </div>
    </div>
  );
}
