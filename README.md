# Sweet Dreams Bakery

A modern bakery e-commerce application built with Next.js, Prisma, and TypeScript.

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (production)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with Radix UI components
- **Testing**: Jest with React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. Set up the database:
   ```bash
   pnpm db:generate  # Generate Prisma client
   pnpm db:migrate   # Create database schema
   pnpm db:seed      # Populate with sample data
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`.

## Database Management

- **Generate Prisma client**: `pnpm db:generate`
- **Create new migration**: `pnpm db:migrate`
- **Seed database**: `pnpm db:seed`
- **View database**: `pnpm db:studio`

## Testing

- Run all tests: `pnpm test`
- Run tests in watch mode: `pnpm test:watch`

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and database operations
- `/prisma` - Database schema and seed data
- `/hooks` - Custom React hooks
- `/__tests__` - Test files

## Features

- Product catalog with categories
- Shopping cart functionality
- User authentication and profiles
- Order management system
- Admin dashboard for product/order management
- Responsive design for all devices

## Seed Data

The application comes with pre-populated seed data including:

- **4 Categories**: Cakes, Pastries, Bread, Cookies
- **10 Sample Products**: Various bakery items with pricing and details
- **Admin User**: admin@sweetdreamsbakery.com (you'll need to update the role after signup)

The seed uses the TypeScript Prisma seed file at `prisma/seed.ts`.
