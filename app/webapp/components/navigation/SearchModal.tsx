'use client';

import Link from 'next/link';
import React from 'react';

interface SearchModalProps {
  isOpen: boolean;
  query: string;
  onChange: (v: string) => void;
  onClose: () => void;
  filtered: Array<{ href: string; label: string; icon: React.ReactNode; category?: string }>;
}

export function SearchModal({ isOpen, query, onChange, onClose, filtered }: SearchModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="flex items-start justify-center pt-20" onClick={e => e.stopPropagation()}>
        <div className="mx-4 w-full max-w-2xl">
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
            <div className="border-b border-[#2a2a2a] p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search navigation..."
                  value={query}
                  onChange={e => onChange(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-3 pl-12 text-lg text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  autoFocus
                />
                <svg
                  className="absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto p-4">
              {filtered.length > 0 ? (
                <div className="space-y-1">
                  {filtered.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors hover:bg-[#2a2a2a]/50"
                    >
                      <span className="text-gray-400">{item.icon}</span>
                      <span className="text-gray-300">{item.label}</span>
                      <span className="ml-auto text-xs text-gray-500">{item.category}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400">No results found for "{query}"</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
