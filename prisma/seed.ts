import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const cakesCategory = await prisma.category.create({
    data: {
      name: "Cakes",
      description: "Delicious handcrafted cakes for every occasion",
      image: "/placeholder.svg?height=200&width=300&text=Cakes",
    },
  })

  const pastriesCategory = await prisma.category.create({
    data: {
      name: "Pastries",
      description: "Fresh pastries baked daily",
      image: "/placeholder.svg?height=200&width=300&text=Pastries",
    },
  })

  const breadCategory = await prisma.category.create({
    data: {
      name: "Bread",
      description: "Artisan breads made with premium ingredients",
      image: "/placeholder.svg?height=200&width=300&text=Bread",
    },
  })

  const cookiesCategory = await prisma.category.create({
    data: {
      name: "Cookies",
      description: "Homemade cookies with love",
      image: "/placeholder.svg?height=200&width=300&text=Cookies",
    },
  })

  // Create products
  const products = [
    // Cakes
    {
      name: "Chocolate Dream Cake",
      description: "Rich chocolate cake with chocolate ganache frosting",
      price: 45.99,
      image: "/placeholder.svg?height=300&width=300&text=Chocolate+Cake",
      categoryId: cakesCategory.id,
      featured: true,
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
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@sweetdreamsbakery.com",
      role: "admin",
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
