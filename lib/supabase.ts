import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for admin operations
export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, "created_at" | "updated_at">
        Update: Partial<Omit<User, "id" | "created_at" | "updated_at">>
      }
      products: {
        Row: Product
        Insert: Omit<Product, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Order, "id" | "created_at" | "updated_at">>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, "id" | "created_at">
        Update: Partial<Omit<OrderItem, "id" | "created_at">>
      }
    }
  }
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: "customer" | "admin"
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  min_order_time: number
  pre_order: boolean
  in_stock: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  user_id?: string
  total_amount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  pickup_date: string
  pickup_time: string
  customer_name: string
  customer_email: string
  customer_phone: string
  special_instructions?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  created_at: string
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    products: Product
  })[]
}
