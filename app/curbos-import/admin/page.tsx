/* eslint-disable no-console */
"use client";

import { Edit, Plus, Save, Trash, X } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import PageLayout from "./components/PageLayout";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
};

export default function Home() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem> | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  const fetchItems = async () => {
    const { data, error } = await supabase.from("menu_items").select("*").order('category');
    if (data) setItems(data);
    if (error) console.error("Error fetching items:", error);
  };
  /* eslint-enable react-hooks/exhaustive-deps */

  const handleSave = async (item: Partial<MenuItem>) => {
    if (!item.name || !item.price) return;

    if (item.id) {
      // Update
      const { error } = await supabase.from("menu_items").update({
        name: item.name,
        price: item.price,
        category: item.category || 'Tacos',
        isAvailable: true // item.isAvailable
      }).eq('id', item.id);
      if (error) console.error(error);
    } else {
      // Insert
      // Generate a random UUID locally or let DB handle it? DB default is likely fine if set, but android expects UUID string
      // Let's use crypto.randomUUID()
      const newItem = {
        id: crypto.randomUUID(),
        name: item.name,
        price: item.price,
        category: item.category || 'Tacos',
        isAvailable: true,
        imageUrl: null,
        taxRate: 0.1
      };
      const { error } = await supabase.from("menu_items").insert(newItem);
      if (error) console.error(error);
    }

    setEditingItem(null);
    setNewItem(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq('id', id);
    if (error) console.error(error);
    fetchItems();
  };

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-lime-400">CurbOS Admin</h1>
            <div className="space-x-4">
              <Link href="/modifiers" className="text-gray-300 hover:text-white">Manage Modifiers</Link>
            </div>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Menu Items</h2>
              <button
                onClick={() => setNewItem({ category: 'Tacos', price: 0 })}
                className="bg-lime-500 text-black px-4 py-2 rounded-md flex items-center gap-2 font-bold hover:bg-lime-400"
              >
                <Plus size={20} /> Add Item
              </button>
            </div>

            {newItem && (
              <div className="bg-neutral-700 p-4 rounded mb-4 animate-in fade-in slide-in-from-top-4">
                <ItemForm
                  item={newItem}
                  onSave={handleSave}
                  onCancel={() => setNewItem(null)}
                />
              </div>
            )}

            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="bg-neutral-700/50 p-4 rounded flex items-center justify-between">
                  {editingItem?.id === item.id ? (
                    <ItemForm
                      item={editingItem}
                      onSave={handleSave}
                      onCancel={() => setEditingItem(null)}
                    />
                  ) : (
                    <>
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <div className="text-sm text-gray-400 flex gap-4">
                          <span>${item.price.toFixed(2)}</span>
                          <span className="bg-neutral-600 px-2 rounded text-xs py-0.5">{item.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingItem(item)} className="p-2 hover:bg-neutral-600 rounded text-blue-400"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-neutral-600 rounded text-red-400"><Trash size={18} /></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function ItemForm({ item, onSave, onCancel }: { item: Partial<MenuItem>, onSave: (i: Partial<MenuItem>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="flex gap-4 items-center w-full">
      <input
        className="bg-neutral-900 border border-neutral-600 rounded px-3 py-2 flex-1"
        placeholder="Name"
        value={formData.name || ''}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        className="bg-neutral-900 border border-neutral-600 rounded px-3 py-2 w-24"
        placeholder="Price"
        type="number"
        value={formData.price || ''}
        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
      />
      <input
        className="bg-neutral-900 border border-neutral-600 rounded px-3 py-2 w-32"
        placeholder="Category"
        value={formData.category || ''}
        onChange={e => setFormData({ ...formData, category: e.target.value })}
      />
      <button onClick={() => onSave(formData)} className="text-lime-400 p-2"><Save size={20} /></button>
      <button onClick={onCancel} className="text-gray-400 p-2"><X size={20} /></button>
    </div>
  )
}
