import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import MenuItem from '@/lib/models/MenuItem'

// PUT /api/items/[id] - update item
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const body = await req.json()

    const updated = await MenuItem.findByIdAndUpdate(
      params.id,
      {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.emoji !== undefined && { emoji: body.emoji }),
        ...(body.category !== undefined && { category: body.category.trim() }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.available !== undefined && { available: body.available }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.order !== undefined && { order: body.order }),
      },
      { new: true }
    )

    if (!updated) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

    return NextResponse.json({ ...updated.toObject(), _id: updated._id.toString() })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/items/[id] - delete item
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const deleted = await MenuItem.findByIdAndDelete(params.id)
    if (!deleted) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
