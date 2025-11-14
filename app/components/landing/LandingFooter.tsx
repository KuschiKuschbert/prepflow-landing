'use client';

import Link from 'next/link';
import React from 'react';

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-700 bg-[#0a0a0a]/95 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 tablet:grid-cols-4">
          {/* Brand */}
          <div className="tablet:col-span-2">
            <h3 className="mb-4 text-fluid-xl font-bold text-white">PrepFlow</h3>
            <p className="text-fluid-sm text-gray-400">
              Restaurant profitability optimization tool built by chefs for kitchens worldwide.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="mb-4 text-fluid-sm font-semibold tracking-wider text-gray-300 uppercase">
              Legal
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/privacy-policy"
                className="text-fluid-sm text-gray-400 transition-colors hover:text-[#29E7CD] focus:text-[#29E7CD] focus:outline-none"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-fluid-sm text-gray-400 transition-colors hover:text-[#29E7CD] focus:text-[#29E7CD] focus:outline-none"
              >
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-fluid-sm font-semibold tracking-wider text-gray-300 uppercase">
              Contact
            </h4>
            <nav className="flex flex-col space-y-2">
              <a
                href="mailto:hello@prepflow.org"
                className="text-fluid-sm text-gray-400 transition-colors hover:text-[#29E7CD] focus:text-[#29E7CD] focus:outline-none"
              >
                hello@prepflow.org
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-fluid-sm text-gray-500">© {currentYear} PrepFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
