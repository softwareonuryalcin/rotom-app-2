import type { Plan } from '../types'
import { PRIORITIES, getDays } from '../lib/plan'

interface FavoritesPanelProps {
  plans: Plan[]
  onToggleFavorite: (planId: string, placeId: string) => void
}

export function FavoritesPanel({ plans, onToggleFavorite }: FavoritesPanelProps) {
  const groups = plans
    .map((plan) => ({
      plan,
      days: getDays(plan.startDate, plan.endDate),
      favorites: plan.places.filter((s) => s.favorite),
    }))
    .filter((g) => g.favorites.length > 0)

  const total = groups.reduce((sum, g) => sum + g.favorites.length, 0)

  if (total === 0) {
    return (
      <section className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/50 p-12 text-center">
        <div>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-2xl">
            ★
          </div>
          <p className="text-sm text-slate-500">
            Henüz favori gezi yeri yok. Yerlerdeki yıldıza tıklayarak
            favorilerine ekleyebilirsin.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="flex-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Favori Gezi Yerleri
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {total} yer · {groups.length} plan
        </p>
      </header>

      <div className="flex flex-col gap-5">
        {groups.map(({ plan, days, favorites }) => (
          <div key={plan.id}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {plan.name}
            </h3>
            <ul className="flex flex-col gap-2">
              {favorites.map((place) => {
                const day =
                  place.dayIndex === null
                    ? null
                    : days.find((d) => d.index === place.dayIndex)
                return (
                  <li
                    key={place.id}
                    className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2.5"
                  >
                    <span className="text-amber-400">★</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-medium text-slate-800">
                          {place.name}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                          style={{
                            background: PRIORITIES[place.priority].badgeBg,
                            color: PRIORITIES[place.priority].badgeText,
                          }}
                        >
                          {PRIORITIES[place.priority].label}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {day ? `${day.index + 1}. gün` : 'Atanmamış'}
                        </span>
                      </div>
                      {place.note && (
                        <span className="block truncate text-xs text-slate-400">
                          {place.note}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onToggleFavorite(plan.id, place.id)}
                      title="Favoriden çıkar"
                      aria-label="Favoriden çıkar"
                      className="rounded-md p-1.5 text-amber-400 transition hover:bg-amber-100"
                    >
                      ✕
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
