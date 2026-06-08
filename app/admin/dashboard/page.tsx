'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Plus, LogOut, Search, Edit2, Trash2, Eye, EyeOff,
  Coffee, QrCode, BarChart3, RefreshCw
} from 'lucide-react'
import ItemModal from '@/components/ItemModal'
import QRModal from '@/components/QRModal'
import StatsBar from '@/components/StatsBar'

export interface MenuItem {
  _id: string
  name: string
  description: string
  emoji: string
  category: string
  price: number
  available: boolean
  imageUrl?: string
  order: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showQR, setShowQR] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/items')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setItems(data)
    } catch {
      toast.error('Failed to load items')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') fetchItems()
  }, [status, fetchItems])

  const toggleAvail = async (item: MenuItem) => {
    const prev = item.available
    setItems((prev) => prev.map((i) => i._id === item._id ? { ...i, available: !i.available } : i))
    try {
      const res = await fetch(`/api/items/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !item.available }),
      })
      if (!res.ok) throw new Error()
      toast.success(prev ? 'Marked unavailable' : 'Marked available')
    } catch {
      setItems((arr) => arr.map((i) => i._id === item._id ? { ...i, available: prev } : i))
      toast.error('Failed to update')
    }
  }

  const deleteItem = async (item: MenuItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return
    setItems((prev) => prev.filter((i) => i._id !== item._id))
    try {
      const res = await fetch(`/api/items/${item._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Item deleted')
    } catch {
      toast.error('Failed to delete')
      fetchItems()
    }
  }

  const onSaved = (savedItem: MenuItem, isNew: boolean) => {
    if (isNew) {
      setItems((prev) => [...prev, savedItem])
    } else {
      setItems((prev) => prev.map((i) => i._id === savedItem._id ? savedItem : i))
    }
    setShowModal(false)
    setEditingItem(null)
  }

  const openAdd = () => { setEditingItem(null); setShowModal(true) }
  const openEdit = (item: MenuItem) => { setEditingItem(item); setShowModal(true) }

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category)))]

  const filtered = items.filter((item) => {
    const matchesCat = filterCat === 'All' || item.category === filterCat
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone-400 text-sm">Loading…</div>
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top nav */}
      <header className="bg-[#1a1a1a] px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#f5e6c8]/20 flex items-center justify-center">
            <Coffee size={16} className="text-[#f5e6c8]" />
          </div>
          <div>
            <h1 className="text-[#f5e6c8] font-medium text-sm leading-none">
              {process.env.NEXT_PUBLIC_RESTAURANT_NAME || 'Menu Admin'}
            </h1>
            <p className="text-[#a09070] text-[10px] mt-0.5">Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5e6c8]/10 text-[#f5e6c8] text-xs hover:bg-[#f5e6c8]/20 transition"
          >
            <QrCode size={13} /> QR Code
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-700 text-stone-300 text-xs hover:bg-stone-600 transition"
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Stats */}
        <StatsBar items={items} />

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-4 mt-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search items…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filterCat === cat
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={fetchItems}
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 transition"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-[#f5e6c8] rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              <Plus size={15} /> Add item
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <div className="text-3xl mb-2">🍽️</div>
              <p className="text-sm">No items found</p>
              <button onClick={openAdd} className="mt-3 text-xs text-stone-600 underline">
                Add your first item
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Item</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr
                    key={item._id}
                    className={`border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors ${
                      !item.available ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl w-7 text-center">{item.emoji}</span>
                        <div>
                          <div className="font-medium text-stone-900 text-sm">{item.name}</div>
                          <div className="text-xs text-stone-400 truncate max-w-[200px]">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-stone-100 text-stone-600 font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-900">
                      ETB {item.price}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvail(item)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                          item.available
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {item.available ? <Eye size={11} /> : <EyeOff size={11} />}
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteItem(item)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-xs text-stone-400 mt-3 text-right">
          {filtered.length} of {items.length} items
        </p>
      </main>

      {showModal && (
        <ItemModal
          item={editingItem}
          onClose={() => { setShowModal(false); setEditingItem(null) }}
          onSaved={onSaved}
        />
      )}
      {showQR && <QRModal onClose={() => setShowQR(false)} />}
    </div>
  )
}
