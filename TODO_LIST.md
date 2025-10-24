# PrepFlow Unified Project - TODO List

## 🎯 **Phase 1: Foundation Setup (Week 1)**

### **1.1 Project Structure Setup**

- [ ] **Create unified Next.js project structure**
  - [ ] Set up new Next.js 15 project with App Router
  - [ ] Configure TypeScript and ESLint
  - [ ] Set up Tailwind CSS with existing design system
  - [ ] Configure environment variables

- [ ] **Migrate existing landing page**
  - [ ] Copy landing page content to new structure
  - [ ] Migrate existing components (UI, variants, analytics)
  - [ ] Update imports and file paths
  - [ ] Test landing page functionality

- [ ] **Set up Supabase integration**
  - [ ] Install Supabase dependencies
  - [ ] Configure Supabase client
  - [ ] Set up environment variables
  - [ ] Test database connection

### **1.2 Authentication System**

- [ ] **Create authentication pages**
  - [ ] Login page (`/app/login/page.tsx`)
  - [ ] Register page (`/app/register/page.tsx`)
  - [ ] Email verification page (`/app/verify-email/page.tsx`)
  - [ ] Password reset page (`/app/reset-password/page.tsx`)

- [ ] **Implement authentication API routes**
  - [ ] `/api/auth/register` - User registration
  - [ ] `/api/auth/login` - User login
  - [ ] `/api/auth/verify-email` - Email verification
  - [ ] `/api/auth/resend-verification` - Resend verification email
  - [ ] `/api/auth/forgot-password` - Password reset request
  - [ ] `/api/auth/reset-password` - Password reset

- [ ] **Create authentication components**
  - [ ] Login form component
  - [ ] Register form component
  - [ ] Email verification component
  - [ ] Password reset component

- [ ] **Set up authentication context**
  - [ ] Create AuthProvider component
  - [ ] Implement useAuth hook
  - [ ] Add session management
  - [ ] Handle token storage

### **1.3 Database Schema Updates**

- [ ] **Update users table**
  - [ ] Add subscription fields (status, expires, stripe_customer_id)
  - [ ] Add email verification fields (token, expires, sent_at)
  - [ ] Add password reset fields (token, expires)
  - [ ] Add security fields (failed_attempts, locked_until)

- [ ] **Create business tables**
  - [ ] Ingredients table (id, user_id, name, brand, cost, etc.)
  - [ ] Recipes table (id, user_id, name, yield, instructions, etc.)
  - [ ] Recipe_ingredients table (recipe_id, ingredient_id, quantity, unit)
  - [ ] Menu_dishes table (id, user_id, name, recipe_id, price, etc.)

- [ ] **Set up database relationships**
  - [ ] Foreign key constraints
  - [ ] Indexes for performance
  - [ ] Data validation triggers

---

## 🚀 **Phase 2: Core Features (Week 2)**

### **2.1 Paywall Implementation**

- [ ] **Set up Stripe integration**
  - [ ] Install Stripe dependencies
  - [ ] Configure Stripe client
  - [ ] Set up webhook handling
  - [ ] Test payment processing

- [ ] **Create subscription management**
  - [ ] Subscription plans configuration
  - [ ] Payment processing API routes
  - [ ] Subscription status checking
  - [ ] Payment failure handling

- [ ] **Implement paywall components**
  - [ ] Subscription check middleware
  - [ ] Paywall overlay component
  - [ ] Upgrade prompts
  - [ ] Subscription management UI

### **2.2 Dashboard Foundation**

- [ ] **Create protected dashboard area**
  - [ ] Dashboard layout component
  - [ ] Navigation component
  - [ ] Sidebar/menu component
  - [ ] User profile component

- [ ] **Implement dashboard pages**
  - [ ] Main dashboard (`/app/dashboard/page.tsx`)
  - [ ] User settings (`/app/dashboard/settings/page.tsx`)
  - [ ] Subscription management (`/app/dashboard/subscription/page.tsx`)

