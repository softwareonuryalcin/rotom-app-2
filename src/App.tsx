import { useState } from 'react'
import { usePlans } from './hooks/usePlans'
import { Sidebar } from './components/Sidebar'
import { PlanDetail } from './components/PlanDetail'
import { MapView } from './components/MapView'
import { FavoritesPanel } from './components/FavoritesPanel'

type Tab = 'plan' | 'map' | 'favorites'

function App() {
  const {
    plans,
    addPlan,
    removePlan,
    addPlace,
    updatePlace,
    removePlace,
    toggleFavorite,
    movePlaceWithinDay,
  } = usePlans()

  const [tab, setTab] = useState<Tab>('plan')
  const [selectedId, setSelectedId] = useState<string | null>(
    () => plans[0]?.id ?? null,
  )

  // Seçimi her render'da türet: seçili plan silinirse ilk plana geri döner.
  const selectedPlan =
    plans.find((p) => p.id === selectedId) ?? plans[0] ?? null

  const favoriteCount = plans.reduce(
    (sum, p) => sum + p.places.filter((s) => s.favorite).length,
    0,
  )

  function handleCreate(
    name: string,
    description: string,
    startDate: string,
    endDate: string,
  ) {
    const id = addPlan(name, description, startDate, endDate)
    setSelectedId(id)
    setTab('plan')
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'plan', label: 'Plan' },
    { id: 'map', label: 'Harita' },
    {
      id: 'favorites',
      label: `Favoriler${favoriteCount > 0 ? ` (${favoriteCount})` : ''}`,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-xl">
              🧭
            </span>
            <div>
              <h1 className="text-lg font-bold leading-tight text-slate-800">
                Seyahat Planlayıcı
              </h1>
              <p className="text-xs text-slate-400">
                Tatil planı oluştur, gezi yerlerini önceliklendir, haritada
                pinle
              </p>
            </div>
          </div>

          <nav className="flex rounded-lg bg-slate-100 p-1 text-sm font-medium">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-md px-3 py-1.5 transition ${
                  tab === t.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-6 md:flex-row">
        <Sidebar
          plans={plans}
          selectedId={selectedPlan?.id ?? null}
          onSelect={(id) => {
            setSelectedId(id)
            if (tab === 'favorites') setTab('plan')
          }}
          onCreate={handleCreate}
          onDelete={removePlan}
        />

        {tab === 'plan' && (
          <PlanDetail
            plan={selectedPlan}
            onAddPlace={(input) =>
              selectedPlan && addPlace(selectedPlan.id, input)
            }
            onRemovePlace={(placeId) =>
              selectedPlan && removePlace(selectedPlan.id, placeId)
            }
            onToggleFavorite={(placeId) =>
              selectedPlan && toggleFavorite(selectedPlan.id, placeId)
            }
            onMovePlace={(placeId, direction) =>
              selectedPlan &&
              movePlaceWithinDay(selectedPlan.id, placeId, direction)
            }
            onAssignDay={(placeId, dayIndex) =>
              selectedPlan &&
              updatePlace(selectedPlan.id, placeId, { dayIndex })
            }
          />
        )}

        {tab === 'map' && <MapView plan={selectedPlan} />}

        {tab === 'favorites' && (
          <FavoritesPanel plans={plans} onToggleFavorite={toggleFavorite} />
        )}
      </main>
    </div>
  )
}

export default App
