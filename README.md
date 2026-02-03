# FoodHub - Food Ordering Application

A full-stack, production-ready food ordering application implementing **Role-Based Access Control (RBAC)** and **Relational Access Control (ReBAC)** with strict country-level data isolation.

## Overview

FoodHub is built for a restaurant management company with a clear organizational hierarchy:

- **Nick Fury** (Admin) oversees operations globally
- **Managers** operate in specific countries (India/America)
- **Team Members** work within their assigned country

The system enforces:

- **RBAC**: Different roles have different capabilities
- **ReBAC**: Managers & Members can only access data from their country
- **JWT Authentication**: Secure, token-based API access
- **MongoDB**: Modern, scalable data storage

## Tech Stack

### Frontend

- **Next.js 16** (App Router) - Modern React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Apollo Client** - GraphQL client
- **Next/Navigation** - Client-side routing

### Backend

- **NestJS** - Enterprise Node.js framework
- **GraphQL (Code-first)** - API via @nestjs/graphql
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing

## Architecture

```
backend/
  src/
    modules/
      auth/         # Login, JWT strategy
      user/         # User schemas & export
      restaurant/   # Restaurants, menu items
      order/        # Order management
      payment/      # Payment methods (Admin only)
    common/
      guards/       # JwtAuthGuard, RolesGuard, CountryGuard
      decorators/   # @CurrentUser(), @Roles()
    config/         # Database configuration
    app.module.ts   # Main application module
    main.ts         # Bootstrap

frontend/
  app/
    layout.tsx      # Root layout
    page.tsx        # Home redirect
    login/          # Login page
    dashboard/      # User dashboard
    restaurants/    # Browse restaurants
    restaurants/[id]/# Restaurant detail & menu
    orders/         # Order history
    admin/
      payments/     # Payment management (Admin only)
  components/
    layout/         # Navbar, Sidebar
    ui/             # Shared components
  graphql/          # GraphQL queries & mutations
  hooks/            # useAuth hook
  lib/              # Apollo client setup
```

## Seeded Users (Test Credentials)

All passwords are `password`.

| Name            | Email                       | Role    | Country |
| --------------- | --------------------------- | ------- | ------- |
| Nick Fury       | nick.fury@example.com       | ADMIN   | Global  |
| Captain Marvel  | captain.marvel@example.com  | MANAGER | INDIA   |
| Captain America | captain.america@example.com | MANAGER | AMERICA |
| Thanos          | thanos@example.com          | MEMBER  | INDIA   |
| Thor            | thor@example.com            | MEMBER  | INDIA   |
| Travis          | travis@example.com          | MEMBER  | AMERICA |

## RBAC Matrix

| Feature                 | Admin | Manager | Member |
| ----------------------- | ----- | ------- | ------ |
| View Restaurants & Menu | ✅    | ✅      | ✅     |
| Create Order            | ✅    | ✅      | ✅     |
| Checkout & Pay          | ✅    | ✅      | ❌     |
| Cancel Order            | ✅    | ✅      | ❌     |
| Manage Payment Methods  | ✅    | ❌      | ❌     |

## ReBAC (Country Isolation)

- **ADMIN (Nick)**: Global access to all countries
- **MANAGER**: Can view & manage only their country's data
  - Captain Marvel → India only
  - Captain America → America only
- **MEMBER**: Can view & manage only their country's data
  - Cannot access other countries' restaurants or orders

**Guards enforce this strictly:**

```typescript
// If user is not ADMIN and resource.country !== user.country
// → throw ForbiddenException
```

## Installation & Setup

### Prerequisites

