import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CartProvider } from "@/components/cart-context"
import HomePage from "@/app/page"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src || "/placeholder.svg"} alt={alt} {...props} />
  }
})

const renderWithCart = (component: React.ReactElement) => {
  return render(<CartProvider>{component}</CartProvider>)
}

describe("HomePage", () => {
  test("renders main navigation", () => {
    renderWithCart(<HomePage />)

    expect(screen.getByText("Sweet Dreams Bakery")).toBeInTheDocument()
    expect(screen.getByText("Products")).toBeInTheDocument()
    expect(screen.getByText("About")).toBeInTheDocument()
    expect(screen.getByText("Contact")).toBeInTheDocument()
  })

  test("renders hero section", () => {
    renderWithCart(<HomePage />)

    expect(screen.getByText("Sweet Dreams")).toBeInTheDocument()
    expect(screen.getByText("Come True")).toBeInTheDocument()
    expect(screen.getByText(/Handcrafted with love/)).toBeInTheDocument()
  })

  test("renders product catalog", () => {
    renderWithCart(<HomePage />)

    expect(screen.getByTestId("products-grid")).toBeInTheDocument()
    expect(screen.getByText("Rainbow Cupcakes")).toBeInTheDocument()
    expect(screen.getByText("Strawberry Shortcake")).toBeInTheDocument()
  })

  test("can search products", async () => {
    renderWithCart(<HomePage />)

    const searchInput = screen.getByTestId("search-input")
    fireEvent.change(searchInput, { target: { value: "Rainbow" } })

    await waitFor(() => {
      expect(screen.getByText("Rainbow Cupcakes")).toBeInTheDocument()
      expect(screen.queryByText("Strawberry Shortcake")).not.toBeInTheDocument()
    })
  })

  test("shows no products message when search has no results", async () => {
    renderWithCart(<HomePage />)

    const searchInput = screen.getByTestId("search-input")
    fireEvent.change(searchInput, { target: { value: "NonexistentProduct" } })

    await waitFor(() => {
      expect(screen.getByTestId("no-products")).toBeInTheDocument()
      expect(screen.getByText("No products found")).toBeInTheDocument()
    })
  })

  test("can add products to cart", async () => {
    renderWithCart(<HomePage />)

    const addToCartButton = screen.getByTestId("add-to-cart-1")
    fireEvent.click(addToCartButton)

    await waitFor(() => {
      const cartButton = screen.getByTestId("cart-button")
      expect(cartButton.querySelector(".bg-pink-500")).toBeInTheDocument()
    })
  })

  test("opens cart when cart button is clicked", async () => {
    renderWithCart(<HomePage />)

    // Add item to cart first
    const addToCartButton = screen.getByTestId("add-to-cart-1")
    fireEvent.click(addToCartButton)

    // Click cart button
    const cartButton = screen.getByTestId("cart-button")
    fireEvent.click(cartButton)

    await waitFor(() => {
      expect(screen.getByText("Your Cart (1)")).toBeInTheDocument()
    })
  })
})
