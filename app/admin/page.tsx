"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShoppingCart, Plus, Edit, Trash2, DollarSign, Clock, CheckCircle } from "lucide-react"
import {
  getAllProducts,
  getOrders,
  getOrderStats,
  addProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
} from "@/lib/database"
import type { Product } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    min_order_time: "2",
    pre_order: false,
    in_stock: true,
  })

  const categories = ["Cakes", "Cupcakes", "Cookies", "Muffins", "Bars", "Pastries", "Pies"]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, ordersData, statsData] = await Promise.all([getAllProducts(), getOrders(), getOrderStats()])
      setProducts(productsData)
      setOrders(ordersData)
      setStats(statsData)
    } catch (error) {
      console.error("Error loading admin data:", error)
      toast({
        title: "Error loading data",
        description: "Please try refreshing the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const productData = {
        ...newProduct,
        price: Number.parseFloat(newProduct.price),
        min_order_time: Number.parseInt(newProduct.min_order_time),
      }
      await addProduct(productData)
      toast({
        title: "Product added successfully!",
        description: `${newProduct.name} has been added to the catalog.`,
      })
      setNewProduct({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        min_order_time: "2",
        pre_order: false,
        in_stock: true,
      })
      setIsAddingProduct(false)
      loadData()
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error adding product",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      await updateProduct(editingProduct.id, {
        ...editingProduct,
        price:
          typeof editingProduct.price === "string" ? Number.parseFloat(editingProduct.price) : editingProduct.price,
        min_order_time:
          typeof editingProduct.min_order_time === "string"
            ? Number.parseInt(editingProduct.min_order_time)
            : editingProduct.min_order_time,
      })
      toast({
        title: "Product updated successfully!",
        description: `${editingProduct.name} has been updated.`,
      })
      setEditingProduct(null)
      loadData()
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error updating product",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      await deleteProduct(id)
      toast({
        title: "Product deleted",
        description: `${name} has been removed from the catalog.`,
      })
      loadData()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error deleting product",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast({
        title: "Order status updated",
        description: `Order #${orderId} status changed to ${newStatus}.`,
      })
      loadData()
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error updating order status",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-orange-100 text-orange-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your bakery's products and orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Products</h2>
              <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        placeholder="/placeholder.svg?height=300&width=300"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="minOrderTime">Minimum Order Time (hours)</Label>
                      <Input
                        id="minOrderTime"
                        type="number"
                        value={newProduct.min_order_time}
                        onChange={(e) => setNewProduct({ ...newProduct, min_order_time: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="preOrder"
                          checked={newProduct.pre_order}
                          onCheckedChange={(checked) => setNewProduct({ ...newProduct, pre_order: checked })}
                        />
                        <Label htmlFor="preOrder">Pre-order item</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="inStock"
                          checked={newProduct.in_stock}
                          onCheckedChange={(checked) => setNewProduct({ ...newProduct, in_stock: checked })}
                        />
                        <Label htmlFor="inStock">In stock</Label>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Add Product
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.category}</Badge>
                        </TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <Badge
                              className={product.in_stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                              {product.in_stock ? "In Stock" : "Out of Stock"}
                            </Badge>
                            {product.pre_order && (
                              <Badge className="bg-purple-100 text-purple-800">
                                Pre-order ({product.min_order_time}h)
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Edit Product</DialogTitle>
                                </DialogHeader>
                                {editingProduct && (
                                  <form onSubmit={handleUpdateProduct} className="space-y-4">
                                    <div>
                                      <Label htmlFor="editName">Product Name</Label>
                                      <Input
                                        id="editName"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="editDescription">Description</Label>
                                      <Textarea
                                        id="editDescription"
                                        value={editingProduct.description}
                                        onChange={(e) =>
                                          setEditingProduct({ ...editingProduct, description: e.target.value })
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="editPrice">Price ($)</Label>
                                        <Input
                                          id="editPrice"
                                          type="number"
                                          step="0.01"
                                          value={editingProduct.price}
                                          onChange={(e) =>
                                            setEditingProduct({
                                              ...editingProduct,
                                              price: Number.parseFloat(e.target.value),
                                            })
                                          }
                                          required
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="editCategory">Category</Label>
                                        <Select
                                          value={editingProduct.category}
                                          onValueChange={(value) =>
                                            setEditingProduct({ ...editingProduct, category: value })
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {categories.map((category) => (
                                              <SelectItem key={category} value={category}>
                                                {category}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div>
                                      <Label htmlFor="editImage">Image URL</Label>
                                      <Input
                                        id="editImage"
                                        value={editingProduct.image}
                                        onChange={(e) =>
                                          setEditingProduct({ ...editingProduct, image: e.target.value })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="editMinOrderTime">Minimum Order Time (hours)</Label>
                                      <Input
                                        id="editMinOrderTime"
                                        type="number"
                                        value={editingProduct.min_order_time}
                                        onChange={(e) =>
                                          setEditingProduct({
                                            ...editingProduct,
                                            min_order_time: Number.parseInt(e.target.value),
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="flex items-center space-x-4">
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id="editPreOrder"
                                          checked={editingProduct.pre_order}
                                          onCheckedChange={(checked) =>
                                            setEditingProduct({ ...editingProduct, pre_order: checked })
                                          }
                                        />
                                        <Label htmlFor="editPreOrder">Pre-order item</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id="editInStock"
                                          checked={editingProduct.in_stock}
                                          onCheckedChange={(checked) =>
                                            setEditingProduct({ ...editingProduct, in_stock: checked })
                                          }
                                        />
                                        <Label htmlFor="editInStock">In stock</Label>
                                      </div>
                                    </div>
                                    <Button type="submit" className="w-full">
                                      Update Product
                                    </Button>
                                  </form>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-semibold">Orders</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Pickup</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-sm text-gray-500">{order.customer_email}</p>
                            <p className="text-sm text-gray-500">{order.customer_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.order_items?.map((item: any) => (
                              <div key={item.id} className="text-sm">
                                {item.products?.name} x{item.quantity}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{new Date(order.pickup_date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">{order.pickup_time}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
