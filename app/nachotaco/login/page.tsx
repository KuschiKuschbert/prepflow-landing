import { login } from '../actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <form action={login} className="bg-neutral-800 p-8 rounded-lg space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-lime-400 text-center">Nacho Tacos Admin</h1>
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          className="w-full bg-neutral-700 text-white rounded px-4 py-2 border border-neutral-600 focus:border-lime-500 outline-none"
        />
        <button type="submit" className="w-full bg-lime-500 text-black font-bold py-2 rounded hover:bg-lime-400">
          Login
        </button>
      </form>
    </div>
  )
}
