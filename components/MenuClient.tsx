'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'

interface MenuItem {
  _id: string
  name: string
  description: string
  emoji: string
  category: string
  price: number
  available: boolean
  imageUrl?: string
}

interface Props {
  items: MenuItem[]
  restaurantName: string
  tagline: string
}

export default function MenuClient({ items, restaurantName, tagline }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category)))
    return ['All', ...cats]
  }, [items])

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return items
    return items.filter((i) => i.category === activeCategory)
  }, [items, activeCategory])

  // Group by category for display
  const grouped = useMemo(() => {
    const map = new Map<string, MenuItem[]>()
    for (const item of filtered) {
      if (!map.has(item.category)) map.set(item.category, [])
      map.get(item.category)!.push(item)
    }
    return map
  }, [filtered])

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#1a1a1a] text-center px-4 py-5 shadow-lg">
        <h1 className="text-[#f5e6c8] font-display text-2xl tracking-wide">
          {restaurantName}
        </h1>
        {tagline && (
          <p className="text-[#a09070] text-xs tracking-[0.15em] uppercase mt-1">
            {tagline}
          </p>
        )}
      </div>

      {/* Category pills */}
      <div className="sticky top-[72px] z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                ${activeCategory === cat
                  ? 'bg-[#1a1a1a] text-[#f5e6c8] border-[#1a1a1a]'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div className="px-4 py-4 pb-16 max-w-lg mx-auto">
        {Array.from(grouped.entries()).map(([category, catItems]) => (
          <div key={category} className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3 mt-2">
              {category}
            </h2>
            <div className="space-y-3">
              {catItems.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-sm">No items in this category</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 text-center py-3">
        <p className="text-xs text-stone-400">
          Powered by{' '}
          <span className="font-medium text-stone-600">{restaurantName}</span>
        </p>
      </div>
    </div>
  )
}

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-stone-100 p-3.5 flex items-start gap-3 shadow-sm
        transition-opacity duration-200
        ${!item.available ? 'opacity-50' : ''}
      `}
    >
      {/* Emoji or Image */}
      {item.imageUrl ? (
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-lg bg-stone-50 flex items-center justify-center text-2xl flex-shrink-0 border border-stone-100">
          {item.emoji}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-stone-900 text-sm leading-snug">
            {item.name}
          </h3>
          <div className="flex-shrink-0 text-right">
            <span className="font-semibold text-sm text-stone-900">
              ETB {item.price}
            </span>
          </div>
        </div>
        {item.description && (
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {item.description}
          </p>
        )}
        {!item.available && (
          <span className="inline-block mt-1.5 text-[10px] text-red-500 font-medium uppercase tracking-wide">
            Temporarily unavailable
          </span>
        )}
      </div>
    </div>
  )
}
