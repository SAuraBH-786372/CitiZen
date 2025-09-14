import React, { useEffect, useState } from 'react'

// Lightweight confetti imitation via CSS particles; avoids extra deps
export default function ConfettiSuccess({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(show)
  useEffect(() => {
    if (show) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2000)
      return () => clearTimeout(t)
    }
  }, [show])
  if (!visible) return null
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <span key={i} className="absolute w-2 h-2 rounded-sm" style={{
          left: `${Math.random()*100}%`,
          top: `-10px`,
          backgroundColor: `hsl(${Math.random()*360},80%,60%)`,
          transform: `translateY(${Math.random()*20}px)`,
          animation: `fall ${1+Math.random()*1.5}s ease-out forwards`
        }} />
      ))}
      <style>{`@keyframes fall { to { transform: translateY(120vh) rotate(180deg); opacity: .2 } }`}</style>
    </div>
  )
}