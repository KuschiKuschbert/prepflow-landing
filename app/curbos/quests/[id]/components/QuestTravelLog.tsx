import { Transaction } from '../types';

interface QuestTravelLogProps {
    recentOrders: Transaction[];
}

export function QuestTravelLog({ recentOrders }: QuestTravelLogProps) {
    return (
        <div className="max-w-2xl mx-auto">
            <h3 className="text-[#ccff00] font-bold text-center uppercase tracking-widest mb-6 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-[#ccff00]/50"></span>
                Travel Log
                <span className="h-px w-10 bg-[#ccff00]/50"></span>
            </h3>

            <div className="bg-neutral-900/80 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden font-mono text-sm">
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b border-white/10 bg-black/40 text-neutral-500 text-xs font-bold uppercase">
                    <div>Date</div>
                    <div>Description</div>
                    <div className="text-right">Visa Status</div>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500 italic">No travel history recorded.</div>
                ) : (
                    recentOrders.map((order) => {
                        let itemCount = 0;
                         try {
                             itemCount = JSON.parse(order.items_json).length;
                         } catch (e) {
                             // ignore
                         }
                        return (
                            <a href={`/curbos/order/${order.id}`} key={order.id} className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <div className="text-neutral-400">{new Date(order.created_at).toLocaleDateString()}</div>
                                <div className="text-white">
                                    <span className="font-bold text-[#ccff00] group-hover:underline">ORDER #{order.order_number}</span>
                                    <span className="block text-xs text-neutral-500">{itemCount} Items • ${order.total_amount.toFixed(2)}</span>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                        order.fulfillment_status === 'COMPLETED' ? 'bg-neutral-800 text-neutral-400' :
                                        order.fulfillment_status === 'READY' ? 'bg-[#ccff00] text-black animate-pulse' :
                                        'bg-orange-500/20 text-orange-500'
                                    }`}>
                                        {order.fulfillment_status}
                                    </span>
                                </div>
                            </a>
                        )
                    })
                )}

                <div className="p-2 bg-black/20 text-center text-[10px] text-neutral-600">
                    END OF ENTRIES
                </div>
            </div>
        </div>
    );
}
