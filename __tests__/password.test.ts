import { hashPassword, verifyPassword, validatePasswordStrength } from '../lib/password'

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'SecurePassword123!'
      const hashedPassword = await hashPassword(password)
      
      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword.length).toBeGreaterThan(50) // bcrypt hashes are typically ~60 chars
    })

    it('should generate different hashes for the same password', async () => {
      const password = 'SecurePassword123!'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)
      
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const password = 'SecurePassword123!'
      const hashedPassword = await hashPassword(password)
      
      const isValid = await verifyPassword(password, hashedPassword)
      expect(isValid).toBe(true)
    })

    it('should reject an incorrect password', async () => {
      const password = 'SecurePassword123!'
      const wrongPassword = 'WrongPassword456!'
      const hashedPassword = await hashPassword(password)
      
      const isValid = await verifyPassword(wrongPassword, hashedPassword)
      expect(isValid).toBe(false)
    })

    it('should handle empty password gracefully', async () => {
      const hashedPassword = await hashPassword('SecurePassword123!')
      
      const isValid = await verifyPassword('', hashedPassword)
      expect(isValid).toBe(false)
    })
  })

  describe('validatePasswordStrength', () => {
    it('should accept strong passwords', () => {
      const strongPasswords = [
        'SecurePassword123!',
        'ComplexP4ss!',
        'Str0ng#Password',
        'MyVeryL0ng&SecureP@ssw0rd'
      ]

      strongPasswords.forEach(password => {
        const result = validatePasswordStrength(password)
        expect(result.isValid).toBe(true)
      })
    })

    it('should reject weak passwords', () => {
      const weakPasswords = [
        '123',
        'password',
        'PASSWORD',
        '12345678',
        'Password',
        'password123',
        'PASSWORD123'
      ]

      weakPasswords.forEach(password => {
        const result = validatePasswordStrength(password)
        expect(result.isValid).toBe(false)
      })
    })

    it('should require minimum length', () => {
      const result1 = validatePasswordStrength('P@1')
      expect(result1.isValid).toBe(false)
      expect(result1.feedback).toContain('Password must be at least 8 characters long')
      
      const result2 = validatePasswordStrength('P@ssw0rd')
      expect(result2.isValid).toBe(true)
    })

    it('should require uppercase letter', () => {
      const result1 = validatePasswordStrength('password123!')
      expect(result1.isValid).toBe(false)
      expect(result1.feedback).toContain('Password must contain at least one uppercase letter')
      
      const result2 = validatePasswordStrength('Password123!')
      expect(result2.isValid).toBe(true)
    })

    it('should require lowercase letter', () => {
      const result1 = validatePasswordStrength('PASSWORD123!')
      expect(result1.isValid).toBe(false)
      expect(result1.feedback).toContain('Password must contain at least one lowercase letter')
      
      const result2 = validatePasswordStrength('Password123!')
      expect(result2.isValid).toBe(true)
    })

    it('should require number', () => {
      const result1 = validatePasswordStrength('Password!')
      expect(result1.isValid).toBe(false)
      expect(result1.feedback).toContain('Password must contain at least one number')
      
      const result2 = validatePasswordStrength('Password123!')
      expect(result2.isValid).toBe(true)
    })

    it('should provide scoring and feedback', () => {
      const result = validatePasswordStrength('weak')
      expect(result.score).toBeGreaterThan(0)
      expect(result.feedback).toBeInstanceOf(Array)
      expect(result.feedback.length).toBeGreaterThan(0)
    })
  })
})
