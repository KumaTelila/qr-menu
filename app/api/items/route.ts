import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import MenuItem from '@/lib/models/MenuItem'

// GET /api/items - list all items (admin)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const items = await MenuItem.find({}).sort({ category: 1, order: 1 }).lean()
    return NextResponse.json(
      items.map((item: any) => ({
        ...item,
        _id: item._id.toString(),
      }))
    )
  } catch {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

// POST /api/items - create item (admin)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, description, emoji, category, price, available, imageUrl, order } = body

    if (!name || !category || price === undefined) {
      return NextResponse.json({ error: 'name, category, and price are required' }, { status: 400 })
    }

    await connectDB()
    const item = await MenuItem.create({
      name: name.trim(),
      description: description?.trim() || '',
      emoji: emoji || '🍽️',
      category: category.trim(),
      price: Number(price),
      available: available !== false,
      imageUrl: imageUrl || '',
      order: order || 0,
    })

    return NextResponse.json({ ...item.toObject(), _id: item._id.toString() }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
