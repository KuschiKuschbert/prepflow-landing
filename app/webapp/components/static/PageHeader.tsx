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
    <div className="mb-4 tablet:mb-6 desktop:mb-8">
      <div className="mb-2 flex flex-col gap-2 tablet:mb-3 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-4 desktop:mb-4 desktop:gap-6">
        <div className="flex items-center gap-2 tablet:gap-3 desktop:gap-4">
          {showLogo && (
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                src="/images/prepflow-logo.svg"
                alt="PrepFlow Logo"
                fill
                className="rounded-lg object-contain"
                priority
              />
            </div>
          )}
          <h1 className="flex items-center gap-2 font-bold text-white text-fluid-xl tablet:text-fluid-2xl">
            {icon && <Icon icon={icon} size="lg" className="text-[#29E7CD]" aria-hidden={true} />}
            {title}
          </h1>
        </div>
        {actions && <div className="flex items-center justify-start tablet:justify-end">{actions}</div>}
      </div>
      {subtitle && <p className="text-gray-400 text-fluid-base">{subtitle}</p>}
      {children}
    </div>
  );
}
