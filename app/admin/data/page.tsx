'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Database, Search, Download, Filter } from 'lucide-react';
import { logger } from '@/lib/logger';

interface SearchResult {
  table: string;
  id: string;
  data: any;
  created_at?: string;
}

/**
 * Data audit page component for admin dashboard.
 * Provides search and export functionality across all database tables.
 *
 * @component
 * @returns {JSX.Element} Data audit page with search and export capabilities
 */
export default function DataAuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const tables = [
    { value: 'all', label: 'All Tables' },
    { value: 'ingredients', label: 'Ingredients' },
    { value: 'recipes', label: 'Recipes' },
    { value: 'dishes', label: 'Dishes' },
    { value: 'users', label: 'Users' },
    { value: 'temperature_logs', label: 'Temperature Logs' },
    { value: 'cleaning_tasks', label: 'Cleaning Tasks' },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        ...(selectedTable !== 'all' && { table: selectedTable }),
      });
      const response = await fetch(`/api/admin/data/search?${params}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      logger.error('Failed to search data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        ...(selectedTable !== 'all' && { table: selectedTable }),
        format: 'csv',
      });
      const response = await fetch(`/api/admin/data/export?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `data-export-${new Date().toISOString()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      logger.error('Failed to export data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Data Audit</h1>
        <p className="mt-2 text-gray-400">Search and export data across all tables</p>
      </div>

      {/* Search Controls */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Icon
              icon={Search}
              size="sm"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search across all tables..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] py-2 pr-4 pl-10 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:outline-none"
            />
          </div>
          <select
            value={selectedTable}
            onChange={e => setSelectedTable(e.target.value)}
            className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
          >
            {tables.map(table => (
              <option key={table.value} value={table.value}>
                {table.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-lg bg-[#29E7CD]/10 px-6 py-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          {results.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg bg-[#D925C7]/10 px-6 py-2 text-[#D925C7] transition-colors hover:bg-[#D925C7]/20"
            >
              <Icon icon={Download} size="sm" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Results ({results.length})</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={`${result.table}-${result.id}-${index}`}
                className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#29E7CD]">{result.table}</span>
                  {result.created_at && (
                    <span className="text-xs text-gray-400">
                      {new Date(result.created_at).toLocaleString()}
                    </span>
                  )}
                </div>
                <pre className="max-h-48 overflow-auto text-xs text-gray-300">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && searchQuery && (
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-12 text-center">
          <Icon icon={Database} size="xl" className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">No results found</p>
        </div>
      )}
    </div>
  );
}
