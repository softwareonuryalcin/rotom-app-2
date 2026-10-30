import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Place, Plan } from '../types'
import { PRIORITIES, getDays } from '../lib/plan'

interface MapViewProps {
  plan: Plan | null
}

interface Pin {
  place: Place
  lat: number
  lng: number
}

function priorityIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: 'travel-pin',
    html: `<span style="
      display:block;width:18px;height:18px;border-radius:9999px;
      background:${color};border:3px solid #fff;
      box-shadow:0 1px 4px rgba(15,23,42,.4);"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  })
}

function FitBounds({ pins }: { pins: Pin[] }) {
  const map = useMap()
  useEffect(() => {
    if (pins.length === 0) return
    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 12)
      return
    }
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, pins])
  return null
}

export function MapView({ plan }: MapViewProps) {
  const days = plan ? getDays(plan.startDate, plan.endDate) : []

  const pins = useMemo<Pin[]>(() => {
    if (!plan) return []
    return plan.places
      .filter((p) => p.lat !== null && p.lng !== null)
      .map((p) => ({ place: p, lat: p.lat as number, lng: p.lng as number }))
  }, [plan])

  if (!plan) {
    return (
      <section className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/50 p-12 text-center">
        <p className="text-sm text-slate-500">
          Haritayı görmek için bir plan seç.
        </p>
      </section>
    )
  }

  function dayLabel(place: Place): string {
    if (place.dayIndex === null) return 'Atanmamış'
    const day = days.find((d) => d.index === place.dayIndex)
    return day ? `${day.index + 1}. gün · ${day.label}` : 'Atanmamış'
  }

  return (
    <section className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            {plan.name} — Harita
          </h2>
          <p className="text-xs text-slate-400">
            {pins.length} konumlu yer gösteriliyor
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {(['high', 'medium', 'low'] as const).map((p) => (
            <span key={p} className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: PRIORITIES[p].color }}
              />
              {PRIORITIES[p].label}
            </span>
          ))}
        </div>
      </header>

      {pins.length === 0 ? (
        <div className="flex h-[480px] items-center justify-center p-8 text-center">
          <p className="text-sm text-slate-400">
            Bu planda haritada gösterilecek konumlu yer yok. Gezi yeri eklerken
            enlem/boylam (lat, lng) girersen burada pinlenir.
          </p>
        </div>
      ) : (
        <MapContainer
          center={[pins[0].lat, pins[0].lng]}
          zoom={10}
          scrollWheelZoom
          style={{ height: '480px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds pins={pins} />
          {pins.map(({ place, lat, lng }) => (
            <Marker
              key={place.id}
              position={[lat, lng]}
              icon={priorityIcon(PRIORITIES[place.priority].color)}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{place.name}</strong>
                  {place.favorite && <span title="Favori"> ★</span>}
                  <br />
                  <span style={{ color: PRIORITIES[place.priority].badgeText }}>
                    Öncelik: {PRIORITIES[place.priority].label}
                  </span>
                  <br />
                  <span style={{ color: '#64748b' }}>{dayLabel(place)}</span>
                  {place.note && (
                    <>
                      <br />
                      <span style={{ color: '#64748b' }}>{place.note}</span>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </section>
  )
}
