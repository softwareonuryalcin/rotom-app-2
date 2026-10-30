import { useState } from 'react'
import type { Plan } from '../types'
import { getDayCount } from '../lib/plan'

interface SidebarProps {
  plans: Plan[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreate: (
    name: string,
    description: string,
    startDate: string,
    endDate: string,
  ) => void
  onDelete: (id: string) => void
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function Sidebar({
  plans,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
}: SidebarProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState(todayISO())
  const [endDate, setEndDate] = useState(todayISO())

  const dayCount = getDayCount(startDate, endDate)
  const datesValid = dayCount > 0
  const canSubmit = name.trim().length > 0 && datesValid

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    onCreate(name, description, startDate, endDate)
    setName('')
    setDescription('')
  }

  return (
    <aside className="w-full md:w-80 shrink-0 flex flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Yeni tatil planı
        </h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Plan adı (örn. Ege Turu)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Kısa açıklama (opsiyonel)"
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-xs text-slate-500">
            Başlangıç
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-500">
            Bitiş
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>
        </div>
        <p
          className={`mt-2 text-xs ${
            datesValid ? 'text-slate-400' : 'text-rose-500'
          }`}
        >
          {datesValid
            ? `${dayCount} günlük plan`
            : 'Bitiş tarihi başlangıçtan önce olamaz'}
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-3 w-full rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Plan oluştur
        </button>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
        <h2 className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Planlarım ({plans.length})
        </h2>
        {plans.length === 0 ? (
          <p className="px-2 pb-3 pt-1 text-sm text-slate-400">
            Henüz plan yok. İlk tatil planını oluştur.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {plans.map((plan) => {
              const active = plan.id === selectedId
              const days = getDayCount(plan.startDate, plan.endDate)
              const favCount = plan.places.filter((s) => s.favorite).length
              return (
                <li key={plan.id}>
                  <div
                    className={`group flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                      active
                        ? 'bg-sky-50 ring-1 ring-sky-200'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <button
                      onClick={() => onSelect(plan.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block truncate text-sm font-medium text-slate-800">
                        {plan.name}
                      </span>
                      <span className="block text-xs text-slate-400">
                        {days} gün · {plan.places.length} yer
                        {favCount > 0 ? ` · ${favCount} favori` : ''}
                      </span>
                    </button>
                    <button
                      onClick={() => onDelete(plan.id)}
                      title="Planı sil"
                      aria-label="Planı sil"
                      className="rounded-md p-1 text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      </svg>
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
