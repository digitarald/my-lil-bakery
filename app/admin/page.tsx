"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Edit,
  Trash2,
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllProducts,
  getOrders,
  getOrderStats,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  type ProductWithCategory,
  type OrderWithItems,
  type OrderStats,
  type Category,
} from "@/lib/database";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] =
    useState<ProductWithCategory | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    ingredients: "",
    allergens: "",
    featured: false,
    inStock: true,
    preOrder: false,
    minOrderTime: "0",
  });

  // Authentication check
  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (status === "unauthenticated" || !session) {
      router.push("/auth/signin?callbackUrl=/admin");
      return;
    }

    if ((session.user as any)?.role !== "admin") {
      router.push("/"); // Redirect non-admin users to home
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    if ((session?.user as any)?.role === "admin") {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData, ordersData, statsData] =
        await Promise.all([
          getAllProducts(),
          getCategories(),
          getOrders(),
          getOrderStats(),
        ]);
      setProducts(productsData as ProductWithCategory[]);
      setCategoryList(categoriesData);
      setOrders(ordersData as OrderWithItems[]);
      setStats(statsData as OrderStats);
    } catch (error) {
      console.error("Error loading admin data:", error)
      toast.error("Error loading data. Please try refreshing the page.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        image: newProduct.image,
        categoryId: newProduct.categoryId,
        ingredients: newProduct.ingredients || null,
        allergens: newProduct.allergens || null,
        featured: newProduct.featured,
        inStock: newProduct.inStock,
        preOrder: newProduct.preOrder,
        minOrderTime: parseInt(newProduct.minOrderTime) || 0,
      };

      await createProduct(productData);
      toast.success(`${newProduct.name} has been added to the catalog.`)
      setNewProduct({
        name: "",
        description: "",
        price: "",
        image: "",
        categoryId: "",
        ingredients: "",
        allergens: "",
        featured: false,
        inStock: true,
        preOrder: false,
        minOrderTime: "0",
      });
      setIsAddingProduct(false)
      loadData()
    } catch (error) {
      console.error("Error adding product:", error)
      toast.error("Error adding product. Please try again.")
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      const updateData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        image: editingProduct.image,
        categoryId: editingProduct.categoryId,
        ingredients: editingProduct.ingredients,
        allergens: editingProduct.allergens,
        featured: editingProduct.featured,
        inStock: editingProduct.inStock,
      };

      await updateProduct(editingProduct.id, updateData);
      toast.success(`${editingProduct.name} has been updated.`)
      setEditingProduct(null)
      loadData()
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Error updating product. Please try again.")
    }
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteProduct(id);
      toast.success(`${name} has been removed from the catalog.`);
      loadData();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product. Please try again.");
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId.slice(-6)} status changed to ${newStatus}.`);
      loadData();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {status === "loading"
              ? "Checking authentication..."
              : "Loading admin dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your bakery&apos;s products and orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pendingOrders}
                  </p>
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
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            description: e.target.value,
                          })
                        }
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
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              price: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryId">Category</Label>
                        <Select
                          value={newProduct.categoryId}
                          onValueChange={(value: string) =>
                            setNewProduct({ ...newProduct, categoryId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryList.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
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
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            image: e.target.value,
                          })
                        }
                        placeholder="/placeholder.svg?height=300&width=300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ingredients">Ingredients</Label>
                      <Input
                        id="ingredients"
                        value={newProduct.ingredients}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            ingredients: e.target.value,
                          })
                        }
                        placeholder="Optional ingredients list"
                      />
                    </div>
                    <div>
                      <Label htmlFor="allergens">Allergens</Label>
                      <Input
                        id="allergens"
                        value={newProduct.allergens}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            allergens: e.target.value,
                          })
                        }
                        placeholder="Optional allergen information"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={newProduct.featured}
                          onCheckedChange={(checked: boolean) =>
                            setNewProduct({ ...newProduct, featured: checked })
                          }
                        />
                        <Label htmlFor="featured">Featured item</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="inStock"
                          checked={newProduct.inStock}
                          onCheckedChange={(checked: boolean) =>
                            setNewProduct({ ...newProduct, inStock: checked })
                          }
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
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {product.category.name}
                          </Badge>
                        </TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <Badge
                              className={
                                product.inStock
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                            {product.featured && (
                              <Badge className="bg-purple-100 text-purple-800">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteProduct(product.id, product.name)
                              }
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
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id.slice(-6)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-500">
                              {order.customerEmail}
                            </p>
                            {order.customerPhone && (
                              <p className="text-sm text-gray-500">
                                {order.customerPhone}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.orderItems?.map((item) => (
                              <div key={item.id} className="text-sm">
                                {item.product?.name} x{item.quantity}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value: string) =>
                              handleUpdateOrderStatus(order.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="CONFIRMED">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="PREPARING">
                                Preparing
                              </SelectItem>
                              <SelectItem value="READY">Ready</SelectItem>
                              <SelectItem value="COMPLETED">
                                Completed
                              </SelectItem>
                              <SelectItem value="CANCELLED">
                                Cancelled
                              </SelectItem>
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

        {/* Edit Product Dialog */}
        <Dialog
          open={!!editingProduct}
          onOpenChange={(open: boolean) => !open && setEditingProduct(null)}
        >
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
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
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea
                    id="editDescription"
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
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
                          price: parseFloat(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editCategoryId">Category</Label>
                    <Select
                      value={editingProduct.categoryId}
                      onValueChange={(value: string) =>
                        setEditingProduct({
                          ...editingProduct,
                          categoryId: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryList.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                    value={editingProduct.image || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        image: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editIngredients">Ingredients</Label>
                  <Input
                    id="editIngredients"
                    value={editingProduct.ingredients || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        ingredients: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editAllergens">Allergens</Label>
                  <Input
                    id="editAllergens"
                    value={editingProduct.allergens || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        allergens: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="editFeatured"
                      checked={editingProduct.featured}
                      onCheckedChange={(checked: boolean) =>
                        setEditingProduct({
                          ...editingProduct,
                          featured: checked,
                        })
                      }
                    />
                    <Label htmlFor="editFeatured">Featured item</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="editInStock"
                      checked={editingProduct.inStock}
                      onCheckedChange={(checked: boolean) =>
                        setEditingProduct({
                          ...editingProduct,
                          inStock: checked,
                        })
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
      </div>
    </div>
  );
}
