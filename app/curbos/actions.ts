'use server'

import { AUTH_CONSTANTS } from '@/lib/constants'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const password = formData.get('password')

  if (password === 'taco123') {
    (await cookies()).set('curbos_auth', 'true', {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: AUTH_CONSTANTS.SESSION_MAX_AGE
    })
    redirect('/curbos')
  }
}

export async function logout() {
    (await cookies()).delete('curbos_auth')
    redirect('/curbos/login')
}
