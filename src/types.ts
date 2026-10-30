export type Priority = 'high' | 'medium' | 'low'

export interface Place {
  id: string
  name: string
  note: string
  lat: number | null
  lng: number | null
  priority: Priority
  dayIndex: number | null // null = henüz bir güne atanmadı
  favorite: boolean
}

export interface Plan {
  id: string
  name: string
  description: string
  startDate: string // 'YYYY-MM-DD'
  endDate: string // 'YYYY-MM-DD'
  places: Place[]
  createdAt: number
}
