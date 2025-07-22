# Sweet Dreams Bakery - DevContainer

This directory contains the DevContainer configuration for the Sweet Dreams Bakery project.

## Quick Start

1. **Open in DevContainer**:
   - Install the "Dev Containers" extension in VS Code
   - Open the project folder
   - When prompted, click "Reopen in Container"
   - Or use Command Palette: `Dev Containers: Reopen in Container`

2. **Wait for Setup**:
   - The container will build automatically (first time takes ~3-5 minutes)
   - Dependencies will be installed automatically
   - Database will be set up and seeded

3. **Start Developing**:
   ```bash
   pnpm dev        # Start Next.js development server
   pnpm db:studio  # Open Prisma Studio (database viewer)
   pnpm test       # Run tests
   ```

## What's Included

### Pre-installed Tools
- Node.js 22 (LTS)
- pnpm (latest)
- Git
- Prisma CLI

### VS Code Extensions
- **TypeScript**: Advanced TypeScript support
- **Prisma**: Database schema highlighting and IntelliSense
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility class suggestions

### Services
- **SQLite Database**: Persistent storage for development
- **Port Forwarding**: 
  - 3000: Next.js development server
  - 5555: Prisma Studio

## Database Options

### Default: SQLite
The devcontainer uses SQLite by default, matching your current development setup.

### Optional: PostgreSQL
To use PostgreSQL instead (more production-like):

1. Edit `docker-compose.yml`:
   - Uncomment the `postgres` service
   - Uncomment the `postgres_data` volume

2. Update your `.env` file:
   ```
   DATABASE_URL="postgresql://bakery:bakery_dev@postgres:5432/sweet_dreams_bakery"
   ```

3. Rebuild the container

## Environment Variables

The devcontainer automatically sets up basic environment variables. For additional configuration:

1. Copy `.env.template` to `.env.devcontainer.local`
2. Add your specific values (API keys, OAuth credentials, etc.)
3. Restart the container

## Troubleshooting

### Slow Performance
- Ensure Docker Desktop has sufficient resources (4GB+ RAM, 2+ CPUs)
- On Windows/Mac: Consider enabling file system caching

### Permission Issues
- The container runs as the `node` user for security
- File permissions are automatically mapped to your host user

### Database Issues
- Delete `prisma/dev.db` and restart container to reset database
- Run `pnpm db:push` manually if schema changes don't apply

### Port Conflicts
- Change port mappings in `docker-compose.yml` if 3000/5555 are in use
- Update `forwardPorts` in `devcontainer.json` accordingly

## Commands Reference

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes to database
pnpm db:migrate       # Create and run migrations
pnpm db:seed          # Seed database with test data
pnpm db:studio        # Open Prisma Studio

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript checks
```

## GitHub Codespaces

This devcontainer is optimized for GitHub Codespaces:

- **Machine Recommendation**: 2-core for basic development, 4-core for heavy builds
- **Prebuild**: Configure prebuild in repository settings for faster startup
- **Secrets**: Add secrets in Codespaces settings for API keys

## Next Steps

1. **Try the setup**: Open in devcontainer and run `pnpm dev`
2. **Customize**: Modify VS Code extensions in `devcontainer.json`
3. **Database**: Switch to PostgreSQL if needed for production testing
4. **CI/CD**: The devcontainer can be used in GitHub Actions for consistent builds
