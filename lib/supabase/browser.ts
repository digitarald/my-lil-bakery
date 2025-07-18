import { createBrowserClient } from "@supabase/ssr"

/**
 * Singleton browser-side Supabase client.
 *
 * This version NEVER touches next/headers ➜ safe for the client.
 */
let browserSupabase: ReturnType<typeof createBrowserClient> | undefined

export function getSupabaseBrowser() {
  if (!browserSupabase) {
    browserSupabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return browserSupabase
}
