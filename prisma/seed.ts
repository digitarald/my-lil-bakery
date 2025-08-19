import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/password"

const prisma = new PrismaClient()

async function main() {
  // Clear existing products to avoid duplicates
  console.log("🧹 Clearing existing products...")
  await prisma.product.deleteMany()
  
  const cakesCategory = await prisma.category.upsert({
    where: { name: "Cakes" },
    update: {},
    create: {
      name: "Cakes",
      description: "Delicious handcrafted cakes for every occasion",
      image: "/placeholder.svg?height=200&width=300&text=Cakes",
    },
  })

  const pastriesCategory = await prisma.category.upsert({
    where: { name: "Pastries" },
    update: {},
    create: {
      name: "Pastries",
      description: "Fresh pastries baked daily",
      image: "/placeholder.svg?height=200&width=300&text=Pastries",
    },
  })

  const breadCategory = await prisma.category.upsert({
    where: { name: "Bread" },
    update: {},
    create: {
      name: "Bread",
      description: "Artisan breads made with premium ingredients",
      image: "/placeholder.svg?height=200&width=300&text=Bread",
    },
  })

  const cookiesCategory = await prisma.category.upsert({
    where: { name: "Cookies" },
    update: {},
    create: {
      name: "Cookies",
      description: "Homemade cookies with love",
      image: "/placeholder.svg?height=200&width=300&text=Cookies",
    },
  })

  const products = [
    // Cakes
    {
      name: "Chocolate Dream Cake",
      description: "Rich chocolate cake with chocolate ganache frosting",
      price: 45.99,
      image: "/placeholder.svg?height=300&width=300&text=Chocolate+Cake",
      categoryId: cakesCategory.id,
      featured: true,
      preOrder: true,
      minOrderTime: 24,
      ingredients: "Flour, cocoa powder, eggs, butter, sugar, vanilla",
      allergens: "Contains gluten, eggs, dairy",
    },
    {
      name: "Vanilla Bean Cheesecake",
      description: "Creamy vanilla cheesecake with graham cracker crust",
      price: 38.99,
      image: "/placeholder.svg?height=300&width=300&text=Cheesecake",
      categoryId: cakesCategory.id,
      featured: true,
      preOrder: true,
      minOrderTime: 24,
      ingredients: "Cream cheese, vanilla beans, eggs, graham crackers",
      allergens: "Contains gluten, eggs, dairy",
    },
    {
      name: "Red Velvet Cake",
      description: "Classic red velvet with cream cheese frosting",
      price: 42.99,
      image: "/placeholder.svg?height=300&width=300&text=Red+Velvet",
      categoryId: cakesCategory.id,
      featured: false,
      preOrder: true,
      minOrderTime: 48,
      ingredients: "Flour, cocoa powder, buttermilk, eggs, food coloring",
      allergens: "Contains gluten, eggs, dairy",
    },

    // Pastries
    {
      name: "Butter Croissants",
      description: "Flaky, buttery croissants baked fresh daily",
      price: 3.99,
      image: "/placeholder.svg?height=300&width=300&text=Croissants",
      categoryId: pastriesCategory.id,
      featured: true,
      preOrder: false,
      minOrderTime: 0,
      ingredients: "Flour, butter, yeast, milk, eggs",
      allergens: "Contains gluten, eggs, dairy",
    },
    {
      name: "Apple Danish",
      description: "Sweet pastry filled with cinnamon apples",
      price: 4.99,
      image: "/placeholder.svg?height=300&width=300&text=Apple+Danish",
      categoryId: pastriesCategory.id,
      featured: false,
      preOrder: false,
      minOrderTime: 0,
      ingredients: "Flour, butter, apples, cinnamon, sugar",
      allergens: "Contains gluten, dairy",
    },
    {
      name: "Chocolate Éclair",
      description: "Choux pastry filled with cream and topped with chocolate",
      price: 5.99,
      image: "/placeholder.svg?height=300&width=300&text=Eclair",
      categoryId: pastriesCategory.id,
      featured: true,
      ingredients: "Flour, eggs, butter, cream, chocolate",
      allergens: "Contains gluten, eggs, dairy",
    },

    // Bread
    {
      name: "Artisan Sourdough",
      description: "Traditional sourdough with crispy crust",
      price: 8.99,
      image: "/placeholder.svg?height=300&width=300&text=Sourdough",
      categoryId: breadCategory.id,
      featured: true,
      ingredients: "Flour, sourdough starter, salt, water",
      allergens: "Contains gluten",
    },
    {
      name: "Whole Wheat Bread",
      description: "Healthy whole wheat bread, perfect for sandwiches",
      price: 6.99,
      image: "/placeholder.svg?height=300&width=300&text=Wheat+Bread",
      categoryId: breadCategory.id,
      featured: false,
      ingredients: "Whole wheat flour, yeast, honey, salt",
      allergens: "Contains gluten",
    },

    // Cookies
    {
      name: "Chocolate Chip Cookies",
      description: "Classic chocolate chip cookies, soft and chewy",
      price: 2.99,
      image: "/placeholder.svg?height=300&width=300&text=Chocolate+Chip",
      categoryId: cookiesCategory.id,
      featured: true,
      ingredients: "Flour, chocolate chips, butter, brown sugar, eggs",
      allergens: "Contains gluten, eggs, dairy",
    },
    {
      name: "Oatmeal Raisin Cookies",
      description: "Hearty oatmeal cookies with plump raisins",
      price: 2.99,
      image: "/placeholder.svg?height=300&width=300&text=Oatmeal+Raisin",
      categoryId: cookiesCategory.id,
      featured: false,
      ingredients: "Oats, flour, raisins, cinnamon, butter",
      allergens: "Contains gluten, dairy",
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  // Create a demo admin user
  // Demo admin (no password set here). Keep demo account email but do not seed a password.
  await prisma.user.upsert({
    where: {
      email: "admin@sweetdreamsbakery.com",
    },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@sweetdreamsbakery.com",
      role: "admin",
    },
  })

  // Create a secret test admin account for local development
  // Create a secret test admin account for local development only.
  // Only assign a password in non-production environments. Use `SEED_ADMIN_PASSWORD` env var or default.
  const defaultAdminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123"

  const testAdminCreate: any = {
    name: "Test Admin",
    email: "test.admin@localhost.dev",
    role: "admin",
  }

  if (process.env.NODE_ENV !== "production") {
    testAdminCreate.password = await hashPassword(defaultAdminPassword)
  }

  await prisma.user.upsert({
    where: {
      email: "test.admin@localhost.dev",
    },
    update: {},
    create: testAdminCreate,
  })

  console.log("Database seeded successfully!")
  if (process.env.NODE_ENV !== "production") {
    const shownPassword = process.env.SEED_ADMIN_PASSWORD ?? defaultAdminPassword
    console.log(`🔐 Test admin account created: test.admin@localhost.dev (password: ${shownPassword})`)
  } else {
    console.log("🔐 Test admin account created: test.admin@localhost.dev (no password set in production)")
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
