"use client"

import type React from "react"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CartProvider, useCart } from "@/components/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src || "/placeholder.svg"} alt={alt} {...props} />
  }
})

const mockItem = {
  id: 1,
  name: "Test Cupcake",
  price: 24.99,
  image: "/test.jpg",
  minOrderTime: 24,
  preOrder: true,
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}

function CartWithItem() {
  const { addItem, openCart } = useCart()

  return (
    <div>
      <button onClick={() => addItem(mockItem)}>Add Item</button>
      <button onClick={openCart}>Open Cart</button>
      <CartSidebar />
    </div>
  )
}

describe("CartSidebar", () => {
  test("shows empty cart message when no items", async () => {
    render(
      <TestWrapper>
        <CartWithItem />
      </TestWrapper>,
    )

    fireEvent.click(screen.getByText("Open Cart"))

    await waitFor(() => {
      expect(screen.getByTestId("empty-cart")).toBeInTheDocument()
      expect(screen.getByText("Your cart is empty")).toBeInTheDocument()
    })
  })

  test("displays cart items correctly", async () => {
    render(
      <TestWrapper>
        <CartWithItem />
      </TestWrapper>,
    )

    fireEvent.click(screen.getByText("Add Item"))
    fireEvent.click(screen.getByText("Open Cart"))

    await waitFor(() => {
      expect(screen.getByTestId("cart-item-1")).toBeInTheDocument()
      expect(screen.getByText("Test Cupcake")).toBeInTheDocument()
      expect(screen.getByText("$24.99 each")).toBeInTheDocument()
    })
  })

  test("can update item quantity", async () => {
    render(
      <TestWrapper>
        <CartWithItem />
      </TestWrapper>,
    )

    fireEvent.click(screen.getByText("Add Item"))
    fireEvent.click(screen.getByText("Open Cart"))

    await waitFor(() => {
      expect(screen.getByTestId("quantity-1")).toHaveTextContent("1")
    })

    fireEvent.click(screen.getByTestId("increase-1"))

    await waitFor(() => {
      expect(screen.getByTestId("quantity-1")).toHaveTextContent("2")
    })
  })

  test("can remove item from cart", async () => {
    render(
      <TestWrapper>
        <CartWithItem />
      </TestWrapper>,
    )

    fireEvent.click(screen.getByText("Add Item"))
    fireEvent.click(screen.getByText("Open Cart"))

    await waitFor(() => {
      expect(screen.getByTestId("cart-item-1")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId("remove-1"))

    await waitFor(() => {
      expect(screen.queryByTestId("cart-item-1")).not.toBeInTheDocument()
      expect(screen.getByTestId("empty-cart")).toBeInTheDocument()
    })
  })

  test("shows correct total price", async () => {
    render(
      <TestWrapper>
        <CartWithItem />
      </TestWrapper>,
    )

    fireEvent.click(screen.getByText("Add Item"))
    fireEvent.click(screen.getByText("Open Cart"))

    await waitFor(() => {
      expect(screen.getByTestId("cart-total")).toHaveTextContent("$24.99")
    })

    fireEvent.click(screen.getByTestId("increase-1"))

    await waitFor(() => {
      expect(screen.getByTestId("cart-total")).toHaveTextContent("$49.98")
    })
  })

  test("can proceed to checkout", async () => {
    render(
      <TestWrapper>
        <CartWithItem />
      </TestWrapper>,
    )

    fireEvent.click(screen.getByText("Add Item"))
    fireEvent.click(screen.getByText("Open Cart"))

    await waitFor(() => {
      expect(screen.getByTestId("checkout-button")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId("checkout-button"))

    await waitFor(() => {
      expect(screen.getByTestId("checkout-form")).toBeInTheDocument()
      expect(screen.getByText("Contact Information")).toBeInTheDocument()
      expect(screen.getByText("Pickup Details")).toBeInTheDocument()
    })
  })

  test("validates checkout form", async () => {
    render(
      <TestWrapper>
        <CartWithItem />
      </TestWrapper>,
    )

    fireEvent.click(screen.getByText("Add Item"))
    fireEvent.click(screen.getByText("Open Cart"))
    fireEvent.click(screen.getByTestId("checkout-button"))

    await waitFor(() => {
      const placeOrderButton = screen.getByTestId("place-order-button")
      expect(placeOrderButton).toBeDisabled()
    })

    // Fill out form
    fireEvent.change(screen.getByTestId("customer-name"), { target: { value: "John Doe" } })
    fireEvent.change(screen.getByTestId("customer-email"), { target: { value: "john@example.com" } })
    fireEvent.change(screen.getByTestId("customer-phone"), { target: { value: "555-1234" } })
    fireEvent.change(screen.getByTestId("pickup-date"), { target: { value: "2024-12-25" } })

    await waitFor(() => {
      const placeOrderButton = screen.getByTestId("place-order-button")
      expect(placeOrderButton).not.toBeDisabled()
    })
  })
})
