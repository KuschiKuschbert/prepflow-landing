# PrepFlow Kitchen Management WebApp

A comprehensive kitchen management system built with Next.js 15 and Supabase, designed for restaurant owners to manage ingredients, create recipes, and calculate COGS (Cost of Goods Sold).

## 🚀 Features

### ✅ Completed Features

- **Dashboard**: Overview with statistics and quick actions
- **Ingredients Management**: Full CRUD operations for ingredient database
- **Recipe Management**: Create, edit, and manage recipes with ingredient lists
- **COGS Calculator**: Calculate food costs, labor, overhead, and optimal pricing
- **Menu Dishes**: Save calculated recipes as menu items with pricing
- **Real-time Database**: Supabase PostgreSQL with real-time updates
- **Responsive Design**: Mobile-first design with Tailwind CSS

### 🔄 Current Status

- **Single-user MVP**: No authentication required for testing
- **Database**: Pre-configured with sample data
- **Server**: Running on localhost:3000
- **Ready for**: PWA implementation and deployment

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.5.2 with React 19
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS 4
- **TypeScript**: Full type safety
- **Deployment**: Ready for Vercel

## 📊 Database Schema

### Tables Created
- `ingredients` - Ingredient database with costs, waste, and yield percentages
- `recipes` - Recipe definitions with yield and instructions
- `recipe_ingredients` - Junction table linking recipes to ingredients
- `menu_dishes` - Menu items with pricing and profit margins

### Sample Data Included
- 5 sample ingredients (tomatoes, onions, garlic, olive oil, salt)
- 2 sample recipes (tomato sauce, pasta carbonara)
- Recipe ingredients relationships
- Sample menu dishes with pricing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd prepflow-webapp-nextjs
   npm install
   ```

2. **Set up environment variables**:
   Create `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Set up database**:
   Run the SQL commands from `database-setup.sql` in your Supabase SQL editor

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**:
   Navigate to `http://localhost:3000`

## 📱 Usage

### 1. Dashboard
- View statistics: total ingredients, recipes, menu dishes
- Quick access to all features
- Getting started guide

### 2. Ingredients Management
- Add/edit/delete ingredients
- Track costs, waste percentages, yield
- Supplier and storage information
- Search and filter capabilities

### 3. Recipe Creation
- Create recipes with yield and instructions
- Add ingredients with quantities
- Real-time cost calculation
- Prep and cook time tracking

### 4. COGS Calculator
- Select recipe for cost analysis
- Add labor and overhead costs
- Set target profit margins
- Calculate optimal selling prices
- Save as menu dishes

## 🎯 Next Steps

### Phase 2: PWA & Offline Support
- [ ] Progressive Web App configuration
- [ ] Service worker for offline functionality
- [ ] IndexedDB for local storage
- [ ] Background sync capabilities

### Phase 3: Authentication & Multi-user
- [ ] Supabase Auth integration
- [ ] User registration/login
- [ ] Multi-tenant data isolation
- [ ] Role-based permissions

### Phase 4: Advanced Features
- [ ] Inventory management
- [ ] Supplier integration
- [ ] Advanced reporting
- [ ] Mobile app (React Native)

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx        # Dashboard
│   ├── ingredients/    # Ingredients management
│   ├── recipes/        # Recipe management
│   └── cogs/          # COGS calculator
├── lib/
│   └── supabase.ts    # Database client and types
└── globals.css        # Global styles
```

### Key Files
- `src/lib/supabase.ts` - Database configuration and TypeScript types
- `database-setup.sql` - Complete database schema with sample data
- `src/app/layout.tsx` - Navigation and layout
- `src/app/page.tsx` - Dashboard with statistics

## 📈 Performance

- **Build Size**: Optimized with Next.js 15
- **Loading**: Skeleton loading states
- **Database**: Indexed queries for performance
- **Responsive**: Mobile-first design
- **TypeScript**: Full type safety

## 🚀 Deployment

Ready for deployment to Vercel:

1. **Connect to Vercel**:
   ```bash
   npx vercel --prod
   ```

2. **Set environment variables** in Vercel dashboard

3. **Configure custom domain**: `app.prepflow.com`

## 📞 Support

This is a single-user MVP designed for testing and development. The system is ready for:
- Multi-user authentication
- Subscription tiers
- Advanced features
- Mobile app development

---

**Built with ❤️ for restaurant owners who want to optimize their kitchen operations and maximize profits.**