- Node.js 18+
- MongoDB 5.0+ (local or cloud: MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   Create `.env`:

   ```
   DATABASE_URL=mongodb://localhost:27017/slooze
   JWT_SECRET=your-super-secret-key-change-in-production
   ```

3. **Seed database**

   ```bash
   npm run seed
   ```

   This creates:
   - 6 seeded users (as above)
   - 8 restaurants (4 per country, 2 per country shown in initial load)
   - 40 menu items (5 per restaurant)

4. **Start dev server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:4000/graphql`

### Frontend Setup

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Start dev server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

## API Contract (GraphQL)

### Queries

#### `restaurants`

Get all restaurants for logged-in user's country.

```graphql
query {
  restaurants {
    id
    name
    country
    menuItems {
      id
      name
      price
    }
  }
}
```

**Guards**: JwtAuthGuard, RolesGuard, CountryGuard

#### `restaurant(id: ID!)`

Get single restaurant.

```graphql
query {
  restaurant(id: "123") {
    id
    name
    country
    menuItems {
      id
      name
      price
    }
  }
}
```

**Guards**: JwtAuthGuard, RolesGuard, CountryGuard

### Mutations

#### `login(email: String!, password: String!)`

Login user and return JWT token.

```graphql
mutation {
  login(email: "thanos@example.com", password: "password") {
    accessToken
    user {
      id
      email
      role
      country
    }
  }
}
```

#### `createOrder(items: [OrderItemInput!]!)`

Create an order (ADMIN, MANAGER, MEMBER).

```graphql
mutation {
  createOrder(
    items: [
      { menuItemId: "123", quantity: 2 }
      { menuItemId: "456", quantity: 1 }
    ]
  ) {
    id
    status
    items {
      menuItemId
      quantity
    }
  }
}
```

**Guards**: JwtAuthGuard, RolesGuard, CountryGuard

#### `checkoutOrder(orderId: ID!)`

Checkout and pay (ADMIN, MANAGER only).

```graphql
mutation {
  checkoutOrder(orderId: "789") {
    id
    status
  }
}
```

**Guards**: JwtAuthGuard, RolesGuard (ADMIN, MANAGER only), CountryGuard

#### `cancelOrder(orderId: ID!)`

Cancel an order (ADMIN, MANAGER only).

```graphql
mutation {
  cancelOrder(orderId: "789") {
    id
    status
  }
}
```

**Guards**: JwtAuthGuard, RolesGuard (ADMIN, MANAGER only), CountryGuard

#### `addPaymentMethod(type: String!, details: String!)`

Add payment method (ADMIN only).

```graphql
mutation {
  addPaymentMethod(type: "CREDIT_CARD", details: "****1234") {
    id
    type
    details
  }
}
```

**Guards**: JwtAuthGuard, RolesGuard (ADMIN only)

## Frontend Pages

### `/login`

- Email/Password form
- Test user credentials displayed
- Stores JWT token in localStorage

### `/dashboard`

- Welcome message
- Quick stats (orders count, recent activity)
- Navigation to restaurants, orders
- Admin-only: Payment management link

### `/restaurants`

- Browse all restaurants (filtered by country)
- Click to view menu & order

### `/restaurants/[id]`

- Restaurant details
- Menu items with prices
- Add items to cart
- Cart drawer with checkout

### `/orders`

- Order history (user's country only)
- Order status (CREATED, PAID, CANCELLED)
- ADMIN/MANAGER: Checkout & cancel buttons
- MEMBER: View-only

### `/admin/payments` (Admin Only)

- Add payment methods
- List all payment methods
- Hidden from non-admins

## Guard Enforcement

### JwtAuthGuard

- Validates JWT token from `Authorization: Bearer <token>` header
- Extracts user info (id, email, role, country)
- Attaches to `req.user`

### RolesGuard

- Checks if user's role is in allowed roles
- Throws `ForbiddenException` if not authorized
- Applied via `@Roles("ADMIN", "MANAGER")` decorator

### CountryGuard

- For data access mutations/queries
- If user is ADMIN: allow global access
- If user is MANAGER/MEMBER: enforce `resource.country === user.country`
- Throws `ForbiddenException` if mismatched

## Testing

### Test Login Flow

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(email: \"thanos@example.com\", password: \"password\") { accessToken user { id role country } } }"
  }'
```

### Test Restaurants Query

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "query": "query { restaurants { id name country } }"
  }'
```

### Test RBAC (Member Cannot Checkout)

```bash
# Login as Member (Thanos)
# Try to checkout - should fail with "Insufficient privileges"
```

### Test ReBAC (Manager Cannot See Other Country)

```bash
# Login as Captain Marvel (Manager-India)
# Try to view America restaurants - should fail with "Forbidden"
```

## Key Features

✅ **Secure Authentication**: JWT tokens with expiry  
✅ **RBAC Enforcement**: Guards verify roles at each endpoint  
✅ **ReBAC Enforcement**: Country-level data isolation  
✅ **Role-Aware UI**: Conditionally show/hide features  
✅ **Clean Architecture**: Modular NestJS structure  
✅ **Professional UI**: Tailwind CSS + shadcn components  
✅ **MongoDB**: Scalable NoSQL database  
✅ **GraphQL**: Type-safe API  
✅ **Error Handling**: Meaningful error messages  
✅ **Seed Data**: Ready-to-test application

## Project Structure Compliance

✅ **NestJS + GraphQL (Code-first)**  
✅ **MongoDB + Mongoose** (Migrated from Prisma/SQLite)  
✅ **Next.js + Apollo Client**  
✅ **JWT + RBAC + ReBAC**  
✅ **Guards & Decorators**  
✅ **Seeded test users**  
✅ **Comprehensive README**  
✅ **Professional UI**  
✅ **Production-ready code**

## Troubleshooting

**MongoDB Connection Error**

- Ensure MongoDB is running: `mongod`
- Check DATABASE_URL in `.env`

**JWT Token Invalid**

- Token may be expired (24h expiry)
- Re-login to get new token

**Forbidden Access**

- Check user role and country
- MEMBER cannot checkout/cancel
- MANAGER cannot access other countries

**CORS Issues**

- Backend has `enableCors()` configured
- Frontend uses `http://localhost:4000/graphql`

## Next Steps (Optional Enhancements)

- Add email notifications
- Implement real payment gateway
- Add user registration & password reset
- Implement pagination for restaurants & orders
- Add order tracking timeline
- Implement review & ratings
- Add analytics dashboard for admins

