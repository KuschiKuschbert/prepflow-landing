/* eslint-disable no-console */
"use client";

import { ArrowLeft, Edit, Plus, Save, Trash, X } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import PageLayout from "../components/PageLayout";

type ModifierOption = {
    id: string;
    name: string;
    priceDelta: number;
    type: string;
    isAvailable: boolean;
};

export default function ModifiersPage() {
    const [modifiers, setModifiers] = useState<ModifierOption[]>([]);
    const [editingItem, setEditingItem] = useState<ModifierOption | null>(null);
    const [newItem, setNewItem] = useState<Partial<ModifierOption> | null>(null);

    const fetchItems = async () => {
        const { data, error } = await supabase.from("modifier_options").select("*").order('name');
        if (data) setModifiers(data);
        if (error) console.error("Error fetching modifiers:", error);
    };

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async (item: Partial<ModifierOption>) => {
        if (!item.name) return;
        // Auto-detect type based on price
        const type = (item.priceDelta || 0) < 0 ? 'REMOVAL' : 'ADDON';

        if (item.id) {
            // Update
            const { error } = await supabase.from("modifier_options").update({
                name: item.name,
                priceDelta: item.priceDelta || 0,
                type: type
            }).eq('id', item.id);
            if (error) console.error(error);
        } else {
            // Insert
            const newItem = {
                id: crypto.randomUUID(),
                name: item.name,
                priceDelta: item.priceDelta || 0,
                type: type,
                isAvailable: true
            };
            const { error } = await supabase.from("modifier_options").insert(newItem);
            if (error) console.error(error);
        }

        setEditingItem(null);
        setNewItem(null);
        fetchItems();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this modifier?")) return;
        const { error } = await supabase.from("modifier_options").delete().eq('id', id);
        if (error) console.error(error);
        fetchItems();
    };

    return (
        <PageLayout>
            <div className="p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="p-2 hover:bg-neutral-800 rounded-full"><ArrowLeft /></Link>
                            <h1 className="text-3xl font-bold text-lime-400">Modifiers</h1>
                        </div>
                    </div>

                    <div className="bg-neutral-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Available Modifiers</h2>
                            <button
                                onClick={() => setNewItem({ priceDelta: 0 })}
                                className="bg-lime-500 text-black px-4 py-2 rounded-md flex items-center gap-2 font-bold hover:bg-lime-400"
                            >
                                <Plus size={20} /> Add Modifier
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
                            {modifiers.map(item => (
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
                                                    <span className={item.priceDelta < 0 ? "text-red-400" : "text-lime-400"}>
                                                        {item.priceDelta >= 0 ? '+' : ''}${item.priceDelta.toFixed(2)}
                                                    </span>
                                                    <span className="bg-neutral-600 px-2 rounded text-xs py-0.5">{item.type}</span>
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

function ItemForm({ item, onSave, onCancel }: { item: Partial<ModifierOption>, onSave: (i: Partial<ModifierOption>) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState(item);

    return (
        <div className="flex gap-4 items-center w-full">
            <input
                className="bg-neutral-900 border border-neutral-600 rounded px-3 py-2 flex-1"
                placeholder="Name (e.g. Extra Cheese)"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <input
                className="bg-neutral-900 border border-neutral-600 rounded px-3 py-2 w-32"
                placeholder="Price (+/-)"
                type="number"
                step="0.10"
                value={formData.priceDelta || ''}
                onChange={e => setFormData({ ...formData, priceDelta: parseFloat(e.target.value) })}
            />
            <button onClick={() => onSave(formData)} className="text-lime-400 p-2"><Save size={20} /></button>
            <button onClick={onCancel} className="text-gray-400 p-2"><X size={20} /></button>
        </div>
    )
}
