# Authentication Setup for Sweet Dreams Bakery

## Overview

This project implements authentication using Supabase Auth with support for email/password and Google OAuth sign-in.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Supabase Setup

### 1. Database Schema

The authentication system expects the following database schema (already defined in `scripts/create-tables.sql`):

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Row Level Security (RLS)

Ensure RLS is enabled and policies are set up as defined in the SQL script.

### 3. OAuth Configuration

To enable Google OAuth:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
5. Set the redirect URL to: `https://your-domain.com/auth/callback`

## Authentication Features

### ✅ Implemented Features

- **Email/Password Authentication**: Sign up and sign in with email
- **Google OAuth**: One-click sign in with Google
- **User Registration**: Complete signup flow with profile creation
- **Password Reset**: Forgot password functionality
- **Authentication Context**: Global auth state management
- **Route Protection**: Middleware for protecting admin routes
- **Loading States**: Proper loading indicators during auth operations
- **Error Handling**: User-friendly error messages

### 📝 Auth Pages

- `/auth/signin` - Sign in page
- `/auth/signup` - User registration page
- `/auth/forgot-password` - Password reset page
- `/auth/callback` - OAuth callback handler

### 🔧 Usage in Components

```tsx
import { useAuth } from '@/components/auth-provider'

function MyComponent() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  
  if (user) {
    return <div>Welcome, {user.name}!</div>
  }
  
  return <div>Please sign in</div>
}
```

### 🔐 Auth Functions

The `lib/auth.ts` file provides these functions:

- `signInWithEmail(credentials)` - Email/password sign in
- `signUpWithEmail(userData)` - User registration
- `signInWithGoogle()` - Google OAuth sign in
- `signOut()` - Sign out current user
- `resetPassword(email)` - Send password reset email
- `updatePassword(newPassword)` - Update user password
- `getCurrentAuthUser()` - Get current authenticated user

## Next Steps

1. Set up your Supabase project and add environment variables
2. Run the database setup script: `scripts/create-tables.sql`
3. Configure Google OAuth in Supabase dashboard
4. Test the authentication flows
5. Add authentication checks to protected components/pages as needed

## Testing

With proper environment variables set up, you can test:

1. User registration at `/auth/signup`
2. Sign in at `/auth/signin`  
3. Password reset at `/auth/forgot-password`
4. Google OAuth (requires Supabase configuration)
5. Admin route protection at `/admin` (redirects to signin if not authenticated)

The authentication system is production-ready and follows Supabase best practices for security and user management.