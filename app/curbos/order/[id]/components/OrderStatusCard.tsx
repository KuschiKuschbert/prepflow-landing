import { Check, ChefHat, Clock, Trophy } from 'lucide-react';
import { OrderStatus } from '../types';

export function OrderStatusCard({ order }: { order: OrderStatus }) {
  const isCooking = order.fulfillment_status === 'IN_PROGRESS' || order.fulfillment_status === 'PENDING';
  const isReady = order.fulfillment_status === 'READY';
  const isCompleted = order.fulfillment_status === 'COMPLETED';

  let statusColor = 'text-neutral-400';
  let statusBg = 'bg-neutral-900';
  let statusBorder = 'border-neutral-800';
  let statusMessage = 'Order Received';
  let StatusIcon = Clock;

  if (isCooking) {
      statusColor = 'text-orange-500';
      statusBg = 'bg-orange-500/10';
      statusBorder = 'border-orange-500/20';
      statusMessage = 'Cooking Now...';
      StatusIcon = ChefHat;
  } else if (isReady) {
      statusColor = 'text-[#ccff00]';
      statusBg = 'bg-[#ccff00]/10';
      statusBorder = 'border-[#ccff00]/20';
      statusMessage = 'READY FOR PICKUP!';
      StatusIcon = Check;
  } else if (isCompleted) {
      statusColor = 'text-white';
      statusBg = 'bg-neutral-900';
      statusBorder = 'border-neutral-800';
      statusMessage = 'Order Completed';
      StatusIcon = Check;
  }

  return (
    <div className={`rounded-2xl border-2 p-8 text-center transition-all duration-500 ${statusBg} ${statusBorder}`}>
        <div className={`inline-flex p-4 rounded-full mb-6 ${statusColor} bg-black/20`}>
            <StatusIcon size={48} className={isCooking ? "animate-pulse" : ""} />
        </div>

        <h2 className={`text-3xl font-black uppercase mb-2 ${statusColor}`}>
            {statusMessage}
        </h2>

        {isReady && (
            <div className="mt-4 px-4 py-2 bg-[#ccff00] text-black font-bold rounded-lg animate-bounce">
                PLEASE COLLECT YOUR ORDER
            </div>
        )}

         <div className="mt-6 pt-6 border-t border-neutral-800/50">
            <p className="text-neutral-400 text-sm uppercase tracking-wider mb-1">Order Number</p>
            <p className="text-5xl font-black text-white">#{order.order_number}</p>
             {order.customer_name && (
                <p className="text-lg font-medium text-white mt-2">{order.customer_name}</p>
            )}

            {order.customer_id && (
                 <a href={`/curbos/quests/${order.customer_id}`} className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-[#ccff00] text-sm font-bold rounded-lg transition-colors">
                     <Trophy size={16} /> View My Passport
                 </a>
            )}
        </div>
    </div>
  );
}