- [ ] **Add dashboard API routes**
  - [ ] `/api/dashboard/stats` - User statistics
  - [ ] `/api/dashboard/profile` - User profile management
  - [ ] `/api/dashboard/subscription` - Subscription management

---

## 🏗️ **Phase 3: Webapp Features (Week 3)**

### **3.1 Ingredients Management**

- [ ] **Create ingredients pages**
  - [ ] Ingredients list page (`/app/dashboard/ingredients/page.tsx`)
  - [ ] Add ingredient page (`/app/dashboard/ingredients/add/page.tsx`)
  - [ ] Edit ingredient page (`/app/dashboard/ingredients/[id]/edit/page.tsx`)

- [ ] **Implement ingredients API**
  - [ ] `/api/ingredients` - CRUD operations
  - [ ] `/api/ingredients/search` - Search functionality
  - [ ] `/api/ingredients/import` - Bulk import

- [ ] **Create ingredients components**
  - [ ] Ingredients table component
  - [ ] Add/edit ingredient form
  - [ ] Ingredients search component
  - [ ] Ingredients import component

### **3.2 Recipe Management**

- [ ] **Create recipe pages**
  - [ ] Recipes list page (`/app/dashboard/recipes/page.tsx`)
  - [ ] Add recipe page (`/app/dashboard/recipes/add/page.tsx`)
  - [ ] Edit recipe page (`/app/dashboard/recipes/[id]/edit/page.tsx`)
  - [ ] Recipe detail page (`/app/dashboard/recipes/[id]/page.tsx`)

- [ ] **Implement recipe API**
  - [ ] `/api/recipes` - CRUD operations
  - [ ] `/api/recipes/[id]/ingredients` - Recipe ingredients
  - [ ] `/api/recipes/calculate-cost` - Cost calculation

- [ ] **Create recipe components**
  - [ ] Recipe card component
  - [ ] Recipe form component
  - [ ] Ingredient selector component
  - [ ] Recipe cost calculator

### **3.3 COG Calculator**

- [ ] **Create COG calculator pages**
  - [ ] COG calculator page (`/app/dashboard/cogs/page.tsx`)
  - [ ] COG reports page (`/app/dashboard/cogs/reports/page.tsx`)

- [ ] **Implement COG API**
  - [ ] `/api/cogs/calculate` - Cost calculation
  - [ ] `/api/cogs/reports` - Generate reports
  - [ ] `/api/cogs/export` - Export data

- [ ] **Create COG components**
  - [ ] COG calculator form
  - [ ] Cost breakdown component
  - [ ] Profit margin calculator
  - [ ] COG reports component

---

## 📱 **Phase 4: Mobile Preparation (Week 4)**

### **4.1 Universal Components**

- [ ] **Create platform-agnostic components**
  - [ ] Universal Button component
  - [ ] Universal Input component
  - [ ] Universal Card component
  - [ ] Universal Modal component

- [ ] **Implement platform detection**
  - [ ] Create usePlatform hook
  - [ ] Platform-specific styling
  - [ ] Touch-friendly interfaces
  - [ ] Responsive design system

### **4.2 PWA Implementation**

- [ ] **Set up Progressive Web App**
  - [ ] Configure PWA manifest
  - [ ] Implement service worker
  - [ ] Add offline functionality
  - [ ] Enable app installation

- [ ] **Mobile optimization**
  - [ ] Touch-friendly UI
  - [ ] Mobile navigation
  - [ ] Responsive layouts
  - [ ] Performance optimization

### **4.3 React Native Preparation**

- [ ] **Set up React Native structure**
  - [ ] Create mobile directory
  - [ ] Configure Expo project
  - [ ] Set up shared components
  - [ ] Configure navigation

- [ ] **Migrate components to React Native**
  - [ ] Convert web components to React Native
  - [ ] Implement mobile-specific UI
  - [ ] Add native functionality
  - [ ] Test on mobile devices

---

