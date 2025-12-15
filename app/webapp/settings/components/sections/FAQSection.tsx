'use client';

import { Icon } from '@/components/ui/Icon';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'webapp' | 'general';
}

interface FAQItemComponentProps {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Individual FAQ item component with expandable answer.
 *
 * @component
 * @param {FAQItemComponentProps} props - Component props
 * @returns {JSX.Element} FAQ item with expandable answer
 */
function FAQItemComponent({ item, isExpanded, onToggle }: FAQItemComponentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    } else if (e.key === 'Escape' && isExpanded) {
      onToggle();
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] transition-colors hover:border-[#2a2a2a]/60">
      <button
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className="flex w-full items-center justify-between px-6 py-4 text-left focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
        aria-expanded={isExpanded}
        aria-controls={`faq-answer-${item.id}`}
      >
        <div className="flex flex-1 items-start gap-4">
          <Icon
            icon={HelpCircle}
            size="md"
            className="mt-0.5 flex-shrink-0 text-[#29E7CD]"
            aria-hidden={true}
          />
          <span className="font-medium text-white">{item.question}</span>
        </div>
        <Icon
          icon={ChevronDown}
          size="sm"
          className={`ml-4 flex-shrink-0 text-gray-400 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          aria-hidden={true}
        />
      </button>

      <div
        id={`faq-answer-${item.id}`}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          height: `${contentHeight}px`,
        }}
      >
        <div ref={contentRef} className="px-6 pb-4">
          <div className="pl-9">
            <p className="text-sm leading-relaxed text-gray-300">{item.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const faqItems: FAQItem[] = [
  // Webapp-Specific Questions
  {
    id: 'import-ingredients',
    question: 'How do I import ingredients?',
    answer:
      'Go to the Ingredients page and click the "Import CSV" button. You can upload a CSV file with columns for ingredient name, cost, unit, brand, and storage location. PrepFlow will automatically handle unit conversions and data cleanup.',
    category: 'webapp',
  },
  {
    id: 'import-recipes',
    question: 'How do I import recipes?',
    answer:
      'Recipes can be created manually using the Recipe Builder, or you can import them via CSV. Go to the Recipes page and use the import feature. Make sure your CSV includes recipe names, instructions, and ingredient lists with quantities.',
    category: 'webapp',
  },
  {
    id: 'calculate-cogs',
    question: 'How do I calculate COGS for a dish?',
    answer:
      'Create a dish in the Menu Builder and assign it a recipe. PrepFlow automatically calculates the COGS based on your recipe ingredients, including waste factors and yield adjustments. You can view detailed cost breakdowns in the COGS calculator page.',
    category: 'webapp',
  },
  {
    id: 'temperature-monitoring',
    question: 'How do I set up temperature monitoring?',
    answer:
      'Go to the Setup page and use the "Temperature Equipment Setup" section. You can add equipment manually or populate test data which includes basic equipment. Each piece of equipment can be configured with temperature thresholds based on Queensland food safety standards.',
    category: 'webapp',
  },
  {
    id: 'create-menu',
    question: 'How do I create a menu?',
    answer:
      'Navigate to Menu Builder and click "New Menu". Add dishes to your menu by selecting recipes and setting selling prices. You can organize dishes into sections and reorder them as needed. The menu builder automatically calculates profitability for each dish.',
    category: 'webapp',
  },
  {
    id: 'share-recipes',
    question: 'How do I share recipes?',
    answer:
      'Go to the Recipe Sharing page and select the recipes you want to share. Enter the email address of the user you want to share with. They will receive access to view and use your shared recipes in their own PrepFlow account.',
    category: 'webapp',
  },
  {
    id: 'reset-data',
    question: 'How do I reset my data?',
    answer:
      'Go to the Setup page and scroll to the "Danger Zone" section. Click "Reset Your Data" to delete all your ingredients, recipes, menu dishes, and other data. This action can't be undone. You can optionally reseed with clean test data after resetting.',
    category: 'webapp',
  },
  // General Questions
  {
    id: 'cogs-accuracy',
    question: 'How accurate are COGS calculations?',
    answer:
      'PrepFlow uses industry-standard formulas with waste factors, yield adjustments, and supplier variations. Calculations update live as you build recipes—no manual recalculations needed. The system accounts for unit conversions, wastage percentages, and cost variations.',
    category: 'general',
  },
  {
    id: 'import-existing-data',
    question: 'Can I import existing data?',
    answer:
      'Yes! PrepFlow supports CSV imports for ingredients, recipes, and suppliers. The system handles unit conversions and data cleanup automatically. You can import your existing inventory, recipe database, and supplier information to get started quickly.',
    category: 'general',
  },
  {
    id: 'data-security',
    question: 'Is my data secure?',
    answer:
      'Yes. PrepFlow uses encrypted storage, Auth0 authentication, and regular backups. Your data is stored securely in Supabase with industry-standard security practices. We never share your data with third parties, and you maintain full control over your information.',
    category: 'general',
  },
  {
    id: 'offline-mode',
    question: 'Does it work offline?',
    answer:
      'PrepFlow is a web-based application that requires an internet connection. Your data is securely stored in the cloud and accessible from any device with internet access. This ensures your data is always backed up and synchronized across devices.',
    category: 'general',
  },
  {
    id: 'contact-support',
    question: 'How do I contact support?',
    answer:
      'You can reach our support team by emailing hello@prepflow.org or using the contact form in the Privacy & Legal section of Settings. We typically respond within 24-48 hours. For urgent issues, please include "URGENT" in your subject line.',
    category: 'general',
  },
];

/**
 * FAQ section component with expandable accordion items.
 * Displays both webapp-specific and general FAQ questions.
 *
 * @component
 * @returns {JSX.Element} FAQ section with expandable items
 */
export function FAQSection() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<'all' | 'webapp' | 'general'>('all');

  const filteredItems =
    activeCategory === 'all' ? faqItems : faqItems.filter(item => item.category === activeCategory);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
        <p className="mt-1 text-sm text-gray-400">
          Find answers to common questions about using PrepFlow and managing your restaurant data.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'border border-[#29E7CD]/30 bg-[#29E7CD]/10 text-[#29E7CD]'
              : 'border border-[#2a2a2a] bg-[#2a2a2a]/40 text-gray-300 hover:bg-[#2a2a2a]/60'
          }`}
        >
          All Questions
        </button>
        <button
          onClick={() => setActiveCategory('webapp')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === 'webapp'
              ? 'border border-[#29E7CD]/30 bg-[#29E7CD]/10 text-[#29E7CD]'
              : 'border border-[#2a2a2a] bg-[#2a2a2a]/40 text-gray-300 hover:bg-[#2a2a2a]/60'
          }`}
        >
          Webapp Usage
        </button>
        <button
          onClick={() => setActiveCategory('general')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === 'general'
              ? 'border border-[#29E7CD]/30 bg-[#29E7CD]/10 text-[#29E7CD]'
              : 'border border-[#2a2a2a] bg-[#2a2a2a]/40 text-gray-300 hover:bg-[#2a2a2a]/60'
          }`}
        >
          General
        </button>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredItems.map(item => (
          <FAQItemComponent
            key={item.id}
            item={item}
            isExpanded={expandedItems.has(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </div>

      {/* Help Link */}
      <div className="mt-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
        <div className="flex items-start gap-4">
          <Icon
            icon={HelpCircle}
            size="lg"
            className="flex-shrink-0 text-[#29E7CD]"
            aria-hidden={true}
          />
          <div>
            <h3 className="mb-2 font-semibold text-white">Still have questions?</h3>
            <p className="mb-4 text-sm text-gray-400">
              Can&apos;t find what you&apos;re looking for? Contact our support team for help.
            </p>
            <a
              href="mailto:hello@prepflow.org?subject=PrepFlow Support"
              className="inline-flex items-center gap-2 rounded-xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-4 py-2 text-sm font-medium text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
