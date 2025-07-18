import type React from "react"
import { renderHook, act } from "@testing-library/react"
import { CartProvider, useCart } from "@/components/cart-context"

const wrapper = ({ children }: { children: React.ReactNode }) => <CartProvider>{children}</CartProvider>

const mockItem = {
  id: 1,
  name: "Test Cupcake",
  price: 24.99,
  image: "/test.jpg",
  minOrderTime: 24,
  preOrder: true,
}

describe("CartContext", () => {
  test("should add item to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockItem)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]).toEqual({ ...mockItem, quantity: 1 })
  })

  test("should increase quantity when adding existing item", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockItem)
      result.current.addItem(mockItem)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })

  test("should remove item from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockItem)
      result.current.removeItem(mockItem.id)
    })

    expect(result.current.items).toHaveLength(0)
  })

  test("should update item quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockItem)
      result.current.updateQuantity(mockItem.id, 5)
    })

    expect(result.current.items[0].quantity).toBe(5)
  })

  test("should remove item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockItem)
      result.current.updateQuantity(mockItem.id, 0)
    })

    expect(result.current.items).toHaveLength(0)
  })

  test("should clear all items from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockItem)
      result.current.addItem({ ...mockItem, id: 2, name: "Test Cookie" })
      result.current.clearCart()
    })

    expect(result.current.items).toHaveLength(0)
  })

  test("should calculate total price correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockItem)
      result.current.addItem({ ...mockItem, id: 2, price: 15.99 })
    })

    expect(result.current.getTotalPrice()).toBe(40.98)
  })

  test("should calculate total items correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockItem)
      result.current.updateQuantity(mockItem.id, 3)
      result.current.addItem({ ...mockItem, id: 2 })
    })

    expect(result.current.getTotalItems()).toBe(4)
  })

  test("should get minimum order time correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockItem) // 24h
      result.current.addItem({ ...mockItem, id: 2, minOrderTime: 48 }) // 48h
    })

    expect(result.current.getMinOrderTime()).toBe(48)
  })

  test("should toggle cart visibility", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.toggleCart()
    })

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.toggleCart()
    })

    expect(result.current.isOpen).toBe(false)
  })
})
