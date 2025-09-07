import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PrepFlow Kitchen Management',
  description: 'Professional kitchen management and COGS calculator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">PrepFlow</h1>
              </div>
              <div className="flex items-center space-x-8">
                <a href="/" className="text-gray-500 hover:text-gray-900">Dashboard</a>
                <a href="/ingredients" className="text-gray-500 hover:text-gray-900">Ingredients</a>
                <a href="/recipes" className="text-gray-500 hover:text-gray-900">Recipes</a>
                <a href="/cogs" className="text-gray-500 hover:text-gray-900">COGS Calculator</a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
