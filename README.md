# QR Menu — Digital Menu System for Cafés & Restaurants

A full-stack Next.js 14 application for managing and displaying your restaurant's digital menu via QR code. No app download required for customers.

---

## Features

- **Customer menu page** — Mobile-first, beautiful UI accessible via QR code scan
- **Admin dashboard** — Add, edit, delete items, toggle availability in real-time
- **QR Code generator** — Print-ready QR code for your tables
- **Live updates** — Menu refreshes every 30 seconds automatically
- **Authentication** — Password-protected admin panel
- **Categories** — Group items by category with live filter pills
- **Image support** — Link to hosted images (Cloudinary recommended)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | MongoDB (via Mongoose) |
| Auth | NextAuth.js (Credentials) |
| Styling | Tailwind CSS |
| QR Code | qrcode.react |
| Icons | Lucide React |
| Toasts | react-hot-toast |

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd qr-menu
npm install
```

### 2. Set up MongoDB (free)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a free **M0** cluster
3. Under **Database Access**, create a user with password
4. Under **Network Access**, add `0.0.0.0/0` (allow all IPs)
5. Click **Connect → Drivers** and copy the connection string

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/qrmenu

NEXTAUTH_SECRET=any-random-string-at-least-32-chars
NEXTAUTH_URL=http://localhost:3000

ADMIN_EMAIL=admin@yourbusiness.com
ADMIN_PASSWORD=your-secure-password

NEXT_PUBLIC_MENU_URL=http://localhost:3000/menu
NEXT_PUBLIC_RESTAURANT_NAME=Your Cafe Name
NEXT_PUBLIC_RESTAURANT_TAGLINE=Coffee & Food
```

### 4. Seed sample data (optional)

```bash
npx ts-node --skip-project lib/seed.ts
```

### 5. Run development server

```bash
npm run dev
```

Open:
- **Customer menu**: http://localhost:3000/menu
- **Admin dashboard**: http://localhost:3000/admin/dashboard

---

## Project Structure

```
qr-menu/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Redirects to /menu
│   ├── menu/
│   │   └── page.tsx            # Customer menu (public)
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout with SessionProvider
│   │   ├── page.tsx            # Redirects to dashboard
│   │   ├── login/page.tsx      # Login form
│   │   └── dashboard/page.tsx  # Full admin dashboard
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── menu/route.ts       # GET all items (public)
│       └── items/
│           ├── route.ts        # GET all, POST new (admin)
│           └── [id]/route.ts   # PUT, DELETE single item (admin)
├── components/
│   ├── MenuClient.tsx          # Customer menu UI (client)
│   ├── ItemModal.tsx           # Add/Edit item modal
│   ├── QRModal.tsx             # QR code display & print
│   └── StatsBar.tsx            # Dashboard stats cards
├── lib/
│   ├── db.ts                   # MongoDB connection
│   ├── auth.ts                 # NextAuth options
│   ├── seed.ts                 # Sample data seeder
│   └── models/
│       └── MenuItem.ts         # Mongoose model
└── middleware.ts               # Protects /admin/dashboard
```

---

## Deployment (Vercel — Recommended, free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add all environment variables from `.env.local`
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_MENU_URL` to your Vercel URL
5. Deploy!

After deployment, generate a real QR code at `/admin/dashboard` → click **QR Code** button.

---

## Customization

### Change currency
Search for `ETB` in the codebase and replace with your currency symbol.

### Add item images
In the **Add item** modal, paste any image URL. We recommend:
- [Cloudinary](https://cloudinary.com) — free image hosting with automatic optimization
- Upload images → copy the URL → paste in the "Image URL" field

### Change colors/branding
Edit `tailwind.config.js` to adjust the color scheme. The main brand colors are:
- Dark: `#1a1a1a`
- Gold: `#f5e6c8`

### Multiple admin users
Replace the simple credential check in `lib/auth.ts` with a User model in MongoDB and bcrypt password hashing.

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/menu` | Public | Fetch all items |
| GET | `/api/items` | Admin | Fetch all items (with more detail) |
| POST | `/api/items` | Admin | Create new item |
| PUT | `/api/items/:id` | Admin | Update item (any field) |
| DELETE | `/api/items/:id` | Admin | Delete item |

---

## License

MIT — use freely for your business.
