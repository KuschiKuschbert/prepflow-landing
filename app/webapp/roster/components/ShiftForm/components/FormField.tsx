/**
 * Reusable form field component.
 */
import { Icon } from '@/components/ui/Icon';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  label: string;
  icon: LucideIcon;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, icon, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
        <Icon icon={icon} size="sm" aria-hidden={true} />
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