## 🧪 **Phase 5: Testing & Quality Assurance**

### **5.1 Unit Testing**

- [ ] **Set up testing framework**
  - [ ] Configure Jest
  - [ ] Set up React Testing Library
  - [ ] Configure test environment
  - [ ] Add test utilities

- [ ] **Write unit tests**
  - [ ] Test authentication functions
  - [ ] Test API endpoints
  - [ ] Test component rendering
  - [ ] Test business logic

### **5.2 Integration Testing**

- [ ] **Test authentication flows**
  - [ ] Registration flow
  - [ ] Login flow
  - [ ] Email verification flow
  - [ ] Password reset flow

- [ ] **Test payment flows**
  - [ ] Subscription creation
  - [ ] Payment processing
  - [ ] Webhook handling
  - [ ] Subscription management

### **5.3 E2E Testing**

- [ ] **Set up E2E testing**
  - [ ] Configure Playwright
  - [ ] Set up test environment
  - [ ] Create test scenarios
  - [ ] Add visual testing

- [ ] **Write E2E tests**
  - [ ] User registration flow
  - [ ] Dashboard functionality
  - [ ] Payment flows
  - [ ] Mobile responsiveness

---

## 🚀 **Phase 6: Deployment & Launch**

### **6.1 Production Setup**

- [ ] **Configure production environment**
  - [ ] Set up production database
  - [ ] Configure production API keys
  - [ ] Set up monitoring
  - [ ] Configure backups

- [ ] **Deploy to production**
  - [ ] Deploy to Vercel
  - [ ] Configure custom domain
  - [ ] Set up SSL certificates
  - [ ] Configure CDN

### **6.2 Mobile Deployment**

- [ ] **Prepare mobile apps**
  - [ ] Build iOS app
  - [ ] Build Android app
  - [ ] Configure app store listings
  - [ ] Set up app store accounts

- [ ] **Deploy mobile apps**
  - [ ] Submit to App Store
  - [ ] Submit to Google Play
  - [ ] Configure app analytics
  - [ ] Set up crash reporting

---

## 📊 **Phase 7: Analytics & Monitoring**

### **7.1 Analytics Setup**

- [ ] **Configure analytics**
  - [ ] Set up user analytics
  - [ ] Configure conversion tracking
  - [ ] Set up A/B testing
  - [ ] Configure performance monitoring

- [ ] **Implement tracking**
  - [ ] User behavior tracking
  - [ ] Feature usage tracking
  - [ ] Error tracking
  - [ ] Performance tracking

### **7.2 Monitoring & Alerts**

- [ ] **Set up monitoring**
  - [ ] Configure error monitoring
  - [ ] Set up performance monitoring
  - [ ] Configure uptime monitoring
  - [ ] Set up alerting

---

## 🎯 **Priority Matrix**

### **High Priority (Must Have)**

- [ ] Authentication system
- [ ] Paywall implementation
- [ ] Basic dashboard
- [ ] Ingredients management
- [ ] Recipe management
- [ ] COG calculator

### **Medium Priority (Should Have)**

- [ ] Advanced analytics
- [ ] Mobile optimization
- [ ] PWA features
- [ ] Advanced reporting
- [ ] Data export

### **Low Priority (Nice to Have)**

- [ ] React Native app
- [ ] Advanced A/B testing
- [ ] Social features
- [ ] API integrations
- [ ] Advanced customization

---

## 📋 **Daily Tasks**

### **Day 1-2: Project Setup**

- [ ] Create unified project structure
- [ ] Set up development environment
- [ ] Configure dependencies
- [ ] Set up version control

### **Day 3-4: Authentication**

- [ ] Implement authentication system
- [ ] Create auth pages
- [ ] Set up email verification
- [ ] Test auth flows

### **Day 5-7: Paywall**

- [ ] Integrate Stripe
- [ ] Implement subscription management
- [ ] Create paywall components
- [ ] Test payment flows

---

_This TODO list will be updated as we progress through the project._
