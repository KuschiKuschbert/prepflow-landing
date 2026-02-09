import { useEffect, useState } from 'react';
import { type SortOption } from '../../hooks/useIngredientFiltering';

export function useIngredientsView() {
  const [displayUnit, setDisplayUnit] = useState('g');
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [storageFilter, setStorageFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Default to smaller page size for server-side

  // Reset page when filters change
  useEffect(
    () => setPage(1),
    [itemsPerPage, searchTerm, supplierFilter, storageFilter, categoryFilter, sortBy],
  );

  // Derived params for API
  const [field, order] = sortBy.split('_');
  const queryParams = {
    page,
    pageSize: itemsPerPage,
    search: searchTerm,
    category: categoryFilter,
    supplier: supplierFilter,
    storage: storageFilter,
    sortBy: field,
    sortOrder: order as 'asc' | 'desc',
  };

  return {
    displayUnit,
    setDisplayUnit,
    searchTerm,
    setSearchTerm,
    supplierFilter,
    setSupplierFilter,
    storageFilter,
    setStorageFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    queryParams, // Expose for data fetcher
  };
}
