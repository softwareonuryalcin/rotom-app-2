import type { Priority } from '../types'

export const PRIORITIES: Record<
  Priority,
  { label: string; color: string; badgeBg: string; badgeText: string }
> = {
  high: {
    label: 'Yüksek',
    color: '#ef4444',
    badgeBg: '#fee2e2',
    badgeText: '#b91c1c',
  },
  medium: {
    label: 'Orta',
    color: '#f59e0b',
    badgeBg: '#fef3c7',
    badgeText: '#b45309',
  },
  low: {
    label: 'Düşük',
    color: '#10b981',
    badgeBg: '#d1fae5',
    badgeText: '#047857',
  },
}

export const PRIORITY_ORDER: Priority[] = ['high', 'medium', 'low']

/** Bitiş - başlangıç arasındaki gün sayısı (dahil). Geçersizse 0. */
export function getDayCount(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0
  const ms = end.getTime() - start.getTime()
  if (ms < 0) return 0
  return Math.floor(ms / 86_400_000) + 1
}

export interface DayInfo {
  index: number
  date: Date
  label: string
}

/** Plan tarih aralığındaki günlerin listesi. */
export function getDays(startDate: string, endDate: string): DayInfo[] {
  const count = getDayCount(startDate, endDate)
  if (count === 0) return []
  const start = new Date(startDate)
  const days: DayInfo[] = []
  for (let i = 0; i < count; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push({ index: i, date, label: formatDate(date) })
  }
  return days
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  })
}
