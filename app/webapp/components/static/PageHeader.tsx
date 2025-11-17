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
    <div className="tablet:mb-6 desktop:mb-8 mb-4">
      <div className="tablet:mb-3 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-4 desktop:mb-4 desktop:gap-6 mb-2 flex flex-col gap-2">
        <div className="tablet:gap-3 desktop:gap-4 flex items-center gap-2">
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
          <h1 className="text-fluid-xl tablet:text-fluid-2xl flex items-center gap-2 font-bold text-white">
            {icon && <Icon icon={icon} size="lg" className="text-[#29E7CD]" aria-hidden={true} />}
            {title}
          </h1>
        </div>
        {actions && (
          <div className="tablet:justify-end flex items-center justify-start">{actions}</div>
        )}
      </div>
      {subtitle && <p className="text-fluid-base text-gray-400">{subtitle}</p>}
      {children}
    </div>
  );
}
