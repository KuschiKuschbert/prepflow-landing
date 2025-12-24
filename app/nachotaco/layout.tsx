import '../globals.css'
import RotatingTaco from './components/RotatingTaco'
import TriangleGridBackground from './components/TriangleGridBackground'
import SpotlightCursor from './components/SpotlightCursor'

export default function NachoTacoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TriangleGridBackground />
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-900/80 via-black/80 to-[#1a1a1a]/80 -z-10 header-animate-gradient pointer-events-none"></div>
      <RotatingTaco />
      <SpotlightCursor />
      <div className="relative z-10">
        {children}
      </div>
    </>
  )
}
