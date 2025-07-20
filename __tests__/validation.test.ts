import { 
  signUpSchema, 
  signInSchema, 
  checkoutSchema, 
  createProductSchema, 
  createCategorySchema 
} from '../lib/validations'

describe('Validation Schemas', () => {
  describe('signUpSchema', () => {
    it('should validate correct signup data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
        terms: true
      }
      
      const result = signUpSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject weak passwords', () => {
      const weakPasswordData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
        confirmPassword: '123',
        terms: true
      }
      
      const result = signUpSchema.safeParse(weakPasswordData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 8 characters')
      }
    })

    it('should reject invalid email format', () => {
      const invalidEmailData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
        terms: true
      }
      
      const result = signUpSchema.safeParse(invalidEmailData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email')
      }
    })

    it('should reject empty name', () => {
      const emptyNameData = {
        name: '',
        email: 'john@example.com',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
        terms: true
      }
      
      const result = signUpSchema.safeParse(emptyNameData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Name must be at least 2 characters')
      }
    })
  })

  describe('signInSchema', () => {
    it('should validate correct signin data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'SecurePassword123!'
      }
      
      const result = signInSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject missing email', () => {
      const missingEmailData = {
        password: 'SecurePassword123!'
      }
      
      const result = signInSchema.safeParse(missingEmailData)
      expect(result.success).toBe(false)
    })
  })

  describe('checkoutSchema', () => {
    it('should validate correct checkout data', () => {
      const validData = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '15551234567',
        pickupDate: new Date('2025-07-25'),
        pickupTime: '14:00',
        specialInstructions: 'Please add extra frosting'
      }
      
      const result = checkoutSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email in checkout', () => {
      const invalidEmailData = {
        customerName: 'John Doe',
        customerEmail: 'invalid-email',
        customerPhone: '+1-555-123-4567',
        pickupDate: '2025-07-25',
        pickupTime: '14:00'
      }
      
      const result = checkoutSchema.safeParse(invalidEmailData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid phone format', () => {
      const invalidPhoneData = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: 'abc-def-ghij', // Invalid - contains letters
        pickupDate: new Date('2025-07-25'),
        pickupTime: '14:00'
      }
      
      const result = checkoutSchema.safeParse(invalidPhoneData)
      expect(result.success).toBe(false)
    })

    it('should reject past pickup date', () => {
      const pastDateData = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '15551234567',
        pickupDate: new Date('2020-01-01'),
        pickupTime: '14:00'
      }
      
      const result = checkoutSchema.safeParse(pastDateData)
      expect(result.success).toBe(false)
    })
  })

  describe('createProductSchema', () => {
    it('should validate correct product data', () => {
      const validData = {
        name: 'Chocolate Cake',
        description: 'Delicious chocolate cake',
        price: 25.99,
        categoryId: 'cat-123',
        image: 'https://example.com/cake.jpg',
        minOrderTime: 120,
        inStock: true,
        featured: false
      }
      
      const result = createProductSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject negative price', () => {
      const negativePrice = {
        name: 'Chocolate Cake',
        description: 'Delicious chocolate cake',
        price: -5,
        categoryId: 'cat-123',
        image: 'https://example.com/cake.jpg',
        minOrderTime: 120,
        inStock: true,
        featured: false
      }
      
      const result = createProductSchema.safeParse(negativePrice)
      expect(result.success).toBe(false)
    })

    it('should reject invalid URL format', () => {
      const invalidUrl = {
        name: 'Chocolate Cake',
        description: 'Delicious chocolate cake',
        price: 25.99,
        categoryId: 'cat-123',
        image: 'not-a-url',
        minOrderTime: 120,
        inStock: true,
        featured: false
      }
      
      const result = createProductSchema.safeParse(invalidUrl)
      expect(result.success).toBe(false)
    })
  })

  describe('createCategorySchema', () => {
    it('should validate correct category data', () => {
      const validData = {
        name: 'Cakes',
        description: 'All kinds of cakes'
      }
      
      const result = createCategorySchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty category name', () => {
      const emptyName = {
        name: '',
        description: 'All kinds of cakes'
      }
      
      const result = createCategorySchema.safeParse(emptyName)
      expect(result.success).toBe(false)
    })
  })
})
