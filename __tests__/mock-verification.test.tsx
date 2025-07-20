describe("Mock Verification", () => {
  test("database mocks are properly set up", () => {
    const db = require("@/lib/database")
    expect(db.getProducts).toBeDefined()
    expect(typeof db.getProducts).toBe('function')
    expect(db.getCategories).toBeDefined()
    expect(typeof db.getCategories).toBe('function')
  })
})