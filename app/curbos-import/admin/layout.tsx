import { auth0 } from '@/lib/auth0';
import { checkSubscription } from '@/lib/check-subscription';
import { redirect } from 'next/navigation';
import React from 'react';

export const dynamic = 'force-dynamic';

export default async function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth0.getSession();

    if (!session?.user?.email) {
        redirect('/api/auth/login');
    }

    const hasAccess = await checkSubscription(session.user.email);
    if (!hasAccess) {
        redirect('/unauthorized');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Could add a side nav here for Admin */}
            {children}
        </div>
    );
}
