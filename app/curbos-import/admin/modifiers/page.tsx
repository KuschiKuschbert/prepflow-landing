'use client';

import { Icon } from '@/components/ui/Icon';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';
import { ArrowLeft, Edit, Plus, Save, Trash, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PageLayout from '../components/PageLayout';

type ModifierOption = {
  id: string;
  name: string;
  priceDelta: number;
  type: string;
  isAvailable: boolean;
};

/**
 * Modifiers Page for CurbOS Admin
 */
export default function ModifiersPage() {
  const [modifiers, setModifiers] = useState<ModifierOption[]>([]);
  const [editingItem, setEditingItem] = useState<ModifierOption | null>(null);
  const [newItem, setNewItem] = useState<Partial<ModifierOption> | null>(null);
  const { showConfirm, ConfirmDialog } = useConfirm();

  const fetchItems = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('modifier_options').select('*').order('name');
      if (data) setModifiers(data);
      if (error) {
        logger.error('Error fetching modifiers', { error, operation: 'fetchModifiers' });
      }
    } catch (err) {
      logger.error('Unexpected error fetching modifiers', {
        error: err,
        operation: 'fetchModifiers',
      });
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSave = async (item: Partial<ModifierOption>) => {
    if (!item.name) return;

    // Auto-detect type based on price
    const type = (item.priceDelta || 0) < 0 ? 'REMOVAL' : 'ADDON';
    const originalModifiers = [...modifiers];

    try {
      if (item.id) {
        // Optimistic Update
        setModifiers(prev =>
          prev.map(m => (m.id === item.id ? ({ ...m, ...item, type } as ModifierOption) : m)),
        );

        const { error } = await supabase
          .from('modifier_options')
          .update({
            name: item.name,
            priceDelta: item.priceDelta || 0,
            type: type,
          })
          .eq('id', item.id);

        if (error) {
          setModifiers(originalModifiers);
          logger.error('Error updating modifier', { error, item, operation: 'updateModifier' });
        }
      } else {
        const tempId = crypto.randomUUID();
        const newEntry = {
          id: tempId,
          name: item.name as string,
          priceDelta: item.priceDelta || 0,
          type: type,
          isAvailable: true,
        };

        // Optimistic Create
        setModifiers(prev => [...prev, newEntry]);

        const { error } = await supabase.from('modifier_options').insert(newEntry);

        if (error) {
          setModifiers(originalModifiers);
          logger.error('Error inserting modifier', { error, item, operation: 'insertModifier' });
        }
      }
    } catch (err) {
      setModifiers(originalModifiers);
      logger.error('Unexpected error saving modifier', { error: err, operation: 'saveModifier' });
    }

    setEditingItem(null);
    setNewItem(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Delete Modifier',
      message: 'Are you sure you want to delete this modifier? This choice is final.',
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Wait, go back',
    });

    if (!confirmed) return;

    const originalModifiers = [...modifiers];
    // Optimistic Delete
    setModifiers(prev => prev.filter(m => m.id !== id));

    try {
      const { error } = await supabase.from('modifier_options').delete().eq('id', id);
      if (error) {
        setModifiers(originalModifiers);
        logger.error('Error deleting modifier', { error, id, operation: 'deleteModifier' });
      }
    } catch (err) {
      setModifiers(originalModifiers);
      logger.error('Unexpected error deleting modifier', {
        error: err,
        id,
        operation: 'deleteModifier',
      });
    }
    fetchItems();
  };

  return (
    <PageLayout>
      <div className="p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="rounded-full p-2 hover:bg-neutral-800">
                <Icon icon={ArrowLeft} />
              </Link>
              <h1 className="text-3xl font-bold text-lime-400">Modifiers</h1>
            </div>
          </div>

          <div className="rounded-lg bg-neutral-800 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Available Modifiers</h2>
              <button
                onClick={() => setNewItem({ priceDelta: 0 })}
                className="transitions-colors flex items-center gap-2 rounded-md bg-lime-500 px-4 py-2 font-bold text-black hover:bg-lime-400"
              >
                <Icon icon={Plus} size="sm" /> Add Modifier
              </button>
            </div>

            {newItem && (
              <div className="animate-in fade-in slide-in-from-top-4 mb-4 rounded bg-neutral-700 p-4">
                <ItemForm item={newItem} onSave={handleSave} onCancel={() => setNewItem(null)} />
              </div>
            )}

            <div className="space-y-2">
              {modifiers.map(item => (
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
                          <span className={item.priceDelta < 0 ? 'text-red-400' : 'text-lime-400'}>
                            {item.priceDelta >= 0 ? '\u002b' : '\u002d'}
                            {'$'}
                            {Math.abs(item.priceDelta).toFixed(2)}
                          </span>
                          <span className="rounded bg-neutral-600 px-2 py-0.5 text-xs">
                            {item.type}
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
  item: Partial<ModifierOption>;
  onSave: (_: Partial<ModifierOption>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="flex w-full items-center gap-4">
      <input
        className="flex-1 rounded border border-neutral-600 bg-neutral-900 px-3 py-2"
        placeholder="Name (e.g. Extra Cheese)"
        value={formData.name || ''}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        className="w-32 rounded border border-neutral-600 bg-neutral-900 px-3 py-2"
        placeholder="Price (plus/minus)"
        type="number"
        step="0.10"
        value={formData.priceDelta || ''}
        onChange={e => setFormData({ ...formData, priceDelta: parseFloat(e.target.value) })}
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
