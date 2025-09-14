import React, { useEffect, useMemo, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import L from 'leaflet'

// Configure default marker icon via CDN URLs (works well with Vite + TS)
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

export default function LeafletMapPicker({
  value,
  onChange
}: {
  value: { lat: number; lng: number } | null
  onChange: (coords: { lat: number; lng: number }) => void
}) {
  const fallback = useMemo(() => ({ lat: 37.7749, lng: -122.4194 }), []) // Fallback: SF
  const [center, setCenter] = useState<{ lat: number; lng: number }>(value || fallback)

  // Try geolocation on mount to center the map
  useEffect(() => {
    let mounted = true
    if (!value) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          if (!mounted) return
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setCenter(c)
          onChange?.(c)
        },
        () => {
          if (!mounted) return
          setCenter(fallback)
        }
      )
    }
    return () => { mounted = false }
  }, [value, onChange, fallback])

  function MapEvents() {
    useMapEvents({
      click(e) {
        onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
      }
    })
    return null
  }

  const position = value || center
  const centerLL: LatLngExpression = [center.lat, center.lng]
  const posLL: LatLngExpression = [position.lat, position.lng]

  return (
    <div>
      {/* Cast props to any to satisfy TS with react-leaflet v4 types in this setup */}
      <MapContainer
        {...({ center: centerLL, zoom: 15 } as any)}
        className="w-full h-64 rounded border"
        style={{ outline: 'none' }}
      >
        <TileLayer
          {...({ attribution: "&copy; OpenStreetMap contributors", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" } as any)}
        />
        <MapEvents />
        <Marker
          {...({ position: posLL, draggable: true, eventHandlers: {
            dragend: (e: any) => {
              const m = e.target as L.Marker
              const p = m.getLatLng()
              onChange({ lat: p.lat, lng: p.lng })
            }
          }} as any)}
        />
      </MapContainer>
      <p className="mt-2 text-xs text-muted-foreground">Drag the marker or click on the map to set the location.</p>
    </div>
  )
}