import { useEffect, useState } from 'react';
import { useIngredientFiltering, type SortOption } from '../../hooks/useIngredientFiltering';
import { usePagination } from '../IngredientsClient/helpers/usePagination';
import { Ingredient } from './useIngredientsClientController';

export function useIngredientsView(ingredients: Ingredient[]) {
  const [displayUnit, setDisplayUnit] = useState('g');
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [storageFilter, setStorageFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');

  const { filteredIngredients } = useIngredientFiltering({
    ingredients,
    searchTerm,
    supplierFilter,
    storageFilter,
    categoryFilter,
    sortBy,
  });

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(
    () => setPage(1),
    [itemsPerPage, searchTerm, supplierFilter, storageFilter, categoryFilter],
  );

  const filteredTotal = filteredIngredients?.length || 0;
  const { totalPages, startIndex } = usePagination({ filteredTotal, itemsPerPage, page });
  const paginatedIngredients =
    filteredIngredients?.slice(startIndex, startIndex + itemsPerPage) || [];

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
    filteredIngredients,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    filteredTotal,
    paginatedIngredients,
  };
}
