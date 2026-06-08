import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import MenuItem from '@/lib/models/MenuItem'

export async function GET() {
  try {
    await connectDB()
    const items = await MenuItem.find({}).sort({ category: 1, order: 1 }).lean()
    const plain = items.map((item: any) => ({
      _id: item._id.toString(),
      name: item.name,
      description: item.description,
      emoji: item.emoji,
      category: item.category,
      price: item.price,
      available: item.available,
      imageUrl: item.imageUrl || '',
    }))
    return NextResponse.json(plain)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}
