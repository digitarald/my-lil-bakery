import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/password"
import { signUpSchema } from "@/lib/validations"
import { ZodError } from "zod"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = signUpSchema.parse(body)
    const { name, email, password } = validatedData

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" }, 
        { status: 400 }
      )
    }

    // Hash the password securely
    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { 
        message: "User created successfully", 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      }, 
      { status: 201 }
    )
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        }, 
        { status: 400 }
      )
    }

    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: "A user with this email already exists" }, 
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}
