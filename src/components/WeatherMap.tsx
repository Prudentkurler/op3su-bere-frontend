'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  lat: number
  lon: number
  location: string
}

function Map({ lat, lon, location }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current, {
      attributionControl: false,
    }).setView([lat, lon], 10)

    // Add dark theme tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Custom marker icon
    const markerIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="relative">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
            ${location}
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })

    // Add marker
    L.marker([lat, lon], { icon: markerIcon }).addTo(map)

    // Add risk zones (circles)
    const riskZones = [
      { radius: 50000, color: '#ef4444', opacity: 0.15, label: 'Extreme Risk' },
      { radius: 100000, color: '#f97316', opacity: 0.12, label: 'High Risk' },
      { radius: 150000, color: '#eab308', opacity: 0.1, label: 'Moderate Risk' },
      { radius: 200000, color: '#22c55e', opacity: 0.08, label: 'Low Risk' },
    ]

    riskZones.forEach((zone) => {
      L.circle([lat, lon], {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: zone.opacity,
        radius: zone.radius,
        weight: 1,
      }).addTo(map)
    })

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [lat, lon, location])

  return (
    <div 
      ref={mapRef} 
      className="h-[400px] w-full rounded-lg"
      style={{ zIndex: 0 }}
    />
  )
}

export default Map

