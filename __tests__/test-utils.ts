/**
 * Jest test setup utilities
 * Provides centralized mock configuration and test utilities
 */

// Export database mocks for individual test customization
export { createDatabaseMocks } from "./__mocks__/database"
export {
  createMockProduct,
  createMockCategory,
  createMockUser,
  createMockOrder,
  mockProducts,
  mockCategories,
  mockProductsWithCategory,
} from "./__mocks__/database"
