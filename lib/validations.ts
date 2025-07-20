import { z } from "zod"

// Common field validations
const email = z.string().email("Invalid email address")
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  )
const name = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
const phone = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number")
  .optional()
  .or(z.literal(""))

// Authentication schemas
export const signUpSchema = z
  .object({
    name,
    email,
    password,
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email,
})

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string(),
    token: z.string().min(1, "Reset token is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Profile schemas
export const updateProfileSchema = z.object({
  name: name.optional(),
  email: email.optional(),
  phone,
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: password,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  })

// Order schemas
export const checkoutSchema = z.object({
  customerName: name,
  customerEmail: email,
  customerPhone: phone,
  deliveryAddress: z
    .string()
    .max(200, "Address must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  pickupDate: z.date().min(new Date(), "Pickup date must be in the future"),
  pickupTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  specialInstructions: z
    .string()
    .max(500, "Special instructions must be less than 500 characters")
    .optional()
    .or(z.literal("")),
})

// Admin schemas
export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  price: z.number().positive("Price must be greater than 0").max(9999.99, "Price must be less than $10,000"),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string().url("Invalid image URL").optional(),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  preOrder: z.boolean().default(false),
  minOrderTime: z.number().min(0, "Minimum order time cannot be negative").max(168, "Maximum 168 hours (1 week)"),
  ingredients: z.string().max(300, "Ingredients must be less than 300 characters").optional(),
  allergens: z.string().max(200, "Allergens must be less than 200 characters").optional(),
})

export const updateProductSchema = createProductSchema.partial()

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  image: z.string().url("Invalid image URL").optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"], {
    message: "Invalid status value",
  }),
})

// Contact form schema
export const contactSchema = z.object({
  name,
  email,
  subject: z.string().min(1, "Subject is required").max(100, "Subject must be less than 100 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
})

// Newsletter schema
export const newsletterSchema = z.object({
  email,
})

// Type exports for TypeScript inference
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
