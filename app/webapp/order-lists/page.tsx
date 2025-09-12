'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';

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
    }>
  });

  // Mock user ID for now
  const userId = 'user-123';

  useEffect(() => {
    fetchOrderLists();
    fetchSuppliers();
    fetchIngredients();
  }, []);

  const fetchOrderLists = async () => {
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
            items: formData.items.filter(item => item.ingredientId && item.quantity)
          }
        : {
            userId,
            supplierId: formData.supplierId,
            name: formData.name,
            notes: formData.notes,
            items: formData.items.filter(item => item.ingredientId && item.quantity)
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
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
        notes: item.notes || ''
      }))
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order list?')) return;
    
    try {
      const response = await fetch(`/api/order-lists?id=${id}`, {
        method: 'DELETE'
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
        body: JSON.stringify({ id, status })
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

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { ingredientId: '', quantity: '', unit: '', notes: '' }]
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const resetForm = () => {
    setFormData({
      supplierId: '',
      name: '',
      notes: '',
      items: []
    });
    setShowForm(false);
    setEditingOrderList(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-400 bg-gray-400/10';
      case 'sent': return 'text-blue-400 bg-blue-400/10';
      case 'received': return 'text-green-400 bg-green-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[#1f1f1f] rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-[#1f1f1f] rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📋 {t('orderLists.title', 'Order Lists')}</h1>
            <p className="text-gray-400">{t('orderLists.subtitle', 'Create and manage supplier order lists')}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-2xl hover:shadow-xl transition-all duration-200 font-semibold"
          >
            + {t('orderLists.createOrderList', 'Create Order List')}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 rounded-2xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Order Lists */}
        <div className="space-y-4">
          {orderLists.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('orderLists.noOrderLists', 'No Order Lists')}</h3>
              <p className="text-gray-400 mb-6">{t('orderLists.noOrderListsDesc', 'Create your first order list to streamline supplier ordering')}</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-2xl hover:shadow-xl transition-all duration-200 font-semibold"
              >
                {t('orderLists.createFirstOrderList', 'Create Your First Order List')}
              </button>
            </div>
          ) : (
            orderLists.map((orderList) => (
              <div
                key={orderList.id}
                className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-6 hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 rounded-xl flex items-center justify-center">
                        <span className="text-lg">📋</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{orderList.name}</h3>
                        <p className="text-sm text-gray-400">{orderList.suppliers.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('orderLists.status', 'Status')}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orderList.status)}`}>
                          {orderList.status.charAt(0).toUpperCase() + orderList.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('orderLists.items', 'Items')}</p>
                        <p className="text-white font-semibold">{orderList.order_list_items.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('orderLists.created', 'Created')}</p>
                        <p className="text-white font-semibold">{new Date(orderList.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {orderList.notes && (
                      <p className="text-sm text-gray-300 mb-4">{orderList.notes}</p>
                    )}

                    {/* Order Items Preview */}
                    {orderList.order_list_items.length > 0 && (
                      <div className="bg-[#2a2a2a]/30 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-white mb-3">{t('orderLists.items', 'Items')}</h4>
                        <div className="space-y-2">
                          {orderList.order_list_items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-300">{item.ingredients.name}</span>
                              <span className="text-white font-semibold">{item.quantity} {item.unit}</span>
                            </div>
                          ))}
                          {orderList.order_list_items.length > 3 && (
                            <p className="text-xs text-gray-400">+{orderList.order_list_items.length - 3} more items</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {/* Status Dropdown */}
                    <select
                      value={orderList.status}
                      onChange={(e) => handleStatusChange(orderList.id, e.target.value)}
                      className="px-3 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white text-sm focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="received">Received</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(orderList)}
                        className="p-2 text-[#29E7CD] hover:bg-[#29E7CD]/10 rounded-xl transition-colors"
                        title={String(t('orderLists.edit', 'Edit'))}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(orderList.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                        title={String(t('orderLists.delete', 'Delete'))}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingOrderList ? t('orderLists.editOrderList', 'Edit Order List') : t('orderLists.createOrderList', 'Create Order List')}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('orderLists.supplier', 'Supplier')}
                    </label>
                    <select
                      value={formData.supplierId}
                      onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      required
                    >
                      <option value="">{t('orderLists.selectSupplier', 'Select a supplier')}</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('orderLists.name', 'Order List Name')}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      placeholder="e.g., Weekly Produce Order"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('orderLists.notes', 'Notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    rows={3}
                     placeholder={String(t('orderLists.notesPlaceholder', 'Optional notes about this order'))}
                  />
                </div>

                {/* Order Items */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{t('orderLists.items', 'Items')}</h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-4 py-2 bg-[#29E7CD]/10 text-[#29E7CD] rounded-xl hover:bg-[#29E7CD]/20 transition-colors text-sm font-semibold"
                    >
                      + {t('orderLists.addItem', 'Add Item')}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="bg-[#2a2a2a]/30 rounded-xl p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-400 mb-1">{t('orderLists.ingredient', 'Ingredient')}</label>
                            <select
                              value={item.ingredientId}
                              onChange={(e) => updateItem(index, 'ingredientId', e.target.value)}
                              className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                              required
                            >
                              <option value="">{t('orderLists.selectIngredient', 'Select ingredient')}</option>
                              {ingredients.map((ingredient) => (
                                <option key={ingredient.id} value={ingredient.id}>
                                  {ingredient.name} ({ingredient.unit})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">{t('orderLists.quantity', 'Quantity')}</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                              className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                              placeholder="0"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">{t('orderLists.unit', 'Unit')}</label>
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => updateItem(index, 'unit', e.target.value)}
                              className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                              placeholder="kg"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => updateItem(index, 'notes', e.target.value)}
                            className="flex-1 px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent mr-3"
                             placeholder={String(t('orderLists.itemNotes', 'Item notes (optional)'))}
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 bg-[#2a2a2a] text-gray-300 rounded-xl hover:bg-[#2a2a2a]/80 transition-colors"
                  >
                    {t('orderLists.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-xl hover:shadow-xl transition-all duration-200 font-semibold"
                  >
                    {editingOrderList ? t('orderLists.update', 'Update') : t('orderLists.create', 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
