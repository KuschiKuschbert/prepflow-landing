'use client';

import { useEffect, useState } from 'react';

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
 * Table of Contents component with scroll spy for Terms page.
 * Shows active section based on scroll position.
 */
export default function TermsTableOfContents() {
  const [activeSection, setActiveSection] = useState<string>('acceptance-of-terms');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for better UX

      // Find the section currently in view
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

    // Initial check
    handleScroll();

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 80; // Account for scroll progress bar and spacing
      const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      className="desktop:block fixed top-32 right-8 z-40 hidden w-64 max-w-xs"
      aria-label="Table of Contents"
    >
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/95 p-6 backdrop-blur-sm">
        <h3 className="text-fluid-lg mb-4 font-semibold text-white">Table of Contents</h3>
        <ul className="space-y-2">
          {sections.map(section => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`text-fluid-sm w-full text-left transition-colors hover:text-[#29E7CD] ${
                  activeSection === section.id ? 'font-semibold text-[#29E7CD]' : 'text-gray-300'
                }`}
                aria-current={activeSection === section.id ? 'location' : undefined}
              >
                <span className="text-gray-500">{section.number}.</span> {section.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}



