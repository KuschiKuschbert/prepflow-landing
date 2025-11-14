'use client';

import React from 'react';
import { useTranslation } from '../lib/useTranslation';

interface LanguageSwitcherProps {
  className?: string;
  showFlag?: boolean;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function LanguageSwitcher({
  className = '',
  showFlag = true,
  showName = true,
  size = 'md',
}: LanguageSwitcherProps) {
  const { currentLanguage, changeLanguage, getCurrentLanguageInfo, getAvailableLanguages } =
    useTranslation();

  const currentLangInfo = getCurrentLanguageInfo();
  const availableLangs = getAvailableLanguages();

  const sizeClasses = {
    sm: 'px-2 py-1 text-fluid-xs',
    md: 'px-3 py-2 text-fluid-sm',
    lg: 'px-4 py-3 text-fluid-base',
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={currentLanguage}
        onChange={e => changeLanguage(e.target.value)}
        className={` ${sizeClasses[size]} cursor-pointer appearance-none rounded-lg border border-[#29E7CD]/30 bg-[#2a2a2a] pl-3 text-white transition-all duration-200 hover:border-[#29E7CD]/50 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        {availableLangs.map(lang => (
          <option key={lang.code} value={lang.code} className="bg-[#2a2a2a] text-white">
            {showFlag && lang.flag} {showName && lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// Compact version for mobile
export function LanguageSwitcherCompact({ className = '' }: { className?: string }) {
  return <LanguageSwitcher className={className} showFlag={true} showName={false} size="sm" />;
}

// Full version for desktop
export function LanguageSwitcherFull({ className = '' }: { className?: string }) {
  return <LanguageSwitcher className={className} showFlag={true} showName={true} size="md" />;
}
