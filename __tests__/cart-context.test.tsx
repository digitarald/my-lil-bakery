import type React from "react"
import { renderHook, act } from "@testing-library/react"
import { CartProvider, useCart } from "@/components/cart-context"

const wrapper = ({ children }: { children: React.ReactNode }) => <CartProvider>{children}</CartProvider>

const mockItem = {
  id: "1",
  name: "Test Cupcake",
  description: "A delicious test cupcake",
  price: 24.99,
  image: "/test.jpg",
  categoryId: "1",
  inStock: true,
  featured: false,
  preOrder: true,
  minOrderTime: 24,
  ingredients: null,
  allergens: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock localStorage for testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe("CartContext", () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });
  test("should add item to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockItem);
    })

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0]).toEqual({ ...mockItem, quantity: 1 });
  })

  test("should increase quantity when adding existing item", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockItem);
      result.current.addToCart(mockItem);
    })

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(2);
  })

  test("should remove item from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockItem);
      result.current.removeFromCart(mockItem.id);
    })

    expect(result.current.cartItems).toHaveLength(0);
  })

  test("should update item quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockItem);
      result.current.updateQuantity(mockItem.id, 5)
    })

    expect(result.current.cartItems[0].quantity).toBe(5);
  })

  test("should remove item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockItem);
      result.current.updateQuantity(mockItem.id, 0)
    })

    expect(result.current.cartItems).toHaveLength(0);
  })

  test("should clear all items from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockItem);
      result.current.addToCart({ ...mockItem, id: "2", name: "Test Cookie" });
      result.current.clearCart()
    })

    expect(result.current.cartItems).toHaveLength(0);
  })

  test("should calculate total price correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockItem);
      result.current.addToCart({ ...mockItem, id: "2", price: 15.99 });
    })

    expect(result.current.getCartTotal()).toBe(40.98);
  })

  test("should calculate total items correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockItem);
      result.current.updateQuantity(mockItem.id, 3);
      result.current.addToCart({ ...mockItem, id: "2" });
    });

    // This test needs to be updated since there's no getTotalItems in the context
    expect(
      result.current.cartItems.reduce((sum, item) => sum + item.quantity, 0)
    ).toBe(4);
  })

  test("should get minimum order time correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockItem); // 24h
      result.current.addToCart({ ...mockItem, id: "2", minOrderTime: 48 }); // 48h
    })

    expect(result.current.getMinOrderTime()).toBe(48)
  })

  test("should toggle cart visibility", () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.isCartOpen).toBe(false);

    act(() => {
      result.current.toggleCart()
    })

    expect(result.current.isCartOpen).toBe(true);

    act(() => {
      result.current.toggleCart()
    })

    expect(result.current.isCartOpen).toBe(false);
  })
})
