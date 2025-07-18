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

describe("Product Filtering", () => {
  test("filters products by category", async () => {
    renderWithCart(<HomePage />)

    // Initially should show all products
    expect(screen.getByText("Rainbow Cupcakes")).toBeInTheDocument()
    expect(screen.getByText("Strawberry Shortcake")).toBeInTheDocument()
    expect(screen.getByText("Chocolate Chip Cookies")).toBeInTheDocument()

    // Filter by Cupcakes category
    const categorySelect = screen.getByDisplayValue("All")
    fireEvent.click(categorySelect)

    await waitFor(() => {
      const cupcakesOption = screen.getByText("Cupcakes")
      fireEvent.click(cupcakesOption)
    })

    await waitFor(() => {
      expect(screen.getByText("Rainbow Cupcakes")).toBeInTheDocument()
      expect(screen.queryByText("Strawberry Shortcake")).not.toBeInTheDocument()
      expect(screen.queryByText("Chocolate Chip Cookies")).not.toBeInTheDocument()
    })
  })

  test("searches products by name", async () => {
    renderWithCart(<HomePage />)

    const searchInput = screen.getByTestId("search-input")
    fireEvent.change(searchInput, { target: { value: "chocolate" } })

    await waitFor(() => {
      expect(screen.getByText("Chocolate Chip Cookies")).toBeInTheDocument()
      expect(screen.getByText("Chocolate Brownies")).toBeInTheDocument()
      expect(screen.queryByText("Rainbow Cupcakes")).not.toBeInTheDocument()
    })
  })

  test("combines search and category filters", async () => {
    renderWithCart(<HomePage />)

    // Search for "cake"
    const searchInput = screen.getByTestId("search-input")
    fireEvent.change(searchInput, { target: { value: "cake" } })

    await waitFor(() => {
      expect(screen.getByText("Strawberry Shortcake")).toBeInTheDocument()
      expect(screen.getByText("Red Velvet Cake")).toBeInTheDocument()
    })

    // Then filter by Cakes category
    const categorySelect = screen.getByDisplayValue("All")
    fireEvent.click(categorySelect)

    await waitFor(() => {
      const cakesOption = screen.getByText("Cakes")
      fireEvent.click(cakesOption)
    })

    await waitFor(() => {
      expect(screen.getByText("Strawberry Shortcake")).toBeInTheDocument()
      expect(screen.getByText("Red Velvet Cake")).toBeInTheDocument()
      // Rainbow Cupcakes contains "cake" but is not in Cakes category
      expect(screen.queryByText("Rainbow Cupcakes")).not.toBeInTheDocument()
    })
  })

  test("shows product count", async () => {
    renderWithCart(<HomePage />)

    // Should show total count initially
    expect(screen.getByText("8 products found")).toBeInTheDocument()

    // Filter by search
    const searchInput = screen.getByTestId("search-input")
    fireEvent.change(searchInput, { target: { value: "cupcake" } })

    await waitFor(() => {
      expect(screen.getByText("1 products found")).toBeInTheDocument()
    })
  })

  test("clears filters correctly", async () => {
    renderWithCart(<HomePage />)

    // Apply search filter
    const searchInput = screen.getByTestId("search-input")
    fireEvent.change(searchInput, { target: { value: "chocolate" } })

    await waitFor(() => {
      expect(screen.getByText("2 products found")).toBeInTheDocument()
    })

    // Clear search
    fireEvent.change(searchInput, { target: { value: "" } })

    await waitFor(() => {
      expect(screen.getByText("8 products found")).toBeInTheDocument()
      expect(screen.getByText("Rainbow Cupcakes")).toBeInTheDocument()
      expect(screen.getByText("Strawberry Shortcake")).toBeInTheDocument()
    })
  })
})
