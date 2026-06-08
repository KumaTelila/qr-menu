/**
 * Run this once to populate your database with sample items:
 *   npx ts-node --project tsconfig.json lib/seed.ts
 *
 * Or add a script to package.json:
 *   "seed": "npx ts-node lib/seed.ts"
 */

import connectDB from './db'
import MenuItem from './models/MenuItem'

const sampleItems = [
  { name: 'Macchiato', emoji: '☕', description: 'Ethiopian-style espresso with a touch of steamed milk', category: 'Coffee', price: 65, available: true, order: 1 },
  { name: 'Buna (Black Coffee)', emoji: '🫘', description: 'Traditional Ethiopian coffee ceremony style, rich and aromatic', category: 'Coffee', price: 50, available: true, order: 2 },
  { name: 'Cappuccino', emoji: '☕', description: 'Double shot espresso with velvety steamed foam', category: 'Coffee', price: 90, available: true, order: 3 },
  { name: 'Latte', emoji: '🥛', description: 'Smooth espresso with silky steamed milk', category: 'Coffee', price: 95, available: true, order: 4 },
  { name: 'Chai Latte', emoji: '🍵', description: 'Spiced masala tea with steamed milk', category: 'Tea', price: 75, available: true, order: 5 },
  { name: 'Mint Tea', emoji: '🌿', description: 'Fresh mint leaves steeped to perfection', category: 'Tea', price: 55, available: true, order: 6 },
  { name: 'Firfir Tibs', emoji: '🥩', description: 'Pan-fried injera strips with spiced lamb and vegetables', category: 'Food', price: 185, available: true, order: 7 },
  { name: 'Shiro', emoji: '🍲', description: 'Creamy chickpea stew, served with fresh injera', category: 'Food', price: 95, available: true, order: 8 },
  { name: 'Avocado Toast', emoji: '🥑', description: 'Sourdough toast with fresh avocado, chili flakes', category: 'Food', price: 120, available: true, order: 9 },
  { name: 'Tiramisu', emoji: '🍮', description: 'Classic Italian dessert, coffee-soaked ladyfingers', category: 'Desserts', price: 130, available: true, order: 10 },
  { name: 'Cheesecake', emoji: '🍰', description: 'New York-style, served with berry compote', category: 'Desserts', price: 145, available: true, order: 11 },
  { name: 'Fresh Mango Juice', emoji: '🥭', description: 'Cold-pressed, no added sugar', category: 'Juices', price: 85, available: true, order: 12 },
  { name: 'Avocado Juice', emoji: '🥑', description: 'Blended avocado with milk and honey', category: 'Juices', price: 90, available: true, order: 13 },
]

async function seed() {
  await connectDB()
  await MenuItem.deleteMany({})
  await MenuItem.insertMany(sampleItems)
  console.log(`✅ Seeded ${sampleItems.length} menu items`)
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
