import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Use same icon configuration as report map
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

export default function IssueMap({ lat, lng, height = 240 }: { lat: number; lng: number; height?: number }) {
  const center: LatLngExpression = [lat, lng]
  // No interactions beyond pan/zoom; marker not draggable in details view
  return (
    <div className="rounded border border-border bg-background overflow-hidden" style={{ height }}>
      <MapContainer {...({ center, zoom: 15 } as any)} className="w-full h-full" style={{ outline: 'none' }}>
        <TileLayer {...({ attribution: "&copy; OpenStreetMap contributors", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" } as any)} />
        <Marker {...({ position: center } as any)} />
      </MapContainer>
    </div>
  )
}