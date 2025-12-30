'use client'
import { logger } from '@/lib/logger'
import { supabase } from '@/lib/supabase-pos'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * CurbOS login page component
 * Handles Supabase authentication for CurbOS users
 *
 * @component
 * @returns {JSX.Element} Login page with signup/login functionality
 */
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) {
          logger.error('Error during signup:', { error: error.message, context: { endpoint: '/curbos/login' } })
          throw error
        }
        setMessage({ text: 'Account created! Please check your email for confirmation (if enabled).', type: 'success' })
        // If auto-confirm is on, we can try logging in immediately or just switch to login
        if (data.session && data.user?.email) {
            setMessage({ text: 'Account created and logged in!', type: 'success' })
            // Store email for tier-based access check (normalized: lowercase, trimmed)
            const normalizedEmail = data.user.email.toLowerCase().trim();
            document.cookie = `curbos_user_email=${encodeURIComponent(normalizedEmail)}; path=/; max-age=86400; SameSite=Lax`; // 24 hours
            document.cookie = "curbos_auth=true; path=/; max-age=86400; SameSite=Lax"
            logger.dev('[CurbOS Login] Stored email in cookie (signup):', { email: normalizedEmail });
            setTimeout(() => router.push('/curbos'), 1000)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          logger.error('Error during login:', { error: error.message, context: { endpoint: '/curbos/login' } })
          throw error
        }
        setMessage({ text: 'Login successful! Redirecting...', type: 'success' })

        // Set cookies for middleware compatibility and tier checking
        // Store email for tier-based access check (normalized: lowercase, trimmed)
        if (data.user?.email) {
          const normalizedEmail = data.user.email.toLowerCase().trim();
          document.cookie = `curbos_user_email=${encodeURIComponent(normalizedEmail)}; path=/; max-age=86400; SameSite=Lax`; // 24 hours
          logger.dev('[CurbOS Login] Stored email in cookie:', { email: normalizedEmail });
        }
        document.cookie = "curbos_auth=true; path=/; max-age=86400"

        router.push('/curbos')
        router.refresh()
      }
    } catch (err: any) {
      logger.error('Unexpected error during auth:', { error: err instanceof Error ? err.message : String(err), context: { endpoint: '/curbos/login', mode } })
      setMessage({ text: err.message || 'An error occurred', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center relative overflow-hidden">
      {/* Background Triangles (Visual Consistency) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-0 h-0 border-l-[20px] border-l-transparent border-t-[35px] border-t-[#C0FF02] border-r-[20px] border-r-transparent rotate-12"></div>
          <div className="absolute bottom-20 right-20 w-0 h-0 border-l-[30px] border-l-transparent border-t-[50px] border-t-[#C0FF02] border-r-[30px] border-r-transparent -rotate-12"></div>
      </div>

      <div className="w-full max-w-md bg-[#111] p-4 tablet:p-6 desktop:p-8 rounded-2xl border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 mx-4">
        <div className="text-center mb-6 tablet:mb-8">
            <h1 className="text-2xl tablet:text-3xl font-black text-white tracking-tight">CURB<span className="text-[#C0FF02]">OS</span></h1>
            <p className="text-neutral-500 text-xs tablet:text-sm mt-2 uppercase tracking-widest font-bold">POS System Access</p>
        </div>

        <div className="flex bg-[#1a1a1a] rounded-lg p-1 mb-6">
            <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${mode === 'login' ? 'bg-[#C0FF02] text-black' : 'text-gray-400 hover:text-white'}`}
            >
                LOGIN
            </button>
            <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${mode === 'signup' ? 'bg-[#C0FF02] text-black' : 'text-gray-400 hover:text-white'}`}
            >
                CREATE ADMIN
            </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Email Access</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@curbos.com"
              className="w-full bg-[#0a0a0a] text-white rounded-lg px-4 py-3 border border-neutral-800 focus:border-[#C0FF02] outline-none transition-all placeholder:text-neutral-700"
              required
            />
          </div>
          <div>
             <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Passcode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0a0a0a] text-white rounded-lg px-4 py-3 border border-neutral-800 focus:border-[#C0FF02] outline-none transition-all placeholder:text-neutral-700"
              required
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                {message.text}
            </div>
          )}

          {mode === 'login' && (
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-[#111] text-neutral-600 font-bold tracking-widest">Or securely via</span>
                </div>
            </div>
          )}

          {mode === 'login' && (
            <button
                type="button"
                onClick={() => {
                   // Redirect to the regular PrepFlow login but return to /curbos
                   window.location.href = `/api/auth/login?returnTo=${encodeURIComponent('/curbos')}`
                }}
                className="w-full bg-white text-black font-black py-3 rounded-lg hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider text-xs tablet:text-sm"
            >
                Login with PrepFlow
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C0FF02] text-black font-black py-3 tablet:py-4 rounded-lg hover:bg-[#b0eb02] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs tablet:text-sm mt-4"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Authenticate' : 'Register System')}
          </button>
        </form>
      </div>
    </div>
  )
}
