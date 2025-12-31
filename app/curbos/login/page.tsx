'use client'

/**
 * CurbOS login page component
 * Handles Supabase authentication for CurbOS users
 *
 * @component
 * @returns {JSX.Element} Login page with signup/login functionality
 */
export default function LoginPage() {
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

        <div className="space-y-6">
            <div className="text-center space-y-2">
                <p className="text-neutral-400 text-sm">Please sign in with your PrepFlow account to access the administration console.</p>
            </div>

            <button
                type="button"
                onClick={() => {
                   // Redirect to the regular PrepFlow login but return to /curbos
                   window.location.href = `/api/auth/login?returnTo=${encodeURIComponent('/curbos')}`
                }}
                className="w-full bg-[#C0FF02] text-black font-black py-4 rounded-lg hover:bg-[#b0eb02] transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(192,255,2,0.2)] hover:shadow-[0_0_30px_rgba(192,255,2,0.4)]"
            >
                Login with PrepFlow
            </button>

            <div className="text-center">
                <p className="text-neutral-600 text-xs">Protected by PrepFlow Unified Authentication</p>
            </div>
        </div>
      </div>
    </div>
  )
}
