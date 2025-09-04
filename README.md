# PrepFlow WebApp - Restaurant Management SaaS

A secure, mobile-first, subscription-based online tool for restaurant and pub owners. Each subscriber has a personalized dashboard and dedicated storage for their data, including editable stock lists, a Cost of Goods (COG) calculator, and an automated recipe management system.

## 🚀 Features

### Core Features
- **User Authentication & Subscription Portal**
  - Secure user registration and login
  - Stripe integration for subscription management
  - Admin panel with user impersonation
  - Multi-tenant data isolation

- **Personalized Dashboard**
  - Key metrics (average GP, food cost %, profit margins)
  - Interactive charts and graphs
  - Popularity vs. Profitability matrix
  - Contributing Profit Margin analysis

- **Stock List Management**
  - CRUD operations for ingredients
  - Advanced filtering and sorting
  - Waste and yield calculations
  - Supplier and storage tracking

- **Recipe Management**
  - Recipe creation with ingredient linking
  - COG calculation automation
  - Yield scaling capabilities
  - Cooking method generation

- **Menu Analysis**
  - Menu dish performance tracking
  - Sales data integration
  - Profit optimization insights
  - Pricing recommendations

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT with bcrypt
- **Payments**: Stripe
- **Email**: Nodemailer
- **Deployment**: Vercel
- **Testing**: Jest + Supertest

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn
- Stripe account
- Email service (Gmail, SendGrid, etc.)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd prepflow-webapp
npm install
```

### 2. Environment Configuration
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/prepflow_webapp

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb prepflow_webapp

# Run migrations
npm run db:migrate
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Subscription Endpoints
- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/create` - Create subscription
- `POST /api/subscriptions/cancel` - Cancel subscription

### Ingredients Endpoints
- `GET /api/ingredients` - List ingredients
- `POST /api/ingredients` - Create ingredient
- `PUT /api/ingredients/:id` - Update ingredient
- `DELETE /api/ingredients/:id` - Delete ingredient

### Recipes Endpoints
- `GET /api/recipes` - List recipes
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/:id` - Update recipe
- `POST /api/recipes/:id/calculate-cogs` - Calculate COGS

### Dashboard Endpoints
- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/dashboard/charts` - Get chart data

### Admin Endpoints
- `GET /api/admin/users` - List all users
- `POST /api/admin/impersonate/:userId` - Start impersonation
- `DELETE /api/admin/impersonate` - End impersonation

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```bash
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
STRIPE_SECRET_KEY=your-production-stripe-key
NODE_ENV=production
```

## 🔐 Security Features

- **JWT Authentication** with secure token management
- **Password Hashing** using bcrypt with 12 rounds
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configurable origins
- **Helmet.js** for security headers
- **Input Validation** using Joi schemas
- **SQL Injection Protection** using parameterized queries
- **Admin Impersonation** with audit logging

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and profiles
- `subscriptions` - Stripe subscription data
- `ingredients` - Stock list items
- `recipes` - Recipe definitions
- `recipe_items` - Recipe-ingredient relationships
- `menu_dishes` - Menu items with pricing
- `sales_data` - Sales tracking
- `impersonation_logs` - Admin action audit

## 🔧 Development

### Project Structure
```
src/
├── api/           # API route handlers
├── config/       # Configuration files
├── middleware/    # Express middleware
├── models/        # Database models
├── services/      # Business logic
├── utils/         # Utility functions
└── scripts/       # Database scripts
```

### Code Style
- ESLint configuration included
- Consistent error response format
- Comprehensive logging
- Type checking with JSDoc

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Email: support@prepflow.org
- Documentation: [Coming Soon]
- Issues: GitHub Issues

## 🔄 Roadmap

### Phase 2 Features
- [ ] Import/Export functionality
- [ ] Dark/Light mode themes
- [ ] On-device AI integration
- [ ] AI specials creator
- [ ] Advanced inventory management
- [ ] Workflow tools (cleaning rosters, temperature logs)
- [ ] Mobile app companion
- [ ] Multi-location support

---

**Built with ❤️ for restaurant owners worldwide**
