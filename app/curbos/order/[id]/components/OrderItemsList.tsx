import { OrderItem } from '../types';

export function OrderItemsList({ items }: { items: OrderItem[] }) {
    return (
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Your Items</h3>
            <div className="space-y-3">
                {items.map((item: OrderItem, idx: number) => (
                    <div key={idx} className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <span className="bg-neutral-800 w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-neutral-300">
                                {item.quantity}
                            </span>
                            <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                {item.modifiers && item.modifiers.length > 0 && (
                                    <p className="text-xs text-neutral-500 mt-1">
                                        {item.modifiers.join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
