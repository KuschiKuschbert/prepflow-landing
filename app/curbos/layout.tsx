'use client'

import { logger } from '@/lib/logger'
import { supabase } from '@/lib/supabase-pos'
import { BarChart3, Cog, LogOut, Monitor, RotateCw, Settings, UtensilsCrossed } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import '../globals.css'
import PulsatingConcentricTriangles from './components/PulsatingConcentricTriangles'
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

/**
 * Layout component for CurbOS admin console.
 * Enforces separate authentication independent of PrepFlow login.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Rendered layout with authentication check
 */
export default function CurbLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check authentication on mount and when pathname changes
    async function checkAuth() {
      // Skip check on login and unauthorized pages
      if (pathname === '/curbos/login' || pathname === '/curbos/unauthorized') {
        setIsChecking(false)
        return
      }

      try {
        // Check for Supabase session
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session) {
          // No Supabase session - check if user is PrepFlow admin (fallback for admins)
          try {
            const adminCheckResponse = await fetch('/api/admin/check')
            if (adminCheckResponse.ok) {
              const adminData = await adminCheckResponse.json()
              if (adminData.isAdmin) {
                logger.dev('CurbOS: Admin access granted via PrepFlow session (no Supabase session):', {
                  email: adminData.email,
                  pathname,
                })
                // Allow access - admin bypass
                setIsChecking(false)
                return
              } else {
                logger.warn('CurbOS: Not an admin and no Supabase session found', { email: adminData.email });
              }
            } else {
              logger.warn('CurbOS: Admin check API failed with status:', adminCheckResponse.status);
            }
          } catch (adminError) {
            logger.error('CurbOS: Error checking admin status:', {
              error: adminError instanceof Error ? adminError.message : String(adminError),
            })
          }

          // No valid session and not admin, redirect to login
          logger.warn('CurbOS: No valid session, redirecting to login', {
            error: error?.message,
            pathname,
          })
          router.push('/curbos/login')
          return
        }

        // Valid session - check tier access (Business tier required)
        const userEmail = session.user?.email
        if (userEmail) {
          const hasAccess = await checkCurbOSAccess(userEmail)
          if (!hasAccess) {
            // Check if user is PrepFlow admin (fallback for admins)
            try {
              const adminCheckResponse = await fetch('/api/admin/check')
              if (adminCheckResponse.ok) {
                const adminData = await adminCheckResponse.json()
                if (adminData.isAdmin) {
                  logger.dev('CurbOS: Admin access granted via PrepFlow session:', {
                    email: adminData.email,
                    pathname,
                  })
                  // Allow access - admin bypass
                  setIsChecking(false)
                  return
                }
              }
            } catch (error) {
              logger.warn('CurbOS: Error checking admin status:', {
                error: error instanceof Error ? error.message : String(error),
              })
            }

            logger.warn('CurbOS: Access denied - Business tier required', {
              userEmail,
              pathname,
            })
            router.push('/curbos/unauthorized')
            return
          }
        } else {
          // No email in session - check if user is PrepFlow admin (fallback)
          try {
            const adminCheckResponse = await fetch('/api/admin/check')
            if (adminCheckResponse.ok) {
              const adminData = await adminCheckResponse.json()
              if (adminData.isAdmin) {
                logger.dev('CurbOS: Admin access granted via PrepFlow session (no CurbOS email):', {
                  email: adminData.email,
                  pathname,
                })
                // Allow access - admin bypass
                setIsChecking(false)
                return
              }
            }
          } catch (error) {
            logger.warn('CurbOS: Error checking admin status:', {
              error: error instanceof Error ? error.message : String(error),
            })
          }

          // No email in session - deny access
          logger.warn('CurbOS: No email found in session', {
            pathname,
          })
          router.push('/curbos/unauthorized')
          return
        }

        // Valid session and tier access, allow access
        setIsChecking(false)
      } catch (error) {
        // Error checking session or tier, redirect to login
        logger.error('CurbOS: Error checking session or tier', {
          error: error instanceof Error ? error.message : String(error),
          pathname,
        })
        router.push('/curbos/login')
      }
    }

    // Helper function to check CurbOS access via CurbOS-specific API endpoint
    async function checkCurbOSAccess(userEmail: string): Promise<boolean> {
      try {
        // Normalize email for consistency
        const normalizedEmail = userEmail.toLowerCase().trim();

        // Use the CurbOS-specific API endpoint that accepts email parameter
        // This endpoint doesn't require Auth0 (CurbOS uses Supabase auth)
        const response = await fetch(`/api/curbos/check-access?email=${encodeURIComponent(normalizedEmail)}`)
        if (response.ok) {
          const data = await response.json()
          logger.dev('CurbOS: Access check result:', {
            userEmail: normalizedEmail,
            allowed: data.allowed,
            reason: data.reason,
          })
          return data.allowed || false
        } else {
          const errorData = await response.json().catch(() => ({}))
          logger.warn('CurbOS: Access check failed:', {
            userEmail: normalizedEmail,
            status: response.status,
            error: errorData.error || errorData.message,
          })
        }
      } catch (error) {
        logger.error('CurbOS: Error checking access:', {
          error: error instanceof Error ? error.message : String(error),
          userEmail,
        })
      }
      return false
    }

    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Show loading state while checking authentication
  if (isChecking && pathname !== '/curbos/login') {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-white text-xl font-bold">Checking authentication...</div>
      </div>
    )
  }

  return (
    <>
      <TriangleGridBackground />
      <PulsatingConcentricTriangles />
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-900/80 via-black/80 to-[#1a1a1a]/80 -z-10 header-animate-gradient pointer-events-none"></div>
      <RotatingTaco />
      <SpotlightCursor />

      {/* Premium Glass Header (Global) */}
      <header className="fixed top-4 left-4 right-4 tablet:top-6 tablet:left-6 tablet:right-6 h-16 tablet:h-20 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl z-50 flex items-center justify-between px-4 tablet:px-6 desktop:px-8 shadow-2xl shadow-black/50">
        <Link href="/curbos" className="flex items-center gap-2 tablet:gap-4 group cursor-pointer">
            <div className="bg-[#C0FF02] p-1.5 tablet:p-2 rounded-lg text-black transform group-hover:rotate-12 transition-transform duration-300">
                <UtensilsCrossed size={20} className="tablet:w-6 tablet:h-6" />
            </div>
            <div>
                <h1 className="text-xl tablet:text-2xl font-black tracking-tight text-white leading-none">CURB<span className="text-[#C0FF02]">OS</span></h1>
                <div className="flex flex-col">
                  <p className="text-[8px] tablet:text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase">Admin Console</p>
                  <p className="text-[7px] font-black text-[#C0FF02]/40 tracking-widest uppercase">v0.2.0-experimental-dev</p>
                </div>
            </div>
        </Link>

        <nav className="flex items-center gap-0.5 tablet:gap-1 bg-black/20 p-1 tablet:p-1.5 rounded-xl border border-white/5">
             <NavLink href="/curbos/stats" icon={<BarChart3 size={16} />} label="Stats" />
             <NavLink href="/curbos/modifiers" icon={<Cog size={16} />} label="Modifiers" />
             <div className="w-px h-4 bg-white/10 mx-0.5 tablet:mx-1"></div>
             <NavLink href="/curbos/kitchen" icon={<UtensilsCrossed size={16} />} label="Kitchen" />
             <NavLink href="/curbos/display" icon={<Monitor size={16} />} label="Display" />
             <NavLink href="/curbos/settings" icon={<Settings size={16} />} label="Settings" />
        </nav>

        <div className="flex items-center gap-2 tablet:gap-4 desktop:gap-6">
             {/* Seed Data (Subtle) */}
             <form action={seedInitialData}>
                <button className="flex items-center gap-1 tablet:gap-2 text-[8px] tablet:text-[10px] text-neutral-600 hover:text-[#C0FF02] uppercase tracking-widest transition-colors font-bold border border-white/5 hover:border-[#C0FF02]/30 px-2 tablet:px-3 py-1 tablet:py-1.5 rounded-lg group">
                    <RotateCw size={14} className="tablet:w-4 tablet:h-4 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="hidden tablet:inline">Restore Defaults</span>
                </button>
             </form>

             <div className="h-6 tablet:h-8 w-px bg-white/10" />

             <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  // Clear the cookie as well
                  document.cookie = "curbos_auth=; path=/; max-age=0"
                  router.push('/curbos/login')
                  router.refresh()
                }}
                className="flex items-center gap-1 tablet:gap-2 text-neutral-400 hover:text-red-400 transition-colors group px-1 tablet:px-2 py-1"
              >
                <LogOut size={16} className="tablet:w-4 tablet:h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden tablet:inline text-xs font-bold uppercase tracking-wider group-hover:underline decoration-red-400/50 underline-offset-4">Logout</span>
              </button>
        </div>
      </header>

      <div className="relative z-10 pt-24 tablet:pt-32 min-h-screen">
        {children}
      </div>
    </>
  )
}
