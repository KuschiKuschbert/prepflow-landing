import React from 'react';
import Background from './Background';

export default function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen text-white relative">
            <Background />
            <main className="relative z-10 w-full">
                {children}
            </main>
        </div>
    );
}
