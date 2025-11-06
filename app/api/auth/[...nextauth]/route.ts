import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// Use the standard NextAuth route handlers to ensure correct behavior
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
