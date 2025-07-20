# Sweet Dreams Bakery - AI Coding Agent Instructions

## Project Overview
Sweet Dreams Bakery is a Next.js 15 e-commerce platform for a handcrafted bakery with pre-order functionality. Built with App Router, Prisma ORM, NextAuth.js, and shadcn/ui components.

## Essential Commands

```bash
# Development
pnpm dev                # Start development server (http://localhost:3000)
pnpm build             # Build for production
pnpm start             # Start production server

# Database
pnpm db:generate       # Generate Prisma client after schema changes
pnpm db:migrate        # Create and apply database migrations
pnpm db:push           # Push schema changes without migration (dev only)
pnpm db:seed           # Populate with sample data
pnpm db:studio         # Open Prisma Studio GUI

# Testing & Quality
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test <pattern>    # Run specific test file (e.g., pnpm test cart)
pnpm lint              # Run ESLint
pnpm typecheck         # Run TypeScript type checking

# Utilities
pnpm create-test-admin # Create test admin user (test.admin@localhost.dev / admin123)
```

## Architecture Patterns

### Database Layer
- **Centralized operations**: All database interactions go through `/lib/database.ts` - never call Prisma client directly in components
- **Type safety**: Use Prisma-generated types with extensions like `ProductWithCategory`, `OrderWithItems`
- **Schema changes**: Always run `pnpm db:migrate` after modifying `prisma/schema.prisma`
- **Transactions**: Use Prisma transactions for operations that modify multiple tables

### Authentication & Authorization
- **NextAuth.js**: Configured in `/lib/auth.ts` with Google OAuth, email magic links, and demo credentials
- **Role-based access**: Users have `customer` or `admin` roles, enforced via middleware in `middleware.ts`
- **Admin protection**: Admin routes (`/admin/*`) require `role === "admin"` check
- **Session handling**: Session provider wraps entire app, access via `useSession()` hook

### State Management
- **Cart**: React Context in `components/cart-context.tsx` with localStorage persistence
- **Session**: NextAuth session provider wraps entire app in `app/layout.tsx`
- **No global state library**: Use React Context for shared state, local state for component-specific data
- **Server state**: Prefer server-side data fetching in page components over client-side state

### Component Architecture
- **shadcn/ui**: All UI components from `/components/ui/` - don't create custom variants
- **Composition**: Combine shadcn components rather than extending them
- **Custom colors**: Use `cream` palette and gradient classes (see `tailwind.config.ts`)
- **Images**: Use Next.js `Image` component for optimization

## Key Workflows

### Database Operations
- Always use functions from `/lib/database.ts` (e.g., `getProducts()`, `createOrder()`)
- Include related data with Prisma's `include` option (see existing patterns)
- Handle async operations with proper error handling and user feedback via `toast`
- Use transactions for multi-table operations

### Testing Strategy
- Jest + React Testing Library setup in `jest.config.js` and `jest.setup.js`
- Test files in `__tests__/` directory with `.test.tsx` extension
- Mock database operations using `__tests__/__mocks__/database.ts`
- Focus on user interactions and state management
- Use `renderHook` for context testing, `render` for component testing

### Form Handling
- Controlled components for most forms
- Immediate validation feedback with proper error states
- Always show loading states during async operations
- Use toast notifications for success/error feedback

### Data Fetching
- Server-side data fetching in page components
- Client-side updates after mutations with `loadData()` pattern
- Loading states with skeleton components or spinners
- Error boundaries for graceful error handling

## Project-Specific Conventions

### File Organization
- **App Router**: Pages in `/app/` with `page.tsx`, API routes in `/app/api/`
- **Components**: Reusable components in `/components/`, UI primitives in `/components/ui/`
- **Business logic**: Database operations in `/lib/`, utilities in `/lib/utils.ts`
- **Types**: Extend Prisma types rather than creating separate type definitions

### Styling Patterns
- **Gradient backgrounds**: Use `bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50`
- **Button styles**: Primary buttons use `bg-gradient-to-r from-pink-500 to-purple-600`
- **Card layouts**: Consistent padding with `CardContent className="p-6"`
- **Responsive**: Mobile-first approach with Tailwind's responsive prefixes

### Error Handling
- **User feedback**: Always show toast notifications for success/error states
- **Graceful degradation**: Handle loading states and network failures
- **Console logging**: Log errors for debugging but show user-friendly messages

### Security Considerations
- **Route protection**: Use middleware for admin routes, session checks for user routes
- **Input validation**: Validate all form inputs both client and server-side
- **Type safety**: Leverage TypeScript and Prisma for compile-time safety

## Integration Points

### Email Service
- Configured via Resend in `/lib/resend.ts` and `/lib/email.ts`
- Magic link authentication and order confirmations
- Email templates use inline CSS for compatibility

### Image Handling
- Placeholder system with `/placeholder.svg` and `/placeholder.jpg`
- Product images stored as URLs in database
- No upload functionality - use external CDN URLs
- Always use Next.js `Image` component for optimization

### Order Management
- Six-status workflow: PENDING → CONFIRMED → PREPARING → READY → COMPLETED (+ CANCELLED)
- Pre-order system with minimum notice periods
- Cart calculates total order time from individual product requirements

## Environment Variables
Key environment variables needed:
- `DATABASE_URL` - Prisma database connection
- `NEXTAUTH_URL` - Authentication callback URL
- `NEXTAUTH_SECRET` - NextAuth encryption secret
- `GOOGLE_CLIENT_ID/SECRET` - Google OAuth credentials
- `RESEND_API_KEY` - Email service API key
- `EMAIL_FROM` - Sender email address

## Common Patterns

### Admin Dashboard
- Tab-based interface using shadcn Tabs component
- Real-time stats calculation in `getOrderStats()`
- Inline editing with Dialog components for forms

### Product Management
- CRUD operations through admin dashboard
- Category-based organization
- Pre-order and stock management
- Featured product highlighting

### Cart Operations
- Add/remove/update quantity operations
- Persistent cart across sessions
- Pre-order time calculation
- Guest checkout support

When working on this project, prioritize type safety, user experience with proper loading/error states, and maintaining the existing architectural patterns rather than introducing new libraries or patterns.