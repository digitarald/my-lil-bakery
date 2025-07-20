#!/usr/bin/env tsx

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function createTestAdmin() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: "test.admin@localhost.dev",
      },
    })

    if (existingAdmin) {
      console.log("✅ Test admin account already exists")
      console.log("📧 Email: test.admin@localhost.dev")
      console.log("🔑 Password: admin123")
      return
    }

    const testAdmin = await prisma.user.create({
      data: {
        name: "Test Admin",
        email: "test.admin@localhost.dev",
        role: "admin",
      },
    })

    console.log("🎉 Test admin account created successfully!")
    console.log("📧 Email: test.admin@localhost.dev")
    console.log("🔑 Password: admin123")
    console.log("🆔 User ID:", testAdmin.id)
    console.log("")
    console.log("⚠️  This account is for LOCAL DEVELOPMENT ONLY")
    console.log("⚠️  Do not use in production environments")
  } catch (error) {
    console.error("❌ Error creating test admin account:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  createTestAdmin()
}

export { createTestAdmin }
