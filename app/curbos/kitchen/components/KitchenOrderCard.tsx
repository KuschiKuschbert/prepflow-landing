import { logger } from '@/lib/logger';
import { Check, ChevronRight } from 'lucide-react';
import { OrderItem, OrderModifier, Transaction } from '../types';
import { Timer } from './Timer';

interface KitchenOrderCardProps {
    order: Transaction;
    onSelect: (order: Transaction) => void;
    onUpdateStatus: (id: string, status: string) => Promise<void>;
}

export function KitchenOrderCard({ order, onSelect, onUpdateStatus }: KitchenOrderCardProps) {
    function getTimerColor(timestamp: number) {
        const elapsedMinutes = (Date.now() - timestamp) / 60000;
        if (elapsedMinutes < 5) return 'text-[#C0FF02]';
        if (elapsedMinutes < 10) return 'text-orange-400';
        return 'text-red-500';
    }

    function getBorderColor(timestamp: number) {
        const elapsedMinutes = (Date.now() - timestamp) / 60000;
        if (elapsedMinutes < 5) return 'border-[#C0FF02]/30';
        if (elapsedMinutes < 10) return 'border-orange-400/30';
        return 'border-red-500/30';
    }

    function parseItems(itemsJson: string | OrderItem[] | null): OrderItem[] {
        if (!itemsJson) return [];
        try {
            const items = typeof itemsJson === 'string' ? (JSON.parse(itemsJson) as OrderItem[]) : itemsJson;
            return items.map((item: OrderItem) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity || 1,
                modifiers: item.modifiers || []
            }));
        } catch (e) {
            logger.error('Parse error:', {
                error: e instanceof Error ? e.message : String(e),
                stack: e instanceof Error ? e.stack : undefined,
            });
            return [];
        }
    }

    async function bumpOrder(e: React.MouseEvent) {
        e.stopPropagation();
        let nextStatus = 'IN_PROGRESS';
        if (order.fulfillment_status === 'IN_PROGRESS') nextStatus = 'READY';
        else if (order.fulfillment_status === 'READY') nextStatus = 'COMPLETED';

        await onUpdateStatus(order.id, nextStatus);
    }

    const items = parseItems(order.items_json);
    const timerColor = getTimerColor(order.timestamp);
    const borderColor = getBorderColor(order.timestamp);

    return (
        <div
            onClick={() => onSelect(order)}
            className={`bg-neutral-900 border-l-4 ${borderColor} rounded-xl shadow-2xl p-4 tablet:p-6 flex flex-col justify-between hover:bg-neutral-800/80 transition-all cursor-pointer ring-offset-2 ring-offset-black hover:ring-2 hover:ring-[#C0FF02]/50`}
        >
            <div>
                <div className="flex justify-between items-start mb-4">
                    <h2 className={`text-3xl tablet:text-4xl font-black ${timerColor}`}>
                        #{order.order_number || '??'}
                    </h2>
                    <div className={`flex items-center gap-1 font-mono font-bold text-sm tablet:text-base ${timerColor}`}>
                        <Timer timestamp={order.timestamp} />
                    </div>
                </div>

                {order.customer_name && (
                    <p className="text-white text-lg tablet:text-xl font-bold mb-4 uppercase tracking-wider">
                        {order.customer_name}
                    </p>
                )}

                <div className="space-y-4 mb-8">
                    {items.map((item: OrderItem, idx: number) => (
                        <div key={idx} className="border-b border-neutral-800 pb-2">
                            <div className="flex items-center gap-3">
                                <span className="bg-neutral-800 text-white w-8 h-8 rounded flex items-center justify-center font-bold">
                                    {item.quantity}
                                </span>
                                <span className="text-white text-base tablet:text-lg font-medium">{item.name}</span>
                            </div>
                            {item.modifiers && item.modifiers.length > 0 && (
                                    <div className="ml-11 mt-2 flex flex-col gap-1.5">
                                        {item.modifiers.map((mod: string | OrderModifier, midx: number) => (
                                            <div key={midx} className="text-[#C0FF02] text-sm font-bold uppercase bg-[#C0FF02]/10 border-l-2 border-[#C0FF02] pl-2 py-1">
                                                + {typeof mod === 'string' ? mod : mod.name || (mod as { name?: string }).name || String(mod)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <button
                    onClick={bumpOrder}
                    className={`w-full py-3 tablet:py-4 rounded-xl font-black text-base tablet:text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                        ${order.fulfillment_status === 'READY'
                            ? 'bg-red-500 text-white'
                            : order.fulfillment_status === 'IN_PROGRESS'
                                ? 'bg-orange-500 text-white'
                                : 'bg-[#C0FF02] text-black'
                        }`}
                >
                    {order.fulfillment_status === 'READY' ? (
                        <>FINISH & DELIVER <Check size={20}/></>
                    ) : order.fulfillment_status === 'IN_PROGRESS' ? (
                        <>MARK AS READY <ChevronRight size={20}/></>
                    ) : (
                        <>START COOKING <ChevronRight size={20}/></>
                    )}
                </button>

                {order.fulfillment_status !== 'READY' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(order.id, 'COMPLETED');
                        }}
                        className="w-full py-2 rounded-lg text-neutral-500 text-xs font-bold border border-neutral-800 hover:border-neutral-600 transition-colors uppercase"
                    >
                        Fast Complete ✅
                    </button>
                )}
            </div>

            <div className="mt-4 text-[10px] text-neutral-600 font-bold uppercase tracking-widest text-center">
                {order.fulfillment_status}
            </div>
        </div>
    );
}
