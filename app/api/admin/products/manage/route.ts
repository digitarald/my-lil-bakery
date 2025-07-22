import { NextRequest, NextResponse } from "next/server"
import { createProduct, updateProduct, deleteProduct } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    const product = await createProduct(productData)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...productData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const product = await updateProduct(id, productData)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    await deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
