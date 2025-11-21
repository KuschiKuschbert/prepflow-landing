/**
 * Allergen Overview Component
 * Displays all dishes/recipes with their allergens for compliance tracking
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { AllergenDisplay } from '@/components/ui/AllergenDisplay';
import { TablePagination } from '@/components/ui/TablePagination';
import { logger } from '@/lib/logger';
import { Icon } from '@/components/ui/Icon';
import { Search, Filter, Download, FileText, ChevronDown, X } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { AllergenOverviewMobileCard } from './AllergenOverviewMobileCard';

export interface AllergenItem {
  id: string;
  name: string;
  description?: string;
  type: 'recipe' | 'dish';
  allergens: string[];
  allergenSources?: Record<string, string[]>; // allergen_code -> ingredient names
  menus: Array<{ menu_id: string; menu_name: string }>;
}

export function AllergenOverview() {
  const { showSuccess, showError } = useNotification();
  const [items, setItems] = useState<AllergenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAllergenFilter, setSelectedAllergenFilter] = useState<string>('all');
  const [showOnlyWithAllergens, setShowOnlyWithAllergens] = useState(false);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const fetchAllergenData = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/compliance/allergens';
      const params = new URLSearchParams();

      if (selectedAllergenFilter !== 'all') {
        params.append('exclude_allergen', selectedAllergenFilter);
      }

      // Always fetch all items - menu filter is informational only
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        logger.error('[Allergen Overview] Error fetching data:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData.error || errorData.message || 'Failed to fetch allergen data',
          details: errorData,
        });
        setItems([]);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setItems(data.data.items || []);
      } else {
        logger.error('[Allergen Overview] Error fetching data:', {
          error: data.error || data.message || 'Unknown error',
          data,
        });
        setItems([]);
      }
    } catch (err) {
      logger.error('[Allergen Overview] Error:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedAllergenFilter]);

  useEffect(() => {
    fetchAllergenData();
  }, [fetchAllergenData]);

  // Filter items by search query and allergen filter
  const filterItems = useCallback(
    (itemsToFilter: AllergenItem[]) => {
      return itemsToFilter.filter(item => {
        const matchesSearch =
          !searchQuery ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesAllergenFilter =
          !showOnlyWithAllergens || (item.allergens && item.allergens.length > 0);

        return matchesSearch && matchesAllergenFilter;
      });
    },
    [searchQuery, showOnlyWithAllergens],
  );

  const handleExport = async (format: 'csv' | 'pdf' | 'html') => {
    setExportLoading(format);
    try {
      const params = new URLSearchParams();
      params.append('format', format);

      if (selectedAllergenFilter !== 'all') {
        params.append('exclude_allergen', selectedAllergenFilter);
      }

      const response = await fetch(`/api/compliance/allergens/export?${params.toString()}`);

      if (!response.ok) {
        let errorMessage = 'Failed to export allergen data';
        try {
          const data = await response.json();
          errorMessage = data.error || data.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = `Export failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // For PDF, open in new window for print-to-PDF functionality
      if (format === 'pdf') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
          showSuccess(
            "PDF export opened in new window. Use your browser's print dialog to save as PDF.",
          );
        } else {
          // Fallback to download if popup blocked
          const a = document.createElement('a');
          a.href = url;
          a.download = 'allergen_overview.html';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showSuccess('HTML file downloaded. Open it and use Print > Save as PDF.');
        }
        // Clean up URL after a delay
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } else {
        // For CSV and HTML, download normally
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `allergen_overview.${format === 'csv' ? 'csv' : 'html'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showSuccess(`Allergen overview exported as ${format.toUpperCase()}`);
      }
    } catch (err) {
      logger.error('[Allergen Overview] Export error:', err);
      showError(err instanceof Error ? err.message : 'Failed to export allergen overview');
    } finally {
      setExportLoading(null);
    }
  };

  // Filter items using helper function
  const filteredItems = filterItems(items);

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedAllergenFilter !== 'all' || showOnlyWithAllergens;

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedAllergenFilter('all');
    setShowOnlyWithAllergens(false);
  }, []);

  // Get allergen filter display name
  const getAllergenFilterName = (value: string) => {
    const names: Record<string, string> = {
      gluten: 'Gluten-Free',
      milk: 'Dairy-Free',
      eggs: 'Egg-Free',
      nuts: 'Nut-Free',
      soy: 'Soy-Free',
      fish: 'Fish-Free',
      shellfish: 'Shellfish-Free',
      sesame: 'Sesame-Free',
    };
    return names[value] || value;
  };

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedAllergenFilter, showOnlyWithAllergens]);

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Dropdown */}
      <div className="relative">
        <button
          onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
          disabled={exportLoading !== null}
          className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-2 text-sm text-white transition-colors hover:bg-[#2a2a2a] disabled:opacity-50"
        >
          <Icon icon={Download} size="sm" aria-hidden={true} />
          <span>{exportLoading ? `Exporting ${exportLoading.toUpperCase()}...` : 'Export'}</span>
          <Icon
            icon={ChevronDown}
            size="xs"
            className={`transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`}
            aria-hidden={true}
          />
        </button>
        {exportDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setExportDropdownOpen(false)}
              aria-hidden={true}
            />
            <div className="absolute top-full left-0 z-50 mt-1.5 w-44 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
              <div className="p-1.5">
                <button
                  onClick={() => {
                    handleExport('csv');
                    setExportDropdownOpen(false);
                  }}
                  disabled={exportLoading !== null}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon icon={FileText} size="sm" aria-hidden={true} />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => {
                    handleExport('html');
                    setExportDropdownOpen(false);
                  }}
                  disabled={exportLoading !== null}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon icon={FileText} size="sm" aria-hidden={true} />
                  <span>Export HTML</span>
                </button>
                <button
                  onClick={() => {
                    handleExport('pdf');
                    setExportDropdownOpen(false);
                  }}
                  disabled={exportLoading !== null}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon icon={FileText} size="sm" aria-hidden={true} />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {hasActiveFilters && (
            <>
              {selectedAllergenFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-3 py-1 text-xs font-medium text-[#29E7CD]">
                  {getAllergenFilterName(selectedAllergenFilter)}
                  <button
                    onClick={() => setSelectedAllergenFilter('all')}
                    className="transition-colors hover:text-[#29E7CD]"
                    aria-label={`Remove ${getAllergenFilterName(selectedAllergenFilter)} filter`}
                  >
                    <Icon icon={X} size="xs" aria-hidden={true} />
                  </button>
                </span>
              )}
              {showOnlyWithAllergens && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-3 py-1 text-xs font-medium text-[#29E7CD]">
                  With Allergens Only
                  <button
                    onClick={() => setShowOnlyWithAllergens(false)}
                    className="transition-colors hover:text-[#29E7CD]"
                    aria-label="Remove with allergens filter"
                  >
                    <Icon icon={X} size="xs" aria-hidden={true} />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-3 py-1 text-xs font-medium text-[#29E7CD]">
                  Search: &quot;{searchQuery}&quot;
                  <button
                    onClick={() => setSearchQuery('')}
                    className="transition-colors hover:text-[#29E7CD]"
                    aria-label="Clear search"
                  >
                    <Icon icon={X} size="xs" aria-hidden={true} />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-[#29E7CD]/50 hover:bg-[#1f1f1f] hover:text-[#29E7CD]"
              >
                <Icon icon={X} size="xs" aria-hidden={true} />
                Clear All
              </button>
            </>
          )}
        </div>
        <div className="tablet:grid-cols-3 grid grid-cols-1 gap-4">
          {/* Search */}
          <div className="relative">
            <Icon
              icon={Search}
              size="sm"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              aria-hidden={true}
            />
            <input
              type="text"
              placeholder="Search dishes/recipes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] py-2 pr-3 pl-10 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            />
          </div>

          {/* Allergen Filter */}
          <div className="relative">
            <Icon
              icon={Filter}
              size="sm"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              aria-hidden={true}
            />
            <select
              value={selectedAllergenFilter}
              onChange={e => setSelectedAllergenFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] py-2 pr-3 pl-10 text-sm text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            >
              <option value="all">All Items</option>
              <option value="gluten">Gluten-Free</option>
              <option value="milk">Dairy-Free</option>
              <option value="eggs">Egg-Free</option>
              <option value="nuts">Nut-Free</option>
              <option value="soy">Soy-Free</option>
              <option value="fish">Fish-Free</option>
              <option value="shellfish">Shellfish-Free</option>
              <option value="sesame">Sesame-Free</option>
            </select>
          </div>

          {/* Show Only With Allergens Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showOnlyWithAllergens"
              checked={showOnlyWithAllergens}
              onChange={e => setShowOnlyWithAllergens(e.target.checked)}
              className="h-4 w-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
            />
            <label htmlFor="showOnlyWithAllergens" className="text-sm text-gray-300">
              Show only items with allergens
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Pagination - Top */}
        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          total={filteredItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={itemsPerPage => {
            setItemsPerPage(itemsPerPage);
            setCurrentPage(1);
          }}
          className="mb-4"
        />

        {/* Mobile Card Layout */}
        <div className="desktop:hidden block space-y-3">
          {filteredItems.length === 0 ? (
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
                  <Icon icon={Search} size="lg" className="text-[#29E7CD]" aria-hidden={true} />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {hasActiveFilters ? 'No Items Match Your Filters' : 'No Items Found'}
              </h3>
              <p className="mb-4 text-sm text-gray-400">
                {hasActiveFilters
                  ? 'Try adjusting your filters or clearing them to see all items.'
                  : items.length === 0
                    ? 'Start by adding recipes or dishes to track allergen information.'
                    : 'All items have been filtered out.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#29E7CD]/50 hover:bg-[#1f1f1f] hover:text-[#29E7CD]"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            paginatedItems.map(item => (
              <AllergenOverviewMobileCard key={`${item.type}-${item.id}`} item={item} />
            ))
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="desktop:block hidden overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#2a2a2a]">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                    Allergens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                    From Ingredients
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12">
                      <div className="text-center">
                        <div className="mb-4 flex justify-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
                            <Icon
                              icon={Search}
                              size="lg"
                              className="text-[#29E7CD]"
                              aria-hidden={true}
                            />
                          </div>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          {hasActiveFilters ? 'No Items Match Your Filters' : 'No Items Found'}
                        </h3>
                        <p className="mb-4 text-sm text-gray-400">
                          {hasActiveFilters
                            ? 'Try adjusting your filters or clearing them to see all items.'
                            : items.length === 0
                              ? 'Start by adding recipes or dishes to track allergen information.'
                              : 'All items have been filtered out.'}
                        </p>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#29E7CD]/50 hover:bg-[#1f1f1f] hover:text-[#29E7CD]"
                          >
                            Clear All Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map(item => {
                    // Build map of ingredient name -> allergens it contributes to
                    const ingredientAllergenMap: Record<string, string[]> = {};
                    if (item.allergenSources) {
                      Object.entries(item.allergenSources).forEach(([allergen, ingredients]) => {
                        ingredients.forEach(ingredientName => {
                          if (!ingredientAllergenMap[ingredientName]) {
                            ingredientAllergenMap[ingredientName] = [];
                          }
                          if (!ingredientAllergenMap[ingredientName].includes(allergen)) {
                            ingredientAllergenMap[ingredientName].push(allergen);
                          }
                        });
                      });
                    }

                    const allIngredientNames = Object.keys(ingredientAllergenMap);

                    return (
                      <tr
                        key={`${item.type}-${item.id}`}
                        className="transition-colors hover:bg-[#2a2a2a]/20"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                item.type === 'recipe'
                                  ? 'border border-[#29E7CD]/20 bg-[#29E7CD]/10 text-[#29E7CD]'
                                  : 'border border-[#D925C7]/20 bg-[#D925C7]/10 text-[#D925C7]'
                              }`}
                            >
                              {item.type === 'recipe' ? 'Recipe' : 'Dish'}
                            </span>
                            <div className="text-sm font-medium text-white">{item.name}</div>
                          </div>
                          {item.description && (
                            <div className="mt-1 text-xs text-gray-400">{item.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <AllergenDisplay
                            allergens={item.allergens}
                            showEmpty={true}
                            emptyMessage="None"
                            size="sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          {allIngredientNames.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {allIngredientNames.map(ingredientName => {
                                const allergens = ingredientAllergenMap[ingredientName];
                                const tooltipText =
                                  allergens.length > 0
                                    ? `Contains: ${allergens.join(', ')}`
                                    : ingredientName;
                                return (
                                  <span
                                    key={ingredientName}
                                    title={tooltipText}
                                    className="inline-flex cursor-help rounded-full bg-[#2a2a2a] px-2.5 py-0.5 text-xs font-medium text-gray-300 transition-colors hover:bg-[#29E7CD]/10 hover:text-[#29E7CD]"
                                  >
                                    {ingredientName}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Bottom */}
        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          total={filteredItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={itemsPerPage => {
            setItemsPerPage(itemsPerPage);
            setCurrentPage(1);
          }}
          className="mt-4"
        />
      </div>
    </div>
  );
}
