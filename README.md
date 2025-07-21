# Sweet Dreams Bakery Platform

Our online bakery platform - built for Sweet Dreams Bakery team.

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup database & seed with our products
pnpm db:migrate && pnpm db:seed

# Start development
pnpm dev
```

Visit `http://localhost:3000` - you're ready to go!

## Daily Commands

```bash
pnpm dev          # Start development server
pnpm test         # Run tests
pnpm db:studio    # View database in browser
pnpm db:seed      # Reset to sample data
```

## What's Built

- **Customer storefront** - Browse our 4 categories (Cakes, Pastries, Bread, Cookies)
- **Shopping cart** - Add items, checkout
- **User accounts** - Customer signup/login
- **Admin dashboard** - Manage products and orders at `/admin`
- **Order system** - Track customer orders

## Tech We're Using

- Next.js 15 (App Router)
- Prisma (SQLite for dev)
- NextAuth.js (authentication)
- Tailwind CSS + Radix UI
- TypeScript

## Test Data

When you seed, you get:
- 10 sample bakery products across our categories
- Test admin account: `admin@sweetdreamsbakery.com`

## Project Layout

```
app/           # Pages (homepage, admin, auth)
components/    # Reusable UI components  
lib/           # Database & utility functions
prisma/        # Database schema & seed data
__tests__/     # Test files
```

## Need Help?

- Database issues? Run `pnpm db:migrate`
- Want fresh data? Run `pnpm db:seed`
- Tests failing? Check `pnpm test`
