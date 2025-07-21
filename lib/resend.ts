import { Resend } from "resend"

// For build-time and test environments, allow dummy keys
// For production runtime, require a real API key
const apiKey = process.env.RESEND_API_KEY

if (!apiKey && process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  // Only throw error for server-side production when actually trying to use resend
  console.warn("RESEND_API_KEY is not set in production environment")
}

export const resend = new Resend(apiKey || "re_dummy_key_for_build")
