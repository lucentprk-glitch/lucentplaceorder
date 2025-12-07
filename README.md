# Lucent's Resto - Staff Order Management System

A modern, staff-only hotel order management app built with React, Vite, and Express. Designed for efficient order taking, kitchen integration, and order tracking.

## Features

### 🛒 Order Creation
- Browse the RestoVersion menu by category (Soups, Salads, Starters, Breads, Gravy/Curry, Chinese, Rice Special, Malnad Special)
- Search menu items in real-time
- Add items to cart with quantity controls
- Persistent cart across navigation
- Capture guest details (name, room number, special requests, dining option, payment mode)

### 📋 Order Management
- View all orders with filtering by date, status, and room number
- Search orders by order number, guest name, or room number
- Real-time order status tracking (New → Preparing → Ready → Served → Completed)
- Payment status tracking (Not Paid, Paid, Partial)
- CSV export for daily auditing

### ✏️ Order Modification
- Add items to existing orders
- Update order status
- Record payment information
- Order history tracking

### 🍽️ Operations
- Print restaurant-style bills (auto-opens print dialog)
- Send orders to kitchen via WhatsApp (integrated with Twilio)
- View order history and modifications

### 🎨 Modern UI
- Dark theme with gold accents matching RestoVersion PDF
- Fully responsive (mobile, tablet, desktop)
- Intuitive navigation
- Real-time feedback

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS 3 (styling)
- Radix UI (components)
- React Router 6 (navigation)

**Backend:**
- Express.js
- In-memory storage (extensible to database)
- REST API with authentication

## Getting Started

### Prerequisites
- Node.js 18+ or pnpm 10+

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The app will be available at `http://localhost:8080`

## Project Structure

```
client/
├── pages/
│   ├── Index.tsx          # Homepage with quick actions
│   ├── Menu.tsx           # Menu browsing and order creation
│   ├── Orders.tsx         # Orders list with filters
│   └── OrderDetail.tsx    # Order detail and management
├── components/ui/         # Pre-built Radix UI components
├── lib/                   # Utility functions
├── App.tsx                # Route definitions
└── global.css             # TailwindCSS theme (dark + gold)

server/
├── index.ts               # Express server and API routes
└── routes/                # Route handlers

shared/
├── menu.ts                # Menu data structure
└── api.ts                 # Shared API types
```

## API Endpoints

All endpoints require `x-passphrase: letmein` header or `?pass=letmein` query parameter.

### Orders

```
POST   /api/orders                    # Create new order
GET    /api/orders                    # List orders (filters: date, status, room_no)
GET    /api/orders/:id                # Get order details
PUT    /api/orders/:id                # Update order (status, payment_status, notes)
POST   /api/orders/:id/items          # Add items to existing order
POST   /api/orders/:id/send-whatsapp  # Send order to kitchen
GET    /api/orders/:id/print          # Get print-ready HTML bill
GET    /api/export/csv?date=YYYY-MM-DD # Export orders as CSV
```

### Example Requests

**Create Order:**
```javascript
POST /api/orders
{
  "guest_name": "John Doe",
  "room_no": "203",
  "notes": "No onion",
  "menu_version": "RestoVersion",
  "items": [
    {
      "item_key": "soup_01",
      "name": "Baby Corn Soup",
      "price": 100,
      "qty": 1
    }
  ]
}
```

**Add Items to Order:**
```javascript
POST /api/orders/:id/items
{
  "items": [
    {
      "item_key": "curry_01",
      "name": "Paneer Tikka Masala",
      "price": 255,
      "qty": 1
    }
  ]
}
```

**Update Order:**
```javascript
PUT /api/orders/:id
{
  "status": "Preparing",
  "payment_status": "Paid",
  "notes": "Guest will pick up at 8:30 PM"
}
```

## Menu Management

The app comes pre-loaded with RestoVersion menu items. To add SnacksVersion or DrinksVersion:

1. Update `shared/menu.ts` with new menu items
2. Update the `MENU_VERSIONS` constant
3. Add new menu data array (e.g., `SNACKS_VERSION_MENU`)
4. Update the menu selector in the Menu page component

Example:
```typescript
export const SNACKS_VERSION_MENU: MenuItem[] = [
  { id: "snack_01", name: "Samosa", price: 30, category: "Fried Snacks" },
  // ... more items
];
```

## Authentication

The app uses a simple passphrase-based authentication (staff-only access). Default passphrase: `letmein`

To change the passphrase:
- Environment variable: `ADMIN_PASSPHRASE=your-secure-passphrase`
- Or update the default in `server/index.ts`

## Customization

### Theme Colors

Edit `client/global.css` to customize colors:
```css
:root {
  --background: 25 20% 12%;  /* Dark brown background */
  --primary: 38 92% 50%;     /* Gold accent */
  /* ... other colors */
}
```

Tailwind config is in `tailwind.config.ts`

### Menu Items

Edit `shared/menu.ts`:
```typescript
export const RESTO_VERSION_MENU: MenuItem[] = [
  {
    id: "unique_id",
    name: "Dish Name",
    price: 250,
    category: "Category Name",
    description: "Optional description"
  },
  // ... more items
];
```

## Deployment

### Option 1: Netlify
1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist/spa`

### Option 2: Vercel
1. Import GitHub repo to Vercel
2. Auto-detected build settings work fine

### Option 3: Self-hosted (Node)
1. Build: `npm run build`
2. Start: `npm start`
3. Deploy to your server (Heroku, DigitalOcean, etc.)

## WhatsApp Integration (Optional)

To enable kitchen notifications via WhatsApp:

1. Sign up for [Twilio](https://www.twilio.com)
2. Set environment variables:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_FROM=whatsapp:+1415...
   KITCHEN_WHATSAPP_TO=whatsapp:+91...
   ```
3. The "Send to Kitchen" button will now send WhatsApp messages

## Future Enhancements

- [ ] Database integration (SQLite, PostgreSQL)
- [ ] User authentication (staff login)
- [ ] Kitchen display system (KDS)
- [ ] Real-time order notifications
- [ ] Analytics dashboard
- [ ] Multiple restaurant locations
- [ ] Inventory management
- [ ] Customer preferences/history

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

© 2024 Lucent's Resto. All rights reserved.

## Support

For issues or questions, refer to the code comments or contact the development team.
