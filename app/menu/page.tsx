import connectDB from '@/lib/db'
import MenuItem from '@/lib/models/MenuItem'
import MenuClient from '@/components/MenuClient'

async function getMenuItems() {
  await connectDB()
  const items = await MenuItem.find({}).sort({ category: 1, order: 1 }).lean()
  // Convert mongoose docs to plain objects
  return items.map((item: any) => ({
    _id: item._id.toString(),
    name: item.name,
    description: item.description,
    emoji: item.emoji,
    category: item.category,
    price: item.price,
    available: item.available,
    imageUrl: item.imageUrl || '',
    order: item.order,
  }))
}

export const revalidate = 30 // revalidate every 30 seconds

export default async function MenuPage() {
  const items = await getMenuItems()
  const restaurantName = process.env.NEXT_PUBLIC_RESTAURANT_NAME || 'Our Menu'
  const tagline = process.env.NEXT_PUBLIC_RESTAURANT_TAGLINE || ''

  return (
    <MenuClient
      items={items}
      restaurantName={restaurantName}
      tagline={tagline}
    />
  )
}
