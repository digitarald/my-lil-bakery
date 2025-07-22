#!/bin/bash

set -e

echo "🧁 Setting up Sweet Dreams Bakery development environment..."

# Install dependencies
echo "📦 Installing dependencies with pnpm..."
pnpm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm db:generate

# Push database schema (for development)
echo "🗄️ Setting up database..."
if [ -f "prisma/dev.db" ]; then
    echo "   Database already exists, running migrations..."
    pnpm db:push
else
    echo "   Creating new database..."
    pnpm db:push
fi

# Seed the database
echo "🌱 Seeding database with initial data..."
if [ -f "prisma/seed.ts" ]; then
    pnpm db:seed
else
    echo "   No seed file found, skipping seeding..."
fi

# Build Next.js for faster first startup
echo "🏗️ Preparing Next.js..."
# Skip build for faster setup - dev server will handle this
# pnpm build

echo "✅ Setup complete! Development server will start automatically..."
echo "   - Next.js dev server: http://localhost:3000"
echo "   - Run 'pnpm db:studio' to open Prisma Studio"
echo "   - Run 'pnpm test' to run tests"
