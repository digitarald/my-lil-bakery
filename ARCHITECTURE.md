# Favorites Feature - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────┐     ┌────────────────┐     ┌─────────────┐│
│  │   Homepage     │     │ Favorites Page │     │Auth Dropdown││
│  │  /app/page.tsx │     │/app/favorites/ │     │  Menu Item  ││
│  │                │     │   page.tsx     │     │             ││
│  │ • Product Grid │     │ • Favorite Grid│     │ "My         ││
│  │ • Heart Icons  │     │ • Empty State  │     │  Favorites" ││
│  │ • Real-time    │     │ • Add to Cart  │     │             ││
│  │   Updates      │     │                │     │             ││
│  └────────┬───────┘     └────────┬───────┘     └─────────────┘│
│           │                      │                             │
│           └──────────┬───────────┘                             │
│                      │                                         │
│              ┌───────▼────────┐                                │
│              │ FavoriteButton │                                │
│              │   Component    │                                │
│              │ • Heart Icon   │                                │
│              │ • Toast msgs   │                                │
│              │ • Auth check   │                                │
│              └───────┬────────┘                                │
└──────────────────────┼─────────────────────────────────────────┘
                       │
                       │ HTTP Requests
                       │
┌──────────────────────▼─────────────────────────────────────────┐
│                        API LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │         GET /api/favorites                             │   │
│  │         • Returns user's favorites                     │   │
│  │         • Optional ?idsOnly=true                       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │         POST /api/favorites                            │   │
│  │         • Body: { productId }                          │   │
│  │         • Adds to favorites                            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │         DELETE /api/favorites/[productId]              │   │
│  │         • Removes from favorites                       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│                     Auth Check: NextAuth Session                │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ Prisma ORM
                       │
┌──────────────────────▼─────────────────────────────────────────┐
│                   DATABASE LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  lib/database.ts - Favorite Operations                 │   │
│  │  ───────────────────────────────────────────           │   │
│  │  • addFavorite(userId, productId)                      │   │
│  │  • removeFavorite(userId, productId)                   │   │
│  │  • getFavoritesByUser(userId)                          │   │
│  │  • isFavorite(userId, productId)                       │   │
│  │  • getUserFavoriteIds(userId)                          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ SQL Queries
                       │
┌──────────────────────▼─────────────────────────────────────────┐
│                   DATABASE (SQLite)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────────┐ │
│  │    User      │    │   Favorite   │    │    Product      │ │
│  ├──────────────┤    ├──────────────┤    ├─────────────────┤ │
│  │ id (PK)      │◄──┐│ id (PK)      │┌──►│ id (PK)         │ │
│  │ name         │   ││ userId (FK)  ││   │ name            │ │
│  │ email        │   │└──────────────┘│   │ price           │ │
│  │ role         │   │  productId(FK) │   │ categoryId (FK) │ │
│  │ ...          │   │  createdAt     │   │ ...             │ │
│  └──────────────┘   └────────────────┘   └─────────────────┘ │
│                                                                 │
│  Unique Index: (userId, productId)                             │
│  Cascade Delete: ON DELETE CASCADE for both FKs                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Adding a Favorite
```
User clicks heart → FavoriteButton → POST /api/favorites
                                            ↓
                                    Check authentication
                                            ↓
                                    addFavorite(userId, productId)
                                            ↓
                                    INSERT INTO Favorite
                                            ↓
                                    Return success + product data
                                            ↓
                                    Update UI (filled heart)
                                            ↓
                                    Show toast: "Added to favorites"
```

### Removing a Favorite
```
User clicks filled heart → FavoriteButton → DELETE /api/favorites/[id]
                                                    ↓
                                            Check authentication
                                                    ↓
                                            removeFavorite(userId, productId)
                                                    ↓
                                            DELETE FROM Favorite WHERE...
                                                    ↓
                                            Return success
                                                    ↓
                                            Update UI (empty heart)
                                                    ↓
                                            Show toast: "Removed from favorites"
```

### Loading Favorites
```
User visits /favorites → FavoritesPage → GET /api/favorites
                                                ↓
                                        Check authentication
                                                ↓
                                        getFavoritesByUser(userId)
                                                ↓
                                        SELECT * FROM Favorite
                                          JOIN Product...
                                                ↓
                                        Return favorites with product data
                                                ↓
                                        Render product grid
```

## Security Flow

```
                    ┌─────────────┐
                    │   Request   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Check Auth  │
                    │  (Session)  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
              NO    │ Authenticated│    YES
        ┌───────────┤      ?       ├──────────┐
        │           └──────────────┘          │
        │                                     │
┌───────▼────────┐                  ┌─────────▼─────────┐
│ Return 401     │                  │ Verify user owns  │
│ Unauthorized   │                  │ resources         │
└────────────────┘                  └─────────┬─────────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │ Execute DB        │
                                    │ Operation         │
                                    └─────────┬─────────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │ Return Success    │
                                    └───────────────────┘
```

## Component Hierarchy

```
HomePage
  ├── Header
  │     └── AuthButton
  │           └── Dropdown Menu
  │                 └── "My Favorites" Link → /favorites
  │
  ├── Product Grid
  │     └── Product Cards
  │           ├── Product Image
  │           ├── FavoriteButton ★
  │           ├── Product Details
  │           └── Add to Cart Button
  │
  └── Footer

FavoritesPage
  ├── Back to Shop Button
  ├── Header with Count
  └── Favorites Grid
        └── Product Cards
              ├── Product Image
              ├── FavoriteButton ★
              ├── Product Details
              └── Add to Cart Button

FavoriteButton (Reusable)
  ├── Heart Icon (empty/filled)
  ├── Click Handler
  │     ├── Auth Check
  │     ├── API Call
  │     ├── State Update
  │     └── Toast Notification
  └── Loading State
```

## State Management

```
HomePage State:
  - products: ProductWithCategory[]
  - favoriteIds: Set<string>
  - loading: boolean

FavoritesPage State:
  - favorites: FavoriteWithProduct[]
  - loading: boolean

FavoriteButton State:
  - isFavorited: boolean
  - isLoading: boolean

Flow:
  User Action → Component State → API Call → Database → 
  API Response → Component State → UI Update → User Feedback
```

## Technology Stack

```
Frontend:
  - React 19
  - Next.js 15
  - TypeScript
  - Tailwind CSS
  - Lucide Icons

Backend:
  - Next.js API Routes
  - NextAuth.js (Authentication)
  - Prisma ORM

Database:
  - SQLite
  - Prisma Schema

Testing:
  - Jest
  - React Testing Library
  - MSW (for API mocking)
```
