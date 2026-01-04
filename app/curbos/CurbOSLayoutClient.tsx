'use client'

import { NotificationProvider } from '@/contexts/NotificationContext'
import { ReleaseData } from '@/lib/github-release'
import { logger } from '@/lib/logger'
import { supabase } from '@/lib/supabase-pos'
import { ArrowLeft, BarChart3, Cog, LogOut, Monitor, Settings, User, UtensilsCrossed } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NavLink } from './components/NavLink'
import PulsatingConcentricTriangles from './components/PulsatingConcentricTriangles'
import RotatingTaco from './components/RotatingTaco'
import SpotlightCursor from './components/SpotlightCursor'
import TriangleGridBackground from './components/TriangleGridBackground'

/**
 * Safely extract error message from unknown error type
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Unknown error'
}

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
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check authentication on mount and when pathname changes
    async function checkAuth() {
      // Skip check on login, unauthorized, and public order pages
      if (
        pathname === '/curbos/login' ||
        pathname === '/curbos/unauthorized' ||
        pathname.startsWith('/curbos/order/') ||
        pathname.startsWith('/curbos/quests/')
      ) {
        setIsChecking(false)
        return
      }

      // TEMP: Bypass auth for debugging
      setIsChecking(false)
      return
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
          } catch (adminError: unknown) {
            logger.error('CurbOS: Error checking admin status:', {
              error: getErrorMessage(adminError),
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
        // At this point, TypeScript knows session is not null due to the early return above
        const userEmail = session!.user?.email
        if (userEmail) {
          // TypeScript should narrow userEmail to string here, but if not, use explicit assertion
          const hasAccess = await checkCurbOSAccess(userEmail as string)
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
            } catch (error: unknown) {
              logger.warn('CurbOS: Error checking admin status:', {
                error: getErrorMessage(error),
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
          } catch (error: unknown) {
            logger.warn('CurbOS: Error checking admin status:', {
              error: getErrorMessage(error),
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
      } catch (error: unknown) {
        // Error checking session or tier, redirect to login
        logger.error('CurbOS: Error checking session or tier', {
          error: getErrorMessage(error),
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
      } catch (error: unknown) {
        logger.error('CurbOS: Error checking access:', {
          error: getErrorMessage(error),
          userEmail,
        })
      }
      return false
    }
    checkAuth()
  }, [pathname, router])

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
                onClick={async () => {
                  await supabase.auth.signOut()
                  // Clear the cookie as well
                  document.cookie = "curbos_auth=; path=/; max-age=0"
                  router.push('/curbos/login')
                  router.refresh()
                }}
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
