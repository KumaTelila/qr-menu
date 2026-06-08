import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IMenuItem extends Document {
  name: string
  description: string
  emoji: string
  category: string
  price: number
  available: boolean
  imageUrl?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    emoji: { type: String, default: '🍽️' },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    imageUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Prevent model recompilation during hot-reload in dev
const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem ||
  mongoose.model<IMenuItem>('MenuItem', MenuItemSchema)

export default MenuItem
