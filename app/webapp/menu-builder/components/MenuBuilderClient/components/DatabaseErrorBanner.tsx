import { Icon } from '@/components/ui/Icon';
import { Database, RefreshCw } from 'lucide-react';

interface DatabaseErrorBannerProps {
  dbError: string;
  onCheckAgain: () => void;
}

/**
 * Component for displaying database setup error banner
 */
export function DatabaseErrorBanner({ dbError, onCheckAgain }: DatabaseErrorBannerProps) {
  return (
    <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-6">
      <div className="mb-4 flex items-start gap-3">
        <Icon icon={Database} size="lg" className="mt-0.5 text-yellow-400" />
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-yellow-400">Database Setup Required</h3>
          <p className="mb-4 text-sm text-yellow-300">{dbError}</p>
          <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-900/10 p-4">
            <p className="mb-2 text-sm font-medium text-yellow-200">To set up the menu builder:</p>
            <ol className="ml-4 list-decimal space-y-1 text-sm text-yellow-300">
              <li>Open your Supabase project dashboard</li>
              <li>Go to SQL Editor (left sidebar)</li>
              <li>Click &quot;New query&quot;</li>
              <li>
                Copy the SQL from{' '}
                <code className="rounded bg-yellow-900/30 px-1.5 py-0.5 text-xs">
                  menu-builder-schema.sql
                </code>{' '}
                in the project root
              </li>
              <li>Paste and run the SQL in Supabase SQL Editor</li>
              <li>Click the refresh button below to verify</li>
            </ol>
          </div>
          <button
            onClick={onCheckAgain}
            className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-900/20 px-4 py-2 text-sm font-medium text-yellow-300 transition-colors hover:bg-yellow-900/30"
          >
            <Icon icon={RefreshCw} size="sm" />
            Check Again
          </button>
        </div>
      </div>
    </div>
  );
}




