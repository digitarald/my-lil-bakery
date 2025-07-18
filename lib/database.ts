import { prisma } from "@/lib/prisma"
import type { Product, Category, User } from "@prisma/client"

// Product operations
export async function getProducts() {
  return await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: {
      featured: true,
      inStock: true,
    },
    include: {
      category: true,
    },
    take: 6,
  })
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  })
}

export async function getProductsByCategory(categoryId: string) {
  return await prisma.product.findMany({
    where: {
      categoryId,
      inStock: true,
    },
    include: {
      category: true,
    },
  })
}

// Category operations
export async function getCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: {
            where: {
              inStock: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })
}

export async function getCategoryById(id: string) {
  return await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        where: {
          inStock: true,
        },
      },
    },
  })
}

// Order operations
export async function createOrder(orderData: {
  userId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  deliveryAddress?: string
  deliveryDate?: Date
  notes?: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
}) {
  const total = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return await prisma.order.create({
    data: {
      userId: orderData.userId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      deliveryAddress: orderData.deliveryAddress,
      deliveryDate: orderData.deliveryDate,
      notes: orderData.notes,
      total,
      orderItems: {
        create: orderData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })
}

export async function getOrdersByUser(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getOrderById(id: string) {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })
}

export async function getAllOrders() {
  return await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function updateOrderStatus(orderId: string, status: string) {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status: status as any },
  })
}

// User operations
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  })
}

export async function updateUser(id: string, data: Partial<User>) {
  return await prisma.user.update({
    where: { id },
    data,
  })
}

// Admin operations
export async function createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  return await prisma.product.create({
    data: productData,
  })
}

export async function updateProduct(id: string, productData: Partial<Product>) {
  return await prisma.product.update({
    where: { id },
    data: productData,
  })
}

export async function deleteProduct(id: string) {
  return await prisma.product.delete({
    where: { id },
  })
}

export async function createCategory(categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) {
  return await prisma.category.create({
    data: categoryData,
  })
}

export async function updateCategory(id: string, categoryData: Partial<Category>) {
  return await prisma.category.update({
    where: { id },
    data: categoryData,
  })
}

export async function deleteCategory(id: string) {
  return await prisma.category.delete({
    where: { id },
  })
}
