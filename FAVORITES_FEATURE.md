# Favorites Feature Documentation

## Overview

The favorites feature allows authenticated users to save their favorite bakery products for easy access later. Users can add or remove products from their favorites with a single click, and view all their favorites on a dedicated page.

## Features

### User-Facing Features

1. **Favorite Button on Product Cards**
   - Heart icon appears on every product card
   - Click to add/remove from favorites
   - Visual feedback (filled red heart for favorited items)
   - Works on both homepage and favorites page

2. **Favorites Page** (`/favorites`)
   - Dedicated page showing all favorited products
   - Grid layout matching the main product page
   - Empty state with helpful message
   - Direct "Add to Cart" functionality
   - Easy navigation back to shop

3. **Navigation Integration**
   - "My Favorites" menu item in user dropdown
   - Accessible from any page when logged in

### Technical Implementation

#### Database Schema

```prisma
model Favorite {
  id        String   @id @default(cuid())
  userId    String
  productId String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
}
```

**Key features:**
- Unique constraint prevents duplicate favorites
- Cascade delete maintains data integrity
- Indexed for fast lookups

#### API Routes

**GET /api/favorites**
- Returns all favorites for authenticated user
- Optional `?idsOnly=true` query param returns just product IDs
- Requires authentication (401 if not authenticated)

**POST /api/favorites**
- Adds a product to user's favorites
- Request body: `{ productId: string }`
- Returns created favorite with product details
- Prevents duplicates

**DELETE /api/favorites/[productId]**
- Removes a product from user's favorites
- Returns success status
- Requires authentication

#### Components

**FavoriteButton** (`components/favorite-button.tsx`)
- Reusable component for favorite functionality
- Props:
  - `productId` (required)
  - `productName` (optional, for toast messages)
  - `isFavorited` (optional, default: false)
  - `onFavoriteChange` (optional callback)
  - `size` (optional: 'sm' | 'md' | 'lg')
  - `variant` (optional: 'default' | 'ghost' | 'outline')
- Handles authentication check
- Shows toast notifications
- Optimistic UI updates

**FavoritesPage** (`app/favorites/page.tsx`)
- Full page view of user's favorites
- Redirects unauthenticated users to sign-in
- Loading state with skeleton UI
- Empty state with call-to-action
- Grid layout matching product catalog

#### Database Operations

Functions in `lib/database.ts`:
- `addFavorite(userId, productId)` - Add favorite
- `removeFavorite(userId, productId)` - Remove favorite
- `getFavoritesByUser(userId)` - Get all favorites with product details
- `isFavorite(userId, productId)` - Check if product is favorited
- `getUserFavoriteIds(userId)` - Get array of favorited product IDs

## User Flow

### Adding a Favorite

1. User browses products on homepage
2. Clicks heart icon on a product card
3. If not authenticated, sees "Please sign in" toast
4. If authenticated:
   - Heart fills with red color
   - Toast confirms: "[Product Name] added to favorites"
   - Product appears in favorites page

### Viewing Favorites

1. User clicks on user avatar in header
2. Selects "My Favorites" from dropdown
3. Navigates to `/favorites` page
4. Sees grid of all favorited products
5. Can add items to cart or remove from favorites

### Removing a Favorite

1. User clicks filled heart icon
2. Heart becomes unfilled
3. Toast confirms: "[Product Name] removed from favorites"
4. On favorites page, product is removed from list

## Testing

The feature includes comprehensive test coverage:

**Test file:** `__tests__/favorites.test.tsx`

Tests cover:
- Component rendering
- Heart icon states (filled/unfilled)
- Authentication requirements
- Adding products to favorites
- Removing products from favorites
- Error handling
- Callback notifications

All 67 tests pass, including 7 new tests for favorites.

## Migration

Database migration file: `prisma/migrations/20250103000000_add_favorites/migration.sql`

To apply the migration:
```bash
npm run db:push
# or
npx prisma migrate deploy
```

## Security Considerations

1. **Authentication Required**: All favorite operations require authentication
2. **User Isolation**: Users can only access their own favorites
3. **Cascade Deletes**: Favorites are automatically cleaned up when users or products are deleted
4. **Unique Constraints**: Database prevents duplicate favorites

## Future Enhancements

Potential improvements for future versions:
- Add favorites count badge in navigation
- Sort/filter favorites page
- Share favorite products list
- Product recommendations based on favorites
- Email notifications for favorited product sales
- Export favorites list
- Bulk operations (clear all, add multiple)

## Dependencies

No new dependencies were added. The feature uses:
- Existing UI components (Button, Card, Badge, etc.)
- lucide-react icons (Heart icon)
- next-auth for authentication
- sonner for toast notifications

## Performance

- Lazy loading of favorites (only loaded when needed)
- Optimistic UI updates for instant feedback
- Efficient database queries with Prisma
- Minimal API calls (IDs only when possible)
