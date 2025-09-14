import React, { useCallback, useRef, useState } from 'react'

// Simple map-like picker without external libs: click or drag the pin to set lat/lng.
export default function MapPicker({
  value,
  onChange
}: {
  value: { lat: number; lng: number } | null
  onChange: (coords: { lat: number; lng: number }) => void
}) {
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(value)
  const [dragging, setDragging] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const ensureOrigin = useCallback(async () => {
    if (origin) return origin
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      )
      const o = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      setOrigin(o)
      return o
    } catch {
      const o = { lat: 37.7749, lng: -122.4194 } // fallback SF
      setOrigin(o)
      return o
    }
  }, [origin])

  const projectToLatLng = async (clientX: number, clientY: number) => {
    const box = ref.current
    if (!box) return null
    const base = await ensureOrigin()
    const rect = box.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width - 0.5
    const y = (clientY - rect.top) / rect.height - 0.5
    const lat = base.lat - y * 0.04
    const lng = base.lng + x * 0.04
    return { lat, lng }
  }

  const onClick = async (e: React.MouseEvent) => {
    if (dragging) return
    const coords = await projectToLatLng(e.clientX, e.clientY)
    if (coords) onChange(coords)
  }

  const onPointerMove = async (e: React.PointerEvent) => {
    if (!dragging) return
    e.preventDefault()
    const coords = await projectToLatLng(e.clientX, e.clientY)
    if (coords) onChange(coords)
  }

  const pinStyle = {
    transform: 'translate(-50%, -100%)'
  } as React.CSSProperties

  let pinPos: React.CSSProperties | undefined
  if (origin && value) {
    const dx = (value.lng - origin.lng) / 0.04 + 0.5
    const dy = 0.5 - (value.lat - origin.lat) / 0.04
    pinPos = { left: `${dx * 100}%`, top: `${dy * 100}%` }
  }

  return (
    <div>
      <div
        ref={ref}
        onClick={onClick}
        onPointerMove={onPointerMove}
        onPointerUp={() => setDragging(false)}
        className="relative w-full h-56 rounded border bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 cursor-crosshair overflow-hidden"
        aria-label="Map picker"
        role="button"
      >
        {/* grid */}
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.06)_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)]" />
        {pinPos && (
          <div
            className="absolute touch-none"
            style={pinPos}
            onPointerDown={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); setDragging(true) }}
          >
            <div className="text-red-600" style={pinStyle}>⬤</div>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Click or drag the pin to set location. Coordinates are approximate.</p>
    </div>
  )
}