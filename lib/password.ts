import bcrypt from "bcryptjs"

/**
 * Password utility functions for secure hashing and verification
 */

// Use 12 salt rounds for good security vs performance balance
const SALT_ROUNDS = 12

/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password
 * @returns Promise resolving to hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    return hashedPassword
  } catch (error) {
    console.error("Error hashing password:", error)
    throw new Error("Failed to hash password")
  }
}

/**
 * Verify a plain text password against a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns Promise resolving to boolean indicating if passwords match
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword)
    return isValid
  } catch (error) {
    console.error("Error verifying password:", error)
    return false
  }
}

/**
 * Generate a random password for temporary use
 * @param length - Length of password (default: 12)
 * @returns Random password string
 */
export function generateRandomPassword(length: number = 12): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let password = ""
  
  // Ensure at least one character from each required type
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*"
  
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Fill remaining length with random characters
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle the password to randomize character positions
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Check if a password meets security requirements
 * @param password - Password to validate
 * @returns Object with validation result and details
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0
  
  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push("Password must be at least 8 characters long")
  }
  
  if (password.length >= 12) {
    score += 1
  }
  
  // Character type checks
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push("Password must contain at least one lowercase letter")
  }
  
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push("Password must contain at least one uppercase letter")
  }
  
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push("Password must contain at least one number")
  }
  
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 2 // Give more weight to special characters
  } else {
    feedback.push("Consider adding special characters for better security")
  }
  
  // Common password patterns
  if (!/(.)\1{2,}/.test(password)) {
    score += 1
  } else {
    feedback.push("Avoid repeating characters")
  }
  
  const commonPatterns = [
    /123456/,
    /^password$/i, // Only match if the whole password is just "password"
    /qwerty/i,
    /abc123/i,
    /^admin$/i // Only match if the whole password is just "admin"
  ]
  
  const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password))
  if (!hasCommonPattern) {
    score += 1
  } else {
    feedback.push("Avoid common password patterns")
  }
  
  // A password is valid if it meets basic requirements and has a good score
  // We allow some feedback for recommendations (like special characters)
  const hasBasicRequirements = password.length >= 8 && 
    /[a-z]/.test(password) && 
    /[A-Z]/.test(password) && 
    /\d/.test(password)
    
  const isValid = hasBasicRequirements && score >= 6 && !hasCommonPattern
  
  return {
    isValid,
    score,
    feedback
  }
}
