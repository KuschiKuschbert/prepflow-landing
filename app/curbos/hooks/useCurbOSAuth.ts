'use client'

import { logger } from '@/lib/logger'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

/**
 * Helper function to check CurbOS access via CurbOS-specific API endpoint
 */
async function checkCurbOSAccess(userEmail: string): Promise<boolean> {
  try {
    const normalizedEmail = userEmail.toLowerCase().trim();
    const response = await fetch(`/api/curbos/check-access?email=${encodeURIComponent(normalizedEmail)}`)

    if (response.ok) {
      const data = await response.json()
      logger.dev('CurbOS: Access check result:', {
        userEmail: normalizedEmail,
        allowed: data.allowed,
        reason: data.reason,
      })
      return data.allowed || false
    }

    const errorData = await response.json().catch(() => ({}))
    logger.warn('CurbOS: Access check failed:', {
      userEmail: normalizedEmail,
      status: response.status,
      error: errorData.error || errorData.message,
    })
  } catch (error: unknown) {
    logger.error('CurbOS: Error checking access:', {
      error: getErrorMessage(error),
      userEmail,
    })
  }
  return false
}

/**
 * Helper function to check if user is a PrepFlow admin
 */
async function checkIsAdmin(pathname: string, context: string): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/check')
    if (response.ok) {
      const data = await response.json()
      if (data.isAdmin) {
        logger.dev(`CurbOS: Admin access granted via PrepFlow session (${context}):`, {
          email: data.email,
          pathname,
        })
        return true
      }
      logger.warn(`CurbOS: Not an admin and no CurbOS access (${context})`, { email: data.email });
    } else {
      logger.warn(`CurbOS: Admin check API failed with status (${context}):`, response.status);
    }
  } catch (error: unknown) {
    logger.error(`CurbOS: Error checking admin status (${context}):`, {
      error: getErrorMessage(error),
    })
  }
  return false
}

export function useCurbOSAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function performAuthCheck() {
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

      // TEMP: Bypass auth for debugging (as per original code)
      setIsChecking(false)
      return

      /*
      // Original logic for when bypass is removed:
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session) {
          const isAdmin = await checkIsAdmin(pathname, 'no-session')
          if (isAdmin) {
            setIsChecking(false)
            return
          }

          logger.warn('CurbOS: No valid session, redirecting to login', {
            error: error?.message,
            pathname,
          })
          router.push('/curbos/login')
          return
        }

        const userEmail = session.user?.email
        if (userEmail) {
          const hasAccess = await checkCurbOSAccess(userEmail)
          if (hasAccess) {
            setIsChecking(false)
            return
          }

          const isAdmin = await checkIsAdmin(pathname, 'no-tier-access')
          if (isAdmin) {
            setIsChecking(false)
            return
          }

          logger.warn('CurbOS: Access denied - Business tier required', {
            userEmail,
            pathname,
          })
          router.push('/curbos/unauthorized')
          return
        }

        // No email in session, check admin
        const isAdmin = await checkIsAdmin(pathname, 'no-email')
        if (isAdmin) {
          setIsChecking(false)
          return
        }

        logger.warn('CurbOS: No email found in session', { pathname })
        router.push('/curbos/unauthorized')
      } catch (error: unknown) {
        logger.error('CurbOS: Unexpected error during auth check', {
          error: getErrorMessage(error),
          pathname,
        })
        router.push('/curbos/login')
      }
      */
    }

    performAuthCheck()
  }, [pathname, router])

  return { isChecking }
}
