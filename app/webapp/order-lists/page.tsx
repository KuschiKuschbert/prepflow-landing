'use client';

import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';
import { useEffect, useState } from 'react';
import { OrderListForm } from './components/OrderListForm';
import { getStatusColor } from './utils';
import { useOrderListsQuery } from './hooks/useOrderListsQuery';

interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
}

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  category: string;
}

interface OrderListItem {
  id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  notes?: string;
  ingredients: Ingredient;
}

interface OrderList {
  id: string;
  supplier_id: string;
  name: string;
  notes?: string;
  status: 'draft' | 'sent' | 'received' | 'cancelled';
  created_at: string;
  updated_at: string;
  suppliers: Supplier;
  order_list_items: OrderListItem[];
}

export default function OrderListsPage() {
  const { t } = useTranslation();
  const [orderLists, setOrderLists] = useState<OrderList[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false); // Start with false to prevent skeleton flash
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOrderList, setEditingOrderList] = useState<OrderList | null>(null);
  const [formData, setFormData] = useState({
    supplierId: '',
    name: '',
    notes: '',
    items: [] as Array<{
      ingredientId: string;
      quantity: string;
      unit: string;
      notes: string;
    }>,
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data: orderListsData, isLoading: listsLoading } = useOrderListsQuery(
    page,
    pageSize,
    userId,
  );

  // Mock user ID for now
  const userId = 'user-123';

  useEffect(() => {
    // Keep suppliers and ingredients fetch; lists come from query
    fetchSuppliers();
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (orderListsData?.items) setOrderLists(orderListsData.items as any);
  }, [orderListsData]);

  const fetchOrderLists = async () => {
    // Disable loading state to prevent skeleton flashes during API errors
    // setLoading(true);
    try {
      const response = await fetch(`/api/order-lists?userId=${userId}`);
      const result = await response.json();

      if (result.success) {
        setOrderLists(result.data);
      } else {
        setError(result.message || 'Failed to fetch order lists');
      }
    } catch (err) {
      setError('Failed to fetch order lists');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`/api/suppliers?userId=${userId}`);
      const result = await response.json();

      if (result.success) {
        setSuppliers(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await fetch(`/api/ingredients?userId=${userId}`);
      const result = await response.json();

      if (result.success) {
        setIngredients(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch ingredients:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingOrderList ? '/api/order-lists' : '/api/order-lists';
      const method = editingOrderList ? 'PUT' : 'POST';

      const body = editingOrderList
        ? {
            id: editingOrderList.id,
            supplierId: formData.supplierId,
            name: formData.name,
            notes: formData.notes,
            status: 'draft',
            items: formData.items.filter(item => item.ingredientId && item.quantity),
          }
        : {
            userId,
            supplierId: formData.supplierId,
            name: formData.name,
            notes: formData.notes,
            items: formData.items.filter(item => item.ingredientId && item.quantity),
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        await fetchOrderLists();
        resetForm();
        setError(null);
      } else {
        setError(result.message || 'Failed to save order list');
      }
    } catch (err) {
      setError('Failed to save order list');
    }
  };

  const handleEdit = (orderList: OrderList) => {
    setEditingOrderList(orderList);
    setFormData({
      supplierId: orderList.supplier_id,
      name: orderList.name,
      notes: orderList.notes || '',
      items: orderList.order_list_items.map(item => ({
        ingredientId: item.ingredient_id,
        quantity: item.quantity.toString(),
        unit: item.unit,
        notes: item.notes || '',
      })),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order list?')) return;

    try {
      const response = await fetch(`/api/order-lists?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchOrderLists();
      } else {
        setError(result.message || 'Failed to delete order list');
      }
    } catch (err) {
      setError('Failed to delete order list');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/order-lists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchOrderLists();
      } else {
        setError(result.message || 'Failed to update status');
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

  // item mutators moved into OrderListForm

  const resetForm = () => {
    setFormData({
      supplierId: '',
      name: '',
      notes: '',
      items: [],
    });
    setShowForm(false);
    setEditingOrderList(null);
  };

  // getStatusColor imported

  if (loading || listsLoading) {
    return (
      <div className="min-h-screen bg-transparent text-white">
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton variant="stats" height="64px" />
          <div className="mt-6 space-y-4">
            <LoadingSkeleton variant="card" count={5} height="80px" />
          </div>
        </div>
      </div>
    );
  }

  const total = orderListsData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              📋 {t('orderLists.title', 'Order Lists')}
            </h1>
            <p className="text-gray-400">
              {t('orderLists.subtitle', 'Create and manage supplier order lists')}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
          >
            + {t('orderLists.createOrderList', 'Create Order List')}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Order Lists */}
        <div className="space-y-4">
          {orderLists.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                {t('orderLists.noOrderLists', 'No Order Lists')}
              </h3>
              <p className="mb-6 text-gray-400">
                {t(
                  'orderLists.noOrderListsDesc',
                  'Create your first order list to streamline supplier ordering',
                )}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
              >
                {t('orderLists.createFirstOrderList', 'Create Your First Order List')}
              </button>
            </div>
          ) : (
            <>
              {orderLists.map(orderList => (
                <div
                  key={orderList.id}
                  className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
                          <span className="text-lg">📋</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{orderList.name}</h3>
                          <p className="text-sm text-gray-400">{orderList.suppliers.name}</p>
                        </div>
                      </div>

                      <div className="mb-4 flex items-center space-x-4">
                        <div>
                          <p className="mb-1 text-xs text-gray-400">
                            {t('orderLists.status', 'Status')}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(orderList.status)}`}
                          >
                            {orderList.status.charAt(0).toUpperCase() + orderList.status.slice(1)}
                          </span>
                        </div>
                        <div>
                          <p className="mb-1 text-xs text-gray-400">
                            {t('orderLists.items', 'Items')}
                          </p>
                          <p className="font-semibold text-white">
                            {orderList.order_list_items.length}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs text-gray-400">
                            {t('orderLists.created', 'Created')}
                          </p>
                          <p className="font-semibold text-white">
                            {new Date(orderList.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {orderList.notes && (
                        <p className="mb-4 text-sm text-gray-300">{orderList.notes}</p>
                      )}

                      {/* Order Items Preview */}
                      {orderList.order_list_items.length > 0 && (
                        <div className="rounded-xl bg-[#2a2a2a]/30 p-4">
                          <h4 className="mb-3 text-sm font-semibold text-white">
                            {t('orderLists.items', 'Items')}
                          </h4>
                          <div className="space-y-2">
                            {orderList.order_list_items.slice(0, 3).map(item => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-gray-300">{item.ingredients.name}</span>
                                <span className="font-semibold text-white">
                                  {item.quantity} {item.unit}
                                </span>
                              </div>
                            ))}
                            {orderList.order_list_items.length > 3 && (
                              <p className="text-xs text-gray-400">
                                +{orderList.order_list_items.length - 3} more items
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      {/* Status Dropdown */}
                      <select
                        value={orderList.status}
                        onChange={e => handleStatusChange(orderList.id, e.target.value)}
                        className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="received">Received</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(orderList)}
                          className="rounded-xl p-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/10"
                          title={String(t('orderLists.edit', 'Edit'))}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(orderList.id)}
                          className="rounded-xl p-2 text-red-400 transition-colors hover:bg-red-400/10"
                          title={String(t('orderLists.delete', 'Delete'))}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages} ({total} items)
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <OrderListForm
              suppliers={suppliers}
              ingredients={ingredients}
              formData={formData as any}
              setFormData={setFormData as any}
              onSubmit={handleSubmit}
              onClose={resetForm}
              isEditing={!!editingOrderList}
            />
          </div>
        )}
      </div>
    </div>
  );
}
