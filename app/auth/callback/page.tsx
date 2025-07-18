"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session from URL hash
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/auth/signin?error=callback_error')
          return
        }

        if (data.session) {
          // User is signed in, check if they have a profile
          const { data: user } = await supabase.auth.getUser()
          
          if (user.user) {
            // Check if user profile exists in our users table
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.user.id)
              .single()

            if (profileError && profileError.code === 'PGRST116') {
              // User profile doesn't exist, create it
              const { error: insertError } = await supabase
                .from('users')
                .insert({
                  id: user.user.id,
                  email: user.user.email!,
                  name: user.user.user_metadata?.name || user.user.email!.split('@')[0],
                  phone: user.user.user_metadata?.phone || null,
                  role: 'customer'
                })

              if (insertError) {
                console.error('Error creating user profile:', insertError)
              }
            }
          }

          // Redirect to home page
          router.push('/')
        } else {
          // No session, redirect to signin
          router.push('/auth/signin')
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        router.push('/auth/signin?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}