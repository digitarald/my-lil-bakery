/**
 * Centralized database mocks for testing
 * This file provides DRY mock factories and mock data for database operations
 */

import type { Product, Category, User, Order } from "@prisma/client"

// Mock data factories
export const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "1",
  name: "Rainbow Cupcakes",
  description: "Colorful and delicious cupcakes",
  price: 4.99,
  image: "/cupcake.jpg",
  categoryId: "cat1",
  inStock: true,
  featured: false,
  preOrder: false,
  minOrderTime: 0,
  ingredients: "flour, sugar, butter, eggs",
  allergens: "eggs, gluten",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
})

export const createMockCategory = (overrides: Partial<Category> = {}): Category => ({
  id: "cat1",
  name: "Cupcakes",
  description: "Delicious cupcakes",
  image: "/cupcakes.jpg",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
})

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: "user1",
  name: "John Doe",
  email: "john@example.com",
  password: null,
  emailVerified: null,
  image: null,
  phone: null,
  role: "customer",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
})

export const createMockOrder = (overrides: Partial<Order> = {}): Order => ({
  id: "order1",
  userId: "user1",
  status: "PENDING",
  total: 24.99,
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: null,
  deliveryAddress: null,
  pickupDate: null,
  pickupTime: null,
  deliveryDate: null,
  specialInstructions: null,
  notes: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
})

// Common mock data sets
export const mockProducts: Product[] = [
  createMockProduct({
    id: "1",
    name: "Rainbow Cupcakes",
    price: 4.99,
    categoryId: "cupcakes",
  }),
  createMockProduct({
    id: "2",
    name: "Strawberry Shortcake",
    price: 24.99,
    categoryId: "cakes",
    featured: true,
  }),
  createMockProduct({
    id: "3",
    name: "Chocolate Chip Cookies",
    price: 12.99,
    categoryId: "cookies",
  }),
]

export const mockCategories: Category[] = [
  createMockCategory({
    id: "cupcakes",
    name: "Cupcakes",
  }),
  createMockCategory({
    id: "cakes",
    name: "Cakes",
  }),
  createMockCategory({
    id: "cookies",
    name: "Cookies",
  }),
]

// Products with category relations for database queries that include relations
export const mockProductsWithCategory = mockProducts.map(product => ({
  ...product,
  category: mockCategories.find(cat => cat.id === product.categoryId) || mockCategories[0],
}))

// Database function mocks factory
export const createDatabaseMocks = () => ({
  // Product operations
  getProducts: jest.fn().mockResolvedValue(mockProductsWithCategory),
  getFeaturedProducts: jest.fn().mockResolvedValue(
    mockProductsWithCategory.filter(p => p.featured)
  ),
  getProductById: jest.fn().mockImplementation((id: string) =>
    Promise.resolve(mockProductsWithCategory.find(p => p.id === id) || null)
  ),
  getProductsByCategory: jest.fn().mockImplementation((categoryId: string) =>
    Promise.resolve(mockProductsWithCategory.filter(p => p.categoryId === categoryId))
  ),
  getAllProducts: jest.fn().mockResolvedValue(mockProductsWithCategory),

  // Category operations
  getCategories: jest.fn().mockResolvedValue(mockCategories),
  getCategoryById: jest.fn().mockImplementation((id: string) =>
    Promise.resolve(mockCategories.find(c => c.id === id) || null)
  ),

  // Order operations
  createOrder: jest.fn().mockResolvedValue(createMockOrder()),
  getOrdersByUser: jest.fn().mockResolvedValue([createMockOrder()]),
  getOrderById: jest.fn().mockImplementation((id: string) =>
    Promise.resolve(id === "order1" ? createMockOrder() : null)
  ),
  getAllOrders: jest.fn().mockResolvedValue([{
    ...createMockOrder(),
    orderItems: [{
      id: "item1",
      orderId: "order1",
      productId: "1",
      quantity: 2,
      price: 12.49,
      product: mockProducts[0],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    }]
  }]),
  getOrders: jest.fn().mockResolvedValue([{
    ...createMockOrder(),
    orderItems: [{
      id: "item1",
      orderId: "order1",
      productId: "1",
      quantity: 2,
      price: 12.49,
      product: mockProducts[0],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    }]
  }]),
  updateOrderStatus: jest.fn().mockResolvedValue(createMockOrder({ status: "COMPLETED" })),
  getOrderStats: jest.fn().mockResolvedValue({
    totalOrders: 10,
    totalRevenue: 250.0,
    pendingOrders: 3,
  }),

  // User operations
  getUserById: jest.fn().mockImplementation((id: string) =>
    Promise.resolve(id === "user1" ? createMockUser() : null)
  ),
  updateUser: jest.fn().mockResolvedValue(createMockUser()),

  // Admin operations
  createProduct: jest.fn().mockResolvedValue(createMockProduct()),
  updateProduct: jest.fn().mockResolvedValue(createMockProduct()),
  deleteProduct: jest.fn().mockResolvedValue(createMockProduct()),
  addProduct: jest.fn().mockResolvedValue(createMockProduct()),
  createCategory: jest.fn().mockResolvedValue(createMockCategory()),
  updateCategory: jest.fn().mockResolvedValue(createMockCategory()),
  deleteCategory: jest.fn().mockResolvedValue(createMockCategory()),
})

// Default database mocks
// Export the factory function for use in jest.mock calls
export const mockDatabaseFactory = () => createDatabaseMocks()

// Default export for module replacement
export default createDatabaseMocks()
