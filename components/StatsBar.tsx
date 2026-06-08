import { MenuItem } from '@/app/admin/dashboard/page'

export default function StatsBar({ items }: { items: MenuItem[] }) {
  const total = items.length
  const available = items.filter((i) => i.available).length
  const unavailable = total - available
  const categories = new Set(items.map((i) => i.category)).size

  const stats = [
    { label: 'Total items', value: total, color: 'text-stone-900' },
    { label: 'Available', value: available, color: 'text-green-700' },
    { label: 'Unavailable', value: unavailable, color: 'text-red-600' },
    { label: 'Categories', value: categories, color: 'text-stone-900' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm"
        >
          <div className="text-xs text-stone-500 mb-1">{s.label}</div>
          <div className={`text-2xl font-semibold ${s.color}`}>{s.value}</div>
        </div>
      ))}
    </div>
  )
}
