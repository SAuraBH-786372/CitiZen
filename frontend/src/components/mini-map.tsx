import React from 'react'

// Minimal mini map preview using static map provider placeholder (no API key).
// Replace src with a real static map service if desired.
export default function MiniMap({ lat, lng }: { lat: number; lng: number }) {
  const src = `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${lng},${lat}&z=14&l=map&size=450,200&pt=${lng},${lat},pm2rdm`;
  return (
    <img src={src} alt="location" className="w-full h-40 object-cover rounded" loading="lazy" />
  )
}