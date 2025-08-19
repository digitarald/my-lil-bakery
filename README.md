# Sweet Dreams Bakery Platform

[![CI](https://github.com/digitarald/my-lil-bakery/actions/workflows/ci.yml/badge.svg)](https://github.com/digitarald/my-lil-bakery/actions/workflows/ci.yml)

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

Note: demo admin has no seeded password; the dev-only `test.admin@localhost.dev` gets a password only when `NODE_ENV !== 'production'` (override with `SEED_ADMIN_PASSWORD`).

## Project Layout

```
app/           # Pages (homepage, admin, auth)
components/    # Reusable UI components  
lib/           # Database & utility functions
prisma/        # Database schema & seed data
__tests__/     # Test files
```

## Continuous Integration

Our CI pipeline automatically runs on every push to main and pull requests:

- **Code Quality**: ESLint linting and TypeScript type checking
- **Testing**: Full Jest test suite with database setup
- **Build**: Next.js production build validation
- **Security**: Dependency vulnerability scanning

The workflow uses Node.js 22 LTS and pnpm for package management.

## Need Help?

- Database issues? Run `pnpm db:migrate`
- Want fresh data? Run `pnpm db:seed`
- Tests failing? Check `pnpm test`
