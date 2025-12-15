'use client';

import { useState, useEffect } from 'react';
import { List, X } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  number: number;
}

const sections: Section[] = [
  { id: 'acceptance-of-terms', title: 'Acceptance of Terms', number: 1 },
  { id: 'service-description', title: 'Service Description', number: 2 },
  { id: 'user-accounts', title: 'User Accounts and Registration', number: 3 },
  { id: 'payment-terms', title: 'Payment and Subscription Terms', number: 4 },
  { id: 'license-usage', title: 'License and Usage Rights', number: 5 },
  { id: 'intellectual-property', title: 'Intellectual Property Rights', number: 6 },
  { id: 'user-conduct', title: 'User Conduct and Responsibilities', number: 7 },
  { id: 'disclaimers', title: 'Disclaimers and Limitations', number: 8 },
  { id: 'limitation-liability', title: 'Limitation of Liability', number: 9 },
  { id: 'indemnification', title: 'Indemnification', number: 10 },
  { id: 'termination', title: 'Termination', number: 11 },
  { id: 'governing-law', title: 'Governing Law and Disputes', number: 12 },
  { id: 'changes-terms', title: 'Changes to Terms', number: 13 },
  { id: 'contact-information', title: 'Contact Information', number: 14 },
];

/**
 * Mobile Table of Contents component with floating button and modal.
 * Shows on mobile/tablet devices for easy navigation.
 */
export default function TermsMobileTOC() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('acceptance-of-terms');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 80;
      const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Close modal after selection
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Button - Mobile/Tablet Only */}
      <button
        onClick={() => setIsOpen(true)}
        className="desktop:hidden fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        aria-label="Open table of contents"
      >
        <List className="h-6 w-6 text-white" />
      </button>

      {/* Modal/Drawer - Mobile/Tablet Only */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="desktop:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div className="desktop:hidden fixed inset-x-0 bottom-0 z-[65] max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-[#2a2a2a] bg-[#1f1f1f]">
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-fluid-xl font-semibold text-white">Table of Contents</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 transition-colors hover:bg-[#2a2a2a]"
                  aria-label="Close table of contents"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </button>
              </div>

              {/* Section List */}
              <nav aria-label="Table of Contents">
                <ul className="space-y-2">
                  {sections.map(section => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`text-fluid-base w-full rounded-xl p-3 text-left transition-colors hover:bg-[#2a2a2a] ${
                          activeSection === section.id
                            ? 'bg-[#2a2a2a] font-semibold text-[#29E7CD]'
                            : 'text-gray-300'
                        }`}
                        aria-current={activeSection === section.id ? 'location' : undefined}
                      >
                        <span className="text-gray-500">{section.number}.</span> {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
