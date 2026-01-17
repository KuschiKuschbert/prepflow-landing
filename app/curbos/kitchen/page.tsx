'use client'

import { logger } from '@/lib/logger'
import { supabase } from '@/lib/supabase-pos'
import { Check, ChefHat, ChevronRight, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

// types based on Android model
interface OrderModifier {
  name: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  modifiers: (string | OrderModifier)[];
}

interface Transaction {
    id: string
    timestamp: number
    order_number: number | null
    customer_name: string | null
    fulfillment_status: string
    items_json: string | OrderItem[] | null // Can be string or JSON object depending on how Postgrest returns JSONB
}

/**
 * Kitchen Display System (KDS) page.
 * Displays real-time orders and allows kitchen staff to update status.
 */
export default function KitchenKDS() {
    const [orders, setOrders] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Transaction | null>(null)

    async function fetchOrders() {
        // We need to fetch the results from the 'transactions' table
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .neq('fulfillment_status', 'COMPLETED')
            .order('timestamp', { ascending: true })

        if (error) {
            logger.error('Error fetching kitchen orders:', error)
        } else {
            setOrders(data || [])
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchOrders()

        // Subscribe to changes
        const channel = supabase.channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'transactions',
                },
                (payload) => {
                    logger.dev('KDS: Change received!', payload)
                    fetchOrders()
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    logger.dev('KDS: Realtime subscription active!')
                } else if (status === 'CLOSED') {
                    logger.dev('KDS: Realtime subscription closed')
                } else if (status === 'CHANNEL_ERROR') {
                    logger.error('KDS: Realtime subscription error')
                }
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    async function updateStatus(id: string, status: string) {
        try {
            const response = await fetch('/api/kds/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, status }),
            })

            if (!response.ok) {
                const data = await response.json()
                logger.error('Error updating status:', data.error || 'Unknown error')
                // Revert optimistic update if we implemented one,
                // but for now relying on realtime subscription to update UI
                // is fine, though fetching again immediately might be safer if realtime is laggy.
                // fetchOrders() // Optional: force refresh
            }
        } catch (e) {
            logger.error('Network error updating status:', e)
        }
    }

    async function bumpOrder(order: Transaction, e: React.MouseEvent) {
        e.stopPropagation(); // Prevent opening modal
        let nextStatus = 'IN_PROGRESS'
        if (order.fulfillment_status === 'IN_PROGRESS') nextStatus = 'READY'
        else if (order.fulfillment_status === 'READY') nextStatus = 'COMPLETED'

        await updateStatus(order.id, nextStatus)
    }

    function getTimerColor(timestamp: number) {
        const elapsedMinutes = (Date.now() - timestamp) / 60000
        if (elapsedMinutes < 5) return 'text-[#C0FF02]'
        if (elapsedMinutes < 10) return 'text-orange-400'
        return 'text-red-500'
    }

    function getBorderColor(timestamp: number) {
        const elapsedMinutes = (Date.now() - timestamp) / 60000
        if (elapsedMinutes < 5) return 'border-[#C0FF02]/30'
        if (elapsedMinutes < 10) return 'border-orange-400/30'
        return 'border-red-500/30'
    }

    function parseItems(itemsJson: string | OrderItem[] | null): OrderItem[] {
        if (!itemsJson) return []
        try {
            // it can be already parsed by supabase-js if it's a JSONB column
            const items = typeof itemsJson === 'string' ? (JSON.parse(itemsJson) as OrderItem[]) : itemsJson
            return items.map((item: OrderItem) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity || 1,
                modifiers: item.modifiers || [] // These are now a list of strings in the new model
            }))
        } catch (e) {
            logger.error('Parse error:', {
                error: e instanceof Error ? e.message : String(e),
                stack: e instanceof Error ? e.stack : undefined,
            });
            return []
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C0FF02]"></div>
            </div>
        )
    }

    return (
        <div className="p-4 tablet:p-6 font-sans">
            <div className="flex flex-col tablet:flex-row tablet:justify-between tablet:items-center gap-4 tablet:gap-0 mb-8 tablet:mb-12">
                <div>
                     <h2 className="text-2xl tablet:text-3xl desktop:text-4xl font-bold text-white mb-2">Kitchen Display</h2>
                     <p className="text-neutral-400 text-sm tablet:text-base flex items-center gap-2">
                        <Clock size={14} /> Realtime Orders
                     </p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="h-[60vh] flex flex-col items-center justify-center text-neutral-600 gap-4">
                    <ChefHat size={64} className="text-[#C0FF02]" />
                    <p className="text-xl font-medium tracking-wide">NO ACTIVE ORDERS</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 tablet:grid-cols-3 desktop:grid-cols-4 large-desktop:grid-cols-5 gap-4 tablet:gap-6">
                    {orders.map((order) => {
                        const items = parseItems(order.items_json)
                        const timerColor = getTimerColor(order.timestamp)
                        const borderColor = getBorderColor(order.timestamp)

                        return (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
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
                                        onClick={(e) => bumpOrder(order, e)}
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
                                                updateStatus(order.id, 'COMPLETED');
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
                        )
                    })}
                </div>
            )}

            {/* Order Detail Modal with QR Code */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                     onClick={() => setSelectedOrder(null)}>
                    <div className="bg-neutral-900 rounded-2xl p-8 max-w-lg w-full border border-neutral-800 shadow-2xl space-y-8"
                         onClick={(e) => e.stopPropagation()}>

                        <div className="text-center">
                             <h2 className="text-4xl font-black text-white mb-2">Order #{selectedOrder.order_number}</h2>
                             {selectedOrder.customer_name && (
                                <p className="text-xl text-neutral-400">{selectedOrder.customer_name}</p>
                             )}
                        </div>

                        <div className="bg-white p-6 rounded-xl mx-auto w-fit">
                            <QRCode
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/curbos/order/${selectedOrder.id}`}
                                size={256}
                            />
                        </div>

                        <div className="text-center space-y-2">
                             <p className="text-sm font-bold text-[#C0FF02] uppercase tracking-widest">
                                Status: {selectedOrder.fulfillment_status}
                             </p>
                             <p className="text-neutral-500 text-xs">Scan to track order on mobile</p>
                        </div>

                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <footer className="mt-12 text-center">
                <Link href="/curbos" className="text-neutral-700 hover:text-white text-xs font-bold transition-colors">
                    BACK TO ADMIN PANEL
                </Link>
            </footer>
        </div>
    )
}

import QRCode from 'react-qr-code'

function Timer({ timestamp }: { timestamp: number }) {
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - timestamp) / 60000))
        }, 10000)

        setElapsed(Math.floor((Date.now() - timestamp) / 60000))
        return () => clearInterval(interval)
    }, [timestamp])

    return <span>{elapsed}M</span>
}

import Link from 'next/link'
