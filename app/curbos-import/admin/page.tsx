'use client';

import { Icon } from '@/components/ui/Icon';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';
import { Edit, Plus, Save, Trash, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import PageLayout from './components/PageLayout';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
};

/**
 * Home Page for CurbOS Admin (Menu Items Management)
 */
export default function Home() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem> | null>(null);
  const { showConfirm, ConfirmDialog } = useConfirm();

  const fetchItems = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('pos_menu_items').select('*').order('category');
      if (data) setItems(data);
      if (error) {
        logger.error('Error fetching menu items', { error, operation: 'fetchMenuItems' });
      }
    } catch (err) {
      logger.error('Unexpected error fetching menu items', {
        error: err,
        operation: 'fetchMenuItems',
      });
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSave = async (item: Partial<MenuItem>) => {
    if (!item.name || !item.price) return;
    const originalItems = [...items];

    try {
      if (item.id) {
        // Optimistic Update
        setItems(prev => prev.map(i => (i.id === item.id ? ({ ...i, ...item } as MenuItem) : i)));

        const { error } = await supabase
          .from('pos_menu_items')
          .update({
            name: item.name,
            price: item.price,
            category: item.category || 'Tacos',
            isAvailable: true,
          })
          .eq('id', item.id);

        if (error) {
          setItems(originalItems);
          logger.error('Error updating menu item', { error, item, operation: 'updateMenuItem' });
        }
      } else {
        const tempId = crypto.randomUUID();
        const newEntry = {
          id: tempId,
          name: item.name as string,
          price: item.price as number,
          category: item.category || 'Tacos',
          isAvailable: true,
          imageUrl: null,
          taxRate: 0.1,
        };

        // Optimistic Create
        setItems(prev => [...prev, newEntry]);

        const { error } = await supabase.from('pos_menu_items').insert(newEntry);

        if (error) {
          setItems(originalItems);
          logger.error('Error inserting menu item', { error, item, operation: 'insertMenuItem' });
        }
      }
    } catch (err) {
      setItems(originalItems);
      logger.error('Unexpected error saving menu item', { error: err, operation: 'saveMenuItem' });
    }

    setEditingItem(null);
    setNewItem(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Delete Menu Item',
      message:
        'Are you sure you want to delete this menu item? Standard Prepflow warning: this is irreversible.',
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

    const originalItems = [...items];
    // Optimistic Delete
    setItems(prev => prev.filter(i => i.id !== id));

    try {
      const { error } = await supabase.from('pos_menu_items').delete().eq('id', id);
      if (error) {
        setItems(originalItems);
        logger.error('Error deleting menu item', { error, id, operation: 'deleteMenuItem' });
      }
    } catch (err) {
      setItems(originalItems);
      logger.error('Unexpected error deleting menu item', {
        error: err,
        id,
        operation: 'deleteMenuItem',
      });
    }
    fetchItems();
  };

  return (
    <PageLayout>
      <div className="p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-lime-400">CurbOS Admin</h1>
            <div className="space-x-4">
              <Link
                href="/modifiers"
                className="text-gray-300 underline decoration-lime-400/30 transition-colors hover:text-white"
              >
                Manage Modifiers
              </Link>
            </div>
          </div>

          <div className="rounded-lg bg-neutral-800 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Menu Items</h2>
              <button
                onClick={() => setNewItem({ category: 'Tacos', price: 0 })}
                className="flex items-center gap-2 rounded-md bg-lime-500 px-4 py-2 font-bold text-black transition-colors hover:bg-lime-400"
              >
                <Icon icon={Plus} size="sm" /> Add Item
              </button>
            </div>

            {newItem && (
              <div className="animate-in fade-in slide-in-from-top-4 mb-4 rounded bg-neutral-700 p-4">
                <ItemForm item={newItem} onSave={handleSave} onCancel={() => setNewItem(null)} />
              </div>
            )}

            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded bg-neutral-700/50 p-4"
                >
                  {editingItem?.id === item.id ? (
                    <ItemForm
                      item={editingItem}
                      onSave={handleSave}
                      onCancel={() => setEditingItem(null)}
                    />
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>${item.price.toFixed(2)}</span>
                          <span className="rounded bg-neutral-600 px-2 py-0.5 text-xs">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="rounded p-2 text-blue-400 hover:bg-neutral-600"
                        >
                          <Icon icon={Edit} size="sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded p-2 text-red-400 hover:bg-neutral-600"
                        >
                          <Icon icon={Trash} size="sm" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </PageLayout>
  );
}

function ItemForm({
  item,
  onSave,
  onCancel,
}: {
  item: Partial<MenuItem>;
  onSave: (_: Partial<MenuItem>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="flex w-full items-center gap-4">
      <input
        className="flex-1 rounded border border-neutral-600 bg-neutral-900 px-3 py-2"
        placeholder="Name"
        value={formData.name || ''}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        className="w-24 rounded border border-neutral-600 bg-neutral-900 px-3 py-2"
        placeholder="Price"
        type="number"
        value={formData.price || ''}
        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
      />
      <input
        className="w-32 rounded border border-neutral-600 bg-neutral-900 px-3 py-2"
        placeholder="Category"
        value={formData.category || ''}
        onChange={e => setFormData({ ...formData, category: e.target.value })}
      />
      <button onClick={() => onSave(formData)} className="p-2 text-lime-400">
        <Icon icon={Save} size="md" />
      </button>
      <button onClick={onCancel} className="p-2 text-gray-400">
        <Icon icon={X} size="md" />
      </button>
    </div>
  );
}
