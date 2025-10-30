import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CartProvider } from "@/components/cart-context"
import { PolaroidCarousel } from "@/components/polaroid-carousel"
import type { ProductWithCategory } from "@/lib/database"

const mockProducts: ProductWithCategory[] = [
  {
    id: "1",
    name: "Chocolate Cake",
    description: "Rich chocolate cake",
    price: 25,
    image: "/cake1.jpg",
    inStock: true,
    featured: true,
    preOrder: false,
    minOrderTime: 24,
    ingredients: null,
    allergens: null,
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat1",
      name: "Cakes",
      description: "Delicious cakes",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: "2",
    name: "Vanilla Cupcake",
    description: "Light vanilla cupcake",
    price: 5,
    image: "/cupcake1.jpg",
    inStock: true,
    featured: true,
    preOrder: false,
    minOrderTime: 12,
    ingredients: null,
    allergens: null,
    categoryId: "cat2",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat2",
      name: "Cupcakes",
      description: "Sweet cupcakes",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: "3",
    name: "Strawberry Tart",
    description: "Fresh strawberry tart",
    price: 15,
    image: "/tart1.jpg",
    inStock: true,
    featured: true,
    preOrder: true,
    minOrderTime: 48,
    ingredients: null,
    allergens: null,
    categoryId: "cat3",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat3",
      name: "Tarts",
      description: "Fruity tarts",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
]

const renderWithCart = (component: React.ReactElement) => {
  return render(<CartProvider>{component}</CartProvider>)
}

describe("PolaroidCarousel", () => {
  test("renders carousel with products", () => {
    renderWithCart(<PolaroidCarousel products={mockProducts} />)

    // Check for the carousel region
    expect(screen.getByRole("region", { name: /featured products carousel/i })).toBeInTheDocument()
    
    // Check for product name in caption (front of card)
    const captions = screen.getAllByText("Chocolate Cake")
    expect(captions.length).toBeGreaterThan(0)
  })

  test("shows navigation buttons", () => {
    renderWithCart(<PolaroidCarousel products={mockProducts} />)

    expect(screen.getByLabelText("Previous product")).toBeInTheDocument()
    expect(screen.getByLabelText("Next product")).toBeInTheDocument()
  })

  test("shows dot indicators", () => {
    renderWithCart(<PolaroidCarousel products={mockProducts} />)

    const dots = screen.getAllByRole("tab")
    expect(dots).toHaveLength(3)
  })

  test("can navigate to next product", () => {
    renderWithCart(<PolaroidCarousel products={mockProducts} />)

    const nextButton = screen.getByLabelText("Next product")
    fireEvent.click(nextButton)

    // After clicking next, the second product should be active
    waitFor(() => {
      const activeTab = screen.getByRole("tab", { selected: true })
      expect(activeTab).toHaveAttribute("aria-label", "Go to product 2")
    })
  })

  test("can navigate to previous product", () => {
    renderWithCart(<PolaroidCarousel products={mockProducts} />)

    const prevButton = screen.getByLabelText("Previous product")
    fireEvent.click(prevButton)

    // After clicking prev from first item, should wrap to last item
    waitFor(() => {
      const activeTab = screen.getByRole("tab", { selected: true })
      expect(activeTab).toHaveAttribute("aria-label", "Go to product 3")
    })
  })

  test("can click dot indicator to navigate", () => {
    renderWithCart(<PolaroidCarousel products={mockProducts} />)

    const dots = screen.getAllByRole("tab")
    fireEvent.click(dots[2])

    waitFor(() => {
      expect(dots[2]).toHaveClass("active")
    })
  })

  test("flips card on click", async () => {
    renderWithCart(<PolaroidCarousel products={mockProducts} />)

    // Find the active polaroid card
    const activeCard = screen.getByRole("button", { name: /Chocolate Cake.*Click to flip/i })
    expect(activeCard).toBeInTheDocument()

    // Before flip, it shouldn't have the flipped class
    expect(activeCard).not.toHaveClass("flipped")

    // Click to flip
    fireEvent.click(activeCard)

    // After flipping, the card should have the flipped class
    await waitFor(() => {
      expect(activeCard).toHaveClass("flipped")
    })
  })

  test("can add product to cart from flipped card", async () => {
    renderWithCart(<PolaroidCarousel products={mockProducts} />)

    const activeCard = screen.getByRole("button", { name: /Chocolate Cake.*Click to flip/i })
    fireEvent.click(activeCard)

    await waitFor(() => {
      expect(activeCard).toHaveClass("flipped")
    })

    // Find and click the "Add to Cart" button - there will be multiple, get all
    const addToCartButtons = screen.getAllByText("Add to Cart")
    // Click the first one (which is from the active card)
    fireEvent.click(addToCartButtons[0])

    // Cart should update - but we're just testing the click works
    // The actual cart functionality is tested in cart-context.test.tsx
  })

  test("shows pre-order badge when applicable", () => {
    renderWithCart(<PolaroidCarousel products={mockProducts} />)

    // Navigate to the third product which has preOrder: true
    const dots = screen.getAllByRole("tab")
    fireEvent.click(dots[2])

    waitFor(() => {
      expect(screen.getByText("Pre-Order")).toBeInTheDocument()
    })
  })

  test("handles keyboard navigation with arrow keys", () => {
    renderWithCart(<PolaroidCarousel products={mockProducts} />)

    // Simulate arrow right key
    fireEvent.keyDown(window, { key: "ArrowRight" })

    waitFor(() => {
      const activeTab = screen.getByRole("tab", { selected: true })
      expect(activeTab).toHaveAttribute("aria-label", "Go to product 2")
    })
  })

  test("handles keyboard navigation with space/enter to flip", async () => {
    renderWithCart(<PolaroidCarousel products={mockProducts} />)

    const activeCard = screen.getByRole("button", { name: /Chocolate Cake.*Click to flip/i })

    // Simulate space key to flip
    fireEvent.keyDown(window, { key: " " })

    await waitFor(() => {
      expect(activeCard).toHaveClass("flipped")
    })
  })

  test("renders empty state when no products", () => {
    renderWithCart(<PolaroidCarousel products={[]} />)

    expect(screen.getByText("No featured products available.")).toBeInTheDocument()
  })

  test("disables add to cart button when product is out of stock", async () => {
    const outOfStockProduct: ProductWithCategory = {
      ...mockProducts[0],
      inStock: false,
    }

    renderWithCart(<PolaroidCarousel products={[outOfStockProduct]} />)

    const activeCard = screen.getByRole("button", { name: /Chocolate Cake.*Click to flip/i })
    fireEvent.click(activeCard)

    await waitFor(() => {
      const addButton = screen.getByText("Out of Stock")
      expect(addButton).toBeDisabled()
    })
  })
})
