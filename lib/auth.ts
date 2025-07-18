import type { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: "Sign in to Sweet Dreams Bakery",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0;">🧁 Sweet Dreams Bakery</h1>
                </div>
                <div style="padding: 30px; background: #fff;">
                  <h2 style="color: #374151; margin-bottom: 20px;">Sign in to your account</h2>
                  <p style="color: #6b7280; margin-bottom: 30px;">
                    Click the button below to sign in to your Sweet Dreams Bakery account.
                  </p>
                  <div style="text-align: center;">
                    <a href="${url}" style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                      Sign In
                    </a>
                  </div>
                  <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
                    If you didn't request this email, you can safely ignore it.
                  </p>
                </div>
                <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                  © 2024 Sweet Dreams Bakery. All rights reserved.
                </div>
              </div>
            `,
          })
        } catch (error) {
          console.error("Failed to send verification email:", error)
          throw new Error("Failed to send verification email")
        }
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        // For demo purposes, we'll skip password hashing
        // In production, you'd compare with bcrypt
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "customer"
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
}
