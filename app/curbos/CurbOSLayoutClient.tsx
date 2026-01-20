'use client'

import { NotificationProvider } from '@/contexts/NotificationContext'
import { ReleaseData } from '@/lib/github-release'
import { ArrowLeft, BarChart3, Cog, LogOut, Monitor, Settings, User, UtensilsCrossed } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { NavLink } from './components/NavLink'
import PulsatingConcentricTriangles from './components/PulsatingConcentricTriangles'
import RotatingTaco from './components/RotatingTaco'
import SpotlightCursor from './components/SpotlightCursor'
import TriangleGridBackground from './components/TriangleGridBackground'
import { useCurbOSAuth } from './hooks/useCurbOSAuth'
import { useCurbOSNavigation } from './hooks/useCurbOSNavigation'


interface CurbOSLayoutClientProps {
  children: React.ReactNode;
  releaseData: ReleaseData | null;
}

/**
 * Client-side wrapper for CurbOS layout.
 * Handles authentication checks and dynamic UI elements.
 */
export default function CurbOSLayoutClient({ children, releaseData }: CurbOSLayoutClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isChecking } = useCurbOSAuth()
  const { handleLogout } = useCurbOSNavigation()

  // Show loading state while checking authentication
  if (isChecking && pathname !== '/curbos/login') {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-white text-xl font-bold">Checking authentication...</div>
      </div>
    )
  }

  const tagName = releaseData?.tag_name || 'v0.2.3-experimental-dev';

  return (
    <NotificationProvider>
      <TriangleGridBackground />
      <PulsatingConcentricTriangles />
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-900/80 via-black/80 to-[#1a1a1a]/80 -z-10 header-animate-gradient pointer-events-none"></div>
      <RotatingTaco />
      <SpotlightCursor />

      {/* Premium Glass Header (Global) - Hide on public order status and quest pages */}
      {!pathname.startsWith('/curbos/order/') && !pathname.startsWith('/curbos/quests/') && (
        <header className="fixed top-4 left-4 right-4 h-16 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl z-50 flex items-center justify-between px-3 shadow-2xl shadow-black/50">
          <Link href="/curbos" className="flex items-center gap-2 group cursor-pointer flex-shrink-0 mr-2">
              <div className="relative h-10 w-10 transform group-hover:rotate-12 transition-transform duration-300 flex-shrink-0 min-h-[44px] min-w-[44px]">
                  <img src="/images/curbos-logo.png" alt="CurbOS Logo" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(192,255,2,0.5)]" />
              </div>
          </Link>

          <div className="relative flex-1 min-w-0 mx-auto">
            {/* Fade edges for scroll indication */}
            <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-6 bg-gradient-to-r from-neutral-900/80 to-transparent" />
            <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-6 bg-gradient-to-l from-neutral-900/80 to-transparent" />

            {/* Scrollable navigation */}
            <nav className="flex items-center justify-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5 overflow-x-auto flex-nowrap scrollbar-hide">
               <NavLink href="/curbos/stats" icon={<BarChart3 size={16} />} label="Stats" />
               <NavLink href="/curbos/customers" icon={<User size={16} />} label="Customers" />
               <NavLink href="/curbos/modifiers" icon={<Cog size={16} />} label="Modifiers" />
               <NavLink href="/curbos/kitchen" icon={<UtensilsCrossed size={16} />} label="Kitchen" />
               <NavLink href="/curbos/display" icon={<Monitor size={16} />} label="Display" />
               <NavLink href="/curbos/settings" icon={<Settings size={16} />} label="Settings" />
            </nav>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
             {/* Back to PrepFlow Button */}
             <Link
               href="/webapp"
               className="flex items-center gap-1.5 text-neutral-400 hover:text-[#C0FF02] transition-colors group px-2 py-1.5 min-h-[44px] rounded-lg hover:bg-white/5"
               aria-label="Back to PrepFlow"
             >
               <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
               <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 group-hover:text-[#C0FF02] transition-colors">
                 PrepFlow
               </span>
             </Link>

             <div className="h-6 w-px bg-white/10" />

             <button
                 onClick={handleLogout}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-red-400 transition-colors group px-2 py-1.5 min-h-[44px] rounded-lg hover:bg-white/5"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider group-hover:underline decoration-red-400/50 underline-offset-4">Logout</span>
              </button>
        </div>
      </header>
      )}

      <div className="relative z-10 pt-24 min-h-screen pointer-events-auto">
        {children}
      </div>
      <div className="fixed bottom-3 right-4 z-0 pointer-events-none select-none opacity-25 hover:opacity-100 transition-opacity duration-300">
        <Link href="/curbos" className="flex items-center gap-2 pointer-events-auto">
          <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">Powered by</span>
          <img src="/images/curbos-logo.png" alt="CurbOS" className="h-5 w-auto" />
        </Link>
      </div>
    </NotificationProvider>
  )
}
