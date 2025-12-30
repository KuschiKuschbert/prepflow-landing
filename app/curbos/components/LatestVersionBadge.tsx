'use client'

import { Download, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LatestVersionBadge() {
  const [version, setVersion] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://api.github.com/repos/KuschiKuschbert/CurbOS/releases/tags/nightly')
      .then(res => res.json())
      .then(data => {
        // Nightly release usually has assets with names like "app-debug.apk"
        // But the tag name itself is just "nightly".
        // Use the "name" field if available, or just hardcode "Nightly" with date
        // For nightly tags, the "name" field often contains the meaningful version like "0.2.4-nightly-..."
        if (data.name) {
          setVersion(data.name)
        } else if (data.tag_name) {
          setVersion(data.tag_name)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch version', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
  if (!version) return null

  return (
    <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-full px-3 py-1 text-xs font-mono text-neutral-300">
      <Download className="w-3 h-3 text-[#C0FF02]" />
      <span>{version}</span>
    </div>
  )
}
