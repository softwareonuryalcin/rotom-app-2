import { useState } from 'react'
import type { Place, Plan, Priority } from '../types'
import { PRIORITIES, PRIORITY_ORDER, getDays } from '../lib/plan'
import type { NewPlaceInput } from '../hooks/usePlans'

interface PlanDetailProps {
  plan: Plan | null
  onAddPlace: (input: NewPlaceInput) => void
  onRemovePlace: (placeId: string) => void
  onToggleFavorite: (placeId: string) => void
  onMovePlace: (placeId: string, direction: -1 | 1) => void
  onAssignDay: (placeId: string, dayIndex: number | null) => void
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = PRIORITIES[priority]
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: meta.badgeBg, color: meta.badgeText }}
    >
      {meta.label}
    </span>
  )
}

export function PlanDetail({
  plan,
  onAddPlace,
  onRemovePlace,
  onToggleFavorite,
  onMovePlace,
  onAssignDay,
}: PlanDetailProps) {
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dayValue, setDayValue] = useState('unassigned')

  if (!plan) {
    return (
      <section className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/50 p-12 text-center">
        <div>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-2xl">
            🧳
          </div>
          <p className="text-sm text-slate-500">
            Bir tatil planı seç ya da yeni bir plan oluştur, sonra gezi
            yerlerini ekle.
          </p>
        </div>
      </section>
    )
  }

  const days = getDays(plan.startDate, plan.endDate)

  function parseCoord(value: string): number | null {
    if (value.trim() === '') return null
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onAddPlace({
      name,
      note,
      lat: parseCoord(lat),
      lng: parseCoord(lng),
      priority,
      dayIndex: dayValue === 'unassigned' ? null : Number(dayValue),
    })
    setName('')
    setNote('')
    setLat('')
    setLng('')
    setPriority('medium')
  }

  const unassigned = plan.places.filter((p) => p.dayIndex === null)

  function renderPlace(place: Place, index: number, dayPlaces: Place[]) {
    return (
      <li
        key={place.id}
        className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5"
      >
        <span
          className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
          style={{ background: PRIORITIES[place.priority].color }}
          title={`Öncelik: ${PRIORITIES[place.priority].label}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-medium text-slate-800">
              {place.name}
            </span>
            <PriorityBadge priority={place.priority} />
            {place.lat !== null && place.lng !== null ? (
              <span className="text-[11px] text-sky-600" title="Haritada pinli">
                📍 {place.lat.toFixed(3)}, {place.lng.toFixed(3)}
              </span>
            ) : (
              <span className="text-[11px] text-slate-300">konum yok</span>
            )}
          </div>
          {place.note && (
            <span className="mt-0.5 block truncate text-xs text-slate-400">
              {place.note}
            </span>
          )}
          <div className="mt-1.5 flex items-center gap-2">
            <select
              value={place.dayIndex === null ? 'unassigned' : String(place.dayIndex)}
              onChange={(e) =>
                onAssignDay(
                  place.id,
                  e.target.value === 'unassigned'
                    ? null
                    : Number(e.target.value),
                )
              }
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none focus:border-sky-400"
            >
              <option value="unassigned">Atanmamış</option>
              {days.map((d) => (
                <option key={d.index} value={d.index}>
                  {d.index + 1}. gün · {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onMovePlace(place.id, -1)}
            disabled={index === 0}
            title="Sırada yukarı"
            aria-label="Sırada yukarı"
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ▲
          </button>
          <button
            onClick={() => onMovePlace(place.id, 1)}
            disabled={index === dayPlaces.length - 1}
            title="Sırada aşağı"
            aria-label="Sırada aşağı"
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ▼
          </button>
          <button
            onClick={() => onToggleFavorite(place.id)}
            title={place.favorite ? 'Favoriden çıkar' : 'Favoriye ekle'}
            aria-label={place.favorite ? 'Favoriden çıkar' : 'Favoriye ekle'}
            className={`rounded-md p-1.5 text-lg leading-none transition hover:bg-amber-50 ${
              place.favorite ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            {place.favorite ? '★' : '☆'}
          </button>
          <button
            onClick={() => onRemovePlace(place.id)}
            title="Yeri sil"
            aria-label="Yeri sil"
            className="rounded-md p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
          >
            ✕
          </button>
        </div>
      </li>
    )
  }

  return (
    <section className="flex-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-800">{plan.name}</h2>
        {plan.description && (
          <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
        )}
        <p className="mt-1 text-xs text-slate-400">
          {days.length} günlük plan · {plan.places.length} gezi yeri
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mb-5 rounded-lg border border-slate-100 bg-slate-50/50 p-3"
      >
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Gezi yeri ekle
        </h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Yer adı (örn. Efes Antik Kenti)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Not (opsiyonel)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            inputMode="decimal"
            placeholder="Enlem (lat)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
          <input
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            inputMode="decimal"
            placeholder="Boylam (lng)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-500"
            title="Öncelik"
          >
            {PRIORITY_ORDER.map((p) => (
              <option key={p} value={p}>
                Öncelik: {PRIORITIES[p].label}
              </option>
            ))}
          </select>
          <select
            value={dayValue}
            onChange={(e) => setDayValue(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-500"
            title="Gün"
          >
            <option value="unassigned">Gün: Atanmamış</option>
            {days.map((d) => (
              <option key={d.index} value={d.index}>
                {d.index + 1}. gün · {d.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="mt-3 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Gezi yeri ekle
        </button>
      </form>

      {plan.places.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          Bu planda henüz gezi yeri yok.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {days.map((day) => {
            const dayPlaces = plan.places.filter(
              (p) => p.dayIndex === day.index,
            )
            return (
              <div key={day.index}>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                    {day.index + 1}
                  </span>
                  {day.label}
                  <span className="text-xs font-normal text-slate-400">
                    ({dayPlaces.length} yer)
                  </span>
                </h3>
                {dayPlaces.length === 0 ? (
                  <p className="pl-8 text-xs text-slate-300">
                    Bu güne henüz yer eklenmedi.
                  </p>
                ) : (
                  <ol className="flex flex-col gap-2">
                    {dayPlaces.map((place, i) =>
                      renderPlace(place, i, dayPlaces),
                    )}
                  </ol>
                )}
              </div>
            )
          })}

          {unassigned.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-500">
                Atanmamış yerler
                <span className="ml-1 text-xs font-normal text-slate-400">
                  ({unassigned.length})
                </span>
              </h3>
              <ol className="flex flex-col gap-2">
                {unassigned.map((place, i) =>
                  renderPlace(place, i, unassigned),
                )}
              </ol>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
