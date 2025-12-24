'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const password = formData.get('password')
  
  if (password === 'taco123') {
    (await cookies()).set('nacho_auth', 'true', { 
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    redirect('/nachotaco')
  }
}

export async function logout() {
    (await cookies()).delete('nacho_auth')
    redirect('/nachotaco/login')
}
