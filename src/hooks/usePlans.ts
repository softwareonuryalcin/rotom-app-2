import { useCallback, useEffect, useState } from 'react'
import type { Place, Plan, Priority } from '../types'
import { createId, loadPlans, savePlans } from '../lib/storage'
import { getDayCount } from '../lib/plan'

export interface NewPlaceInput {
  name: string
  note?: string
  lat?: number | null
  lng?: number | null
  priority?: Priority
  dayIndex?: number | null
}

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>(() => loadPlans())

  useEffect(() => {
    savePlans(plans)
  }, [plans])

  const addPlan = useCallback(
    (
      name: string,
      description: string,
      startDate: string,
      endDate: string,
    ): string => {
      const id = createId()
      const plan: Plan = {
        id,
        name: name.trim(),
        description: description.trim(),
        startDate,
        endDate,
        places: [],
        createdAt: Date.now(),
      }
      setPlans((prev) => [plan, ...prev])
      return id
    },
    [],
  )

  const updatePlan = useCallback(
    (
      id: string,
      patch: Partial<
        Pick<Plan, 'name' | 'description' | 'startDate' | 'endDate'>
      >,
    ) => {
      setPlans((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p
          const next = { ...p, ...patch }
          // Tarih aralığı daraldıysa, aralık dışında kalan günlere atanmış
          // yerleri "atanmamış" durumuna geri al.
          const dayCount = getDayCount(next.startDate, next.endDate)
          next.places = next.places.map((place) =>
            place.dayIndex !== null && place.dayIndex >= dayCount
              ? { ...place, dayIndex: null }
              : place,
          )
          return next
        }),
      )
    },
    [],
  )

  const removePlan = useCallback((id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const addPlace = useCallback((planId: string, input: NewPlaceInput) => {
    const place: Place = {
      id: createId(),
      name: input.name.trim(),
      note: (input.note ?? '').trim(),
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      priority: input.priority ?? 'medium',
      dayIndex: input.dayIndex ?? null,
      favorite: false,
    }
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId ? { ...p, places: [...p.places, place] } : p,
      ),
    )
  }, [])

  const updatePlace = useCallback(
    (
      planId: string,
      placeId: string,
      patch: Partial<Omit<Place, 'id'>>,
    ) => {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === planId
            ? {
                ...p,
                places: p.places.map((s) =>
                  s.id === placeId ? { ...s, ...patch } : s,
                ),
              }
            : p,
        ),
      )
    },
    [],
  )

  const removePlace = useCallback((planId: string, placeId: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? { ...p, places: p.places.filter((s) => s.id !== placeId) }
          : p,
      ),
    )
  }, [])

  const toggleFavorite = useCallback((planId: string, placeId: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? {
              ...p,
              places: p.places.map((s) =>
                s.id === placeId ? { ...s, favorite: !s.favorite } : s,
              ),
            }
          : p,
      ),
    )
  }, [])

  // Aynı gün içindeki gezi sırasını değiştirir (bir önceki/sonraki aynı-gün
  // yer ile yer değiştirir).
  const movePlaceWithinDay = useCallback(
    (planId: string, placeId: string, direction: -1 | 1) => {
      setPlans((prev) =>
        prev.map((p) => {
          if (p.id !== planId) return p
          const index = p.places.findIndex((s) => s.id === placeId)
          if (index === -1) return p
          const day = p.places[index].dayIndex
          const places = [...p.places]
          let target = index + direction
          while (target >= 0 && target < places.length) {
            if (places[target].dayIndex === day) {
              ;[places[index], places[target]] = [
                places[target],
                places[index],
              ]
              return { ...p, places }
            }
            target += direction
          }
          return p
        }),
      )
    },
    [],
  )

  return {
    plans,
    addPlan,
    updatePlan,
    removePlan,
    addPlace,
    updatePlace,
    removePlace,
    toggleFavorite,
    movePlaceWithinDay,
  }
}
