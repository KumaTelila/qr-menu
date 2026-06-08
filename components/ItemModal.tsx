'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { MenuItem } from '@/app/admin/dashboard/page'

const COMMON_CATEGORIES = ['Coffee', 'Tea', 'Food', 'Desserts', 'Juices', 'Beverages', 'Snacks']

const EMOJI_SUGGESTIONS = ['☕', '🫘', '🍵', '🥛', '🍺', '🥤', '🧃', '🍽️', '🥩', '🍲', '🥗', '🍰', '🍮', '🥐', '🥑', '🥭', '🍊', '🫖']

interface Props {
  item: MenuItem | null
  onClose: () => void
  onSaved: (item: MenuItem, isNew: boolean) => void
}

export default function ItemModal({ item, onClose, onSaved }: Props) {
  const isNew = !item

  const [form, setForm] = useState({
    name: item?.name || '',
    description: item?.description || '',
    emoji: item?.emoji || '🍽️',
    category: item?.category || '',
    price: item?.price?.toString() || '',
    available: item?.available !== false,
    imageUrl: item?.imageUrl || '',
    order: item?.order?.toString() || '0',
  })
  const [loading, setLoading] = useState(false)
  const [customCat, setCustomCat] = useState(
    item?.category && !COMMON_CATEGORIES.includes(item.category) ? item.category : ''
  )

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.price || (!form.category && !customCat)) {
      toast.error('Fill in name, category, and price')
      return
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      emoji: form.emoji,
      category: customCat || form.category,
      price: Number(form.price),
      available: form.available,
      imageUrl: form.imageUrl.trim(),
      order: Number(form.order),
    }

    setLoading(true)
    try {
      const url = isNew ? '/api/items' : `/api/items/${item!._id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed')
      }
      const saved = await res.json()
      toast.success(isNew ? 'Item added!' : 'Item updated!')
      onSaved(saved, isNew)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900">{isNew ? 'Add menu item' : 'Edit item'}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Emoji picker + Name */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <label className="text-xs text-stone-500 block mb-1.5">Icon</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.emoji}
                  onChange={(e) => set('emoji', e.target.value)}
                  className="w-14 h-10 text-center text-xl border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300"
                  maxLength={2}
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1 max-w-[120px]">
                {EMOJI_SUGGESTIONS.slice(0, 6).map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => set('emoji', em)}
                    className="text-base hover:scale-125 transition-transform"
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-stone-500 block mb-1.5">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="e.g. Macchiato"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-stone-500 block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-stone-300"
              placeholder="Short description of the item…"
            />
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-500 block mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={(e) => { set('category', e.target.value); setCustomCat('') }}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
              >
                <option value="">Select…</option>
                {COMMON_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="__custom">+ Custom…</option>
              </select>
              {(form.category === '__custom' || customCat) && (
                <input
                  type="text"
                  value={customCat}
                  onChange={(e) => setCustomCat(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                  placeholder="Category name"
                />
              )}
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1.5">Price (ETB) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                required
                min={0}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="120"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-xs text-stone-500 block mb-1.5">Image URL (optional)</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
              placeholder="https://…"
            />
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-sm font-medium text-stone-800">Available now</div>
              <div className="text-xs text-stone-400">Toggle off when item is sold out</div>
            </div>
            <button
              type="button"
              onClick={() => set('available', !form.available)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.available ? 'bg-green-500' : 'bg-stone-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  form.available ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-[#1a1a1a] text-[#f5e6c8] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? 'Saving…' : isNew ? 'Add item' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
