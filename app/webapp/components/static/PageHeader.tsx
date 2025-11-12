'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon; // Use LucideIcon instead of emoji string
  showLogo?: boolean;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  showLogo = false,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="mb-3 flex flex-col gap-3 md:mb-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex items-center gap-3 md:gap-4">
          {showLogo && (
            <Image
              src="/images/prepflow-logo.svg"
              alt="PrepFlow Logo"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
          )}
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white md:text-4xl">
            {icon && <Icon icon={icon} size="lg" className="text-[#29E7CD]" aria-hidden={true} />}
            {title}
          </h1>
        </div>
        {actions && <div className="flex items-center justify-start md:justify-end">{actions}</div>}
      </div>
      {subtitle && <p className="text-sm text-gray-400 md:text-base">{subtitle}</p>}
      {children}
    </div>
  );
}
