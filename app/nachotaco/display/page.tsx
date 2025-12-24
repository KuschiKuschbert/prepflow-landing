'use client'

import { logger } from '@/lib/logger'
import { supabase } from '@/lib/supabase-pos'
import { useEffect, useState } from 'react'

interface Transaction {
    id: string
    timestamp: number
    order_number: number | null
    customer_name: string | null
    fulfillment_status: string
}

export default function CustomerDisplay() {
    const [orders, setOrders] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)

    async function fetchOrders() {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('id, timestamp, order_number, customer_name, fulfillment_status')
                .neq('fulfillment_status', 'COMPLETED')
                .order('timestamp', { ascending: true })

            if (error) {
                logger.error('Error fetching display orders:', error)
            } else {
                setOrders(data || [])
            }
        } catch (err) {
            logger.error('Error fetching display orders:', err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()

        const channel = supabase.channel('customer-display-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'transactions',
                },
                () => {
                    fetchOrders()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const preparing = orders.filter(o => o.fulfillment_status === 'PENDING' || o.fulfillment_status === 'IN_PROGRESS')
    const ready = orders.filter(o => o.fulfillment_status === 'READY')

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C0FF02]"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black font-sans flex text-white overflow-hidden">
            {/* LEFT COLUMN: PREPARING */}
            <div className="w-1/2 border-r-2 border-neutral-800 p-8 flex flex-col">
                <h1 className="text-4xl font-bold text-center mb-12 uppercase tracking-widest text-neutral-400">
                    Preparing 👨‍🍳
                </h1>

                <div className="flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar">
                    {preparing.length === 0 ? (
                        <div className="text-center text-neutral-700 text-xl font-medium mt-20">
                            No orders in queue
                        </div>
                    ) : (
                        preparing.map(order => (
                            <div key={order.id} className="bg-neutral-900 rounded-xl p-8 flex items-center justify-between border border-neutral-800">
                                <span className="text-5xl font-black text-neutral-500">#{order.order_number}</span>
                                {order.customer_name && (
                                    <span className="text-3xl font-bold text-neutral-300 uppercase">{order.customer_name}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: READY */}
            <div className="w-1/2 p-8 flex flex-col bg-[#111]">
                <h1 className="text-4xl font-black text-center mb-12 uppercase tracking-widest text-[#C0FF02] animate-pulse">
                    Ready to Pickup 🔔
                </h1>

                <div className="flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar">
                    {ready.length === 0 ? (
                       <div className="text-center text-neutral-700 text-xl font-medium mt-20">
                            No orders ready yet
                        </div>
                    ) : (
                        ready.map(order => (
                            <div key={order.id} className="bg-[#C0FF02] rounded-xl p-10 flex items-center justify-between shadow-[0_0_50px_rgba(192,255,2,0.2)]">
                                <span className="text-6xl font-black text-black">#{order.order_number}</span>
                                {order.customer_name && (
                                    <span className="text-4xl font-black text-black uppercase">{order.customer_name}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
