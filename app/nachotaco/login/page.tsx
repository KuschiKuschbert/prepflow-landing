'use client'
import { supabase } from '@/lib/supabase-pos'
import { logger } from '@/lib/logger'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
          logger.error('Error during signup:', { error: error.message, context: { endpoint: '/nachotaco/login' } })
          throw error
        }
        setMessage({ text: 'Account created! Please check your email for confirmation (if enabled).', type: 'success' })
        // If auto-confirm is on, we can try logging in immediately or just switch to login
        if (data.session) {
            setMessage({ text: 'Account created and logged in!', type: 'success' })
            setTimeout(() => router.push('/nachotaco'), 1000)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          logger.error('Error during login:', { error: error.message, context: { endpoint: '/nachotaco/login' } })
          throw error
        }
        setMessage({ text: 'Login successful! Redirecting...', type: 'success' })

        // Set cookie for middleware compatibility (migration phase)
        // Ideally middleware checks supabase session, but if we have legacy check:
        document.cookie = "nacho_auth=true; path=/; max-age=86400"

        router.push('/nachotaco')
        router.refresh()
      }
    } catch (err: any) {
      logger.error('Unexpected error during auth:', { error: err instanceof Error ? err.message : String(err), context: { endpoint: '/nachotaco/login', mode } })
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
            <h1 className="text-2xl tablet:text-3xl font-black text-white tracking-tight">NACHO <span className="text-[#C0FF02]">TACO</span></h1>
            <p className="text-neutral-500 text-xs tablet:text-sm mt-2 uppercase tracking-widest font-bold">Internal System Access</p>
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
              placeholder="admin@nachotacos.com"
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
