import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { HelpCircle, Mail, MessageSquare, FileText } from 'lucide-react';

interface QuickActionsProps {
  onContactFormClick: () => void;
}

/**
 * Quick actions section for help and support
 */
export function QuickActions({ onContactFormClick }: QuickActionsProps) {
  return (
    <div className="desktop:grid-cols-2 grid grid-cols-1 gap-3">
      <a
        href="mailto:hello@prepflow.org?subject=PrepFlow Support"
        className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4 transition-colors hover:bg-[#2a2a2a]/40"
      >
        <Icon icon={Mail} size="md" className="text-[#29E7CD]" aria-hidden={true} />
        <div>
          <p className="font-medium text-white">Email Support</p>
          <p className="text-xs text-gray-400">hello@prepflow.org</p>
        </div>
      </a>

      <button
        onClick={onContactFormClick}
        className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4 transition-colors hover:bg-[#2a2a2a]/40"
      >
        <Icon icon={MessageSquare} size="md" className="text-[#29E7CD]" aria-hidden={true} />
        <div>
          <p className="font-medium text-white">Contact Form</p>
          <p className="text-xs text-gray-400">Submit a support request</p>
        </div>
      </button>

      <Link
        href="/#faq"
        className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4 transition-colors hover:bg-[#2a2a2a]/40"
      >
        <Icon icon={HelpCircle} size="md" className="text-[#29E7CD]" aria-hidden={true} />
        <div>
          <p className="font-medium text-white">FAQ</p>
          <p className="text-xs text-gray-400">Frequently asked questions</p>
        </div>
      </Link>

      <Link
        href="/#resources"
        className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4 transition-colors hover:bg-[#2a2a2a]/40"
      >
        <Icon icon={FileText} size="md" className="text-[#29E7CD]" aria-hidden={true} />
        <div>
          <p className="font-medium text-white">Documentation</p>
          <p className="text-xs text-gray-400">User guides and tutorials</p>
        </div>
      </Link>
    </div>
  );
}
