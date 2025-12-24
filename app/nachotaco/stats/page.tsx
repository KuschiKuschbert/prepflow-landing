'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-pos'
import { ArrowLeft, TrendingUp, DollarSign, Calendar } from 'lucide-react'
import Link from 'next/link'
import { logger } from '@/lib/logger'

export default function StatsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchTransactions() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) {
        logger.error('Error fetching transactions:', { error: error.message, context: { endpoint: '/nachotaco/stats' } })
      } else {
        setTransactions(data || [])
      }
    } catch (err) {
      logger.error('Unexpected error fetching transactions:', { error: err instanceof Error ? err.message : String(err), context: { endpoint: '/nachotaco/stats' } })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // Calculate Metrics
  const totalSales = transactions.reduce((acc, t) => acc + t.total_amount, 0)
  const totalOrders = transactions.length

  // Today's Sales
  const today = new Date().toDateString()
  const todaySales = transactions
    .filter(t => new Date(t.timestamp).toDateString() === today)
    .reduce((acc, t) => acc + t.total_amount, 0)

  const todayOrders = transactions
     .filter(t => new Date(t.timestamp).toDateString() === today)
     .length

  // Top Items (Parsing JSON - basic implementation)
  const itemCounts: Record<string, number> = {}
  transactions.forEach(t => {
    try {
        const items = JSON.parse(t.items_json)
        items.forEach((i: any) => {
            itemCounts[i.name] = (itemCounts[i.name] || 0) + (i.quantity || 1)
        })
    } catch (e) {}
  })

  const topItems = Object.entries(itemCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans">
       <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-4">
             <Link href="/nachotaco" className="text-neutral-400 hover:text-white transition-colors">
                <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[#C0FF02]">Sales Analytics</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Total Revenue" value={`$${totalSales.toFixed(2)}`} icon={<DollarSign size={24} />} delay={0} />
            <MetricCard title="Total Orders" value={totalOrders.toString()} icon={<TrendingUp size={24} />} delay={1} />
            <MetricCard title="Today's Revenue" value={`$${todaySales.toFixed(2)}`} icon={<DollarSign size={24} />} highlight delay={2} />
             <MetricCard title="Today's Orders" value={todayOrders.toString()} icon={<Calendar size={24} />} delay={3} />
        </div>

        {/* Recent Transactions & Top Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><TrendingUp className="text-[#C0FF02]"/> Recent Activity</h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? <p className="text-neutral-500">Loading...</p> : transactions.map(t => (
                        <div key={t.id} className="flex justify-between items-center py-3 border-b border-neutral-700 last:border-0">
                            <div>
                                <p className="font-bold text-white mb-1">Order #{t.id.slice(0,4)}</p>
                                <p className="text-xs text-neutral-400">{new Date(t.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-[#C0FF02]">${t.total_amount.toFixed(2)}</p>
                                <p className="text-xs text-neutral-500">{t.payment_method}</p>
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && !loading && <p className="text-neutral-500">No transactions found.</p>}
                </div>
            </div>

            <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700">
                <h2 className="text-xl font-bold text-white mb-6">Top Selling Items</h2>
                <div className="space-y-4">
                     {loading ? <p className="text-neutral-500">Loading...</p> : topItems.map(([name, count], idx) => (
                        <div key={name} className="flex items-center gap-4">
                            <span className="font-bold text-neutral-500 w-6">#{idx + 1}</span>
                            <div className="flex-1 bg-neutral-700 h-10 rounded-lg relative overflow-hidden flex items-center px-4">
                                <div
                                    className="absolute inset-0 bg-[#C0FF02]/20"
                                    style={{ width: `${(count / topItems[0][1]) * 100}%` }}
                                ></div>
                                <span className="relative z-10 font-medium text-white">{name}</span>
                            </div>
                            <span className="font-bold text-[#C0FF02]">{count}</span>
                        </div>
                     ))}
                      {topItems.length === 0 && !loading && <p className="text-neutral-500">No sales data yet.</p>}
                </div>
            </div>
        </div>
      </main>
    </div>
  )
}

function MetricCard({ title, value, icon, highlight = false, delay }: any) {
    return (
        <div
            className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 hover:border-[#C0FF02] transition-all transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
            style={{ animationDelay: `${delay * 100}ms` }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${highlight ? 'bg-[#C0FF02] text-black' : 'bg-neutral-700 text-neutral-400'}`}>
                    {icon}
                </div>
                {highlight && <span className="px-2 py-1 bg-[#C0FF02]/20 text-[#C0FF02] text-xs font-bold rounded uppercase">Trending</span>}
            </div>
            <p className="text-neutral-400 text-sm mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
    )
}
