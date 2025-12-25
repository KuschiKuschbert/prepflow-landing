import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'
import { FaChartBar, FaCogs, FaRedo, FaSignOutAlt, FaTv, FaUtensils } from 'react-icons/fa'
import '../globals.css'
import { logout } from './actions'
import RotatingTaco from './components/RotatingTaco'
import SpotlightCursor from './components/SpotlightCursor'
import TriangleGridBackground from './components/TriangleGridBackground'
import { seedInitialData } from './seed-actions'

// Helper for Navigation Links
function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
        href={href}
        className="flex items-center gap-2 px-2 tablet:px-4 py-2 rounded-lg text-sm font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all hover:scale-105 active:scale-95 group"
        title={label}
    >
        <span className="text-neutral-500 group-hover:text-[#C0FF02] transition-colors">{icon}</span>
        <span className="hidden tablet:inline">{label}</span>
    </Link>
  )
}

export default function NachoTacoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TriangleGridBackground />
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-900/80 via-black/80 to-[#1a1a1a]/80 -z-10 header-animate-gradient pointer-events-none"></div>
      <RotatingTaco />
      <SpotlightCursor />

      {/* Premium Glass Header (Global) */}
      <header className="fixed top-4 left-4 right-4 tablet:top-6 tablet:left-6 tablet:right-6 h-16 tablet:h-20 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl z-50 flex items-center justify-between px-4 tablet:px-6 desktop:px-8 shadow-2xl shadow-black/50">
        <Link href="/nachotaco" className="flex items-center gap-2 tablet:gap-4 group cursor-pointer">
            <div className="bg-[#C0FF02] p-1.5 tablet:p-2 rounded-lg text-black transform group-hover:rotate-12 transition-transform duration-300">
                <UtensilsCrossed size={20} className="tablet:w-6 tablet:h-6" />
            </div>
            <div>
                <h1 className="text-xl tablet:text-2xl font-black tracking-tight text-white leading-none">NACHO <span className="text-[#C0FF02]">TACOS</span></h1>
                <p className="text-[8px] tablet:text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase">Admin Console</p>
            </div>
        </Link>

        <nav className="flex items-center gap-0.5 tablet:gap-1 bg-black/20 p-1 tablet:p-1.5 rounded-xl border border-white/5">
             <NavLink href="/nachotaco/stats" icon={<FaChartBar size={16} />} label="Stats" />
             <NavLink href="/nachotaco/modifiers" icon={<FaCogs size={16} />} label="Modifiers" />
             <div className="w-px h-4 bg-white/10 mx-0.5 tablet:mx-1"></div>
             <NavLink href="/nachotaco/kitchen" icon={<FaUtensils size={16} />} label="Kitchen" />
             <NavLink href="/nachotaco/display" icon={<FaTv size={16} />} label="Display" />
        </nav>

        <div className="flex items-center gap-2 tablet:gap-4 desktop:gap-6">
             {/* Seed Data (Subtle) */}
             <form action={seedInitialData}>
                <button className="flex items-center gap-1 tablet:gap-2 text-[8px] tablet:text-[10px] text-neutral-600 hover:text-[#C0FF02] uppercase tracking-widest transition-colors font-bold border border-white/5 hover:border-[#C0FF02]/30 px-2 tablet:px-3 py-1 tablet:py-1.5 rounded-lg group">
                    <FaRedo className="group-hover:rotate-180 transition-transform duration-500" />
                    <span className="hidden tablet:inline">Restore Defaults</span>
                </button>
             </form>

             <div className="h-6 tablet:h-8 w-px bg-white/10" />

             <form action={logout}>
                <button className="flex items-center gap-1 tablet:gap-2 text-neutral-400 hover:text-red-400 transition-colors group px-1 tablet:px-2 py-1">
                    <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden tablet:inline text-xs font-bold uppercase tracking-wider group-hover:underline decoration-red-400/50 underline-offset-4">Logout</span>
                </button>
             </form>
        </div>
      </header>

      <div className="relative z-10 pt-24 tablet:pt-32 min-h-screen">
        {children}
      </div>
    </>
  )
}
