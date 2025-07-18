import { supabase, type Product, type Order, type OrderWithItems, type User } from "./supabase"

// Product operations
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    throw new Error("Failed to fetch products")
  }

  return data || []
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all products:", error)
    throw new Error("Failed to fetch products")
  }

  return data || []
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("in_stock", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products by category:", error)
    throw new Error("Failed to fetch products")
  }

  return data || []
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .eq("in_stock", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error searching products:", error)
    throw new Error("Failed to search products")
  }

  return data || []
}

// Order operations
export async function createOrder(orderData: {
  user_id?: string
  total_amount: number
  pickup_date: string
  pickup_time: string
  customer_name: string
  customer_email: string
  customer_phone: string
  special_instructions?: string
  items: Array<{
    product_id: number
    quantity: number
    price: number
  }>
}): Promise<Order> {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: orderData.user_id,
      total_amount: orderData.total_amount,
      pickup_date: orderData.pickup_date,
      pickup_time: orderData.pickup_time,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      special_instructions: orderData.special_instructions,
    })
    .select()
    .single()

  if (orderError) {
    console.error("Error creating order:", orderError)
    throw new Error("Failed to create order")
  }

  // Insert order items
  const orderItems = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("Error creating order items:", itemsError)
    throw new Error("Failed to create order items")
  }

  return order
}

export async function getOrders(userId?: string): Promise<OrderWithItems[]> {
  let query = supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .order("created_at", { ascending: false })

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching orders:", error)
    throw new Error("Failed to fetch orders")
  }

  return data || []
}

export async function updateOrderStatus(orderId: number, status: string): Promise<Order> {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select().single()

  if (error) {
    console.error("Error updating order status:", error)
    throw new Error("Failed to update order status")
  }

  return data
}

// Admin operations
export async function getOrderStats() {
  const { data: orders, error } = await supabase.from("orders").select("total_amount, status, created_at")

  if (error) {
    console.error("Error fetching order stats:", error)
    throw new Error("Failed to fetch order statistics")
  }

  const today = new Date().toISOString().split("T")[0]
  const thisMonth = new Date().toISOString().slice(0, 7)

  const stats = {
    totalOrders: orders?.length || 0,
    todayOrders: orders?.filter((o) => o.created_at.startsWith(today)).length || 0,
    monthlyRevenue:
      orders?.filter((o) => o.created_at.startsWith(thisMonth)).reduce((sum, o) => sum + Number(o.total_amount), 0) ||
      0,
    pendingOrders: orders?.filter((o) => o.status === "pending").length || 0,
  }

  return stats
}

export async function addProduct(productData: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product> {
  const { data, error } = await supabase.from("products").insert(productData).select().single()

  if (error) {
    console.error("Error adding product:", error)
    throw new Error("Failed to add product")
  }

  return data
}

export async function updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase.from("products").update(productData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product")
  }

  return data
}

export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product")
  }
}

// User operations
export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update profile")
  }

  return data
}
