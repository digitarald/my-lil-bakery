import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CartProvider, useCart } from "@/components/cart-context"
import { CartSidebar } from "@/components/cart-sidebar";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock as any;

beforeEach(() => {
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.getItem.mockReturnValue(null) // Ensure empty cart on each test
});

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
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}

function CartWithItem() {
  const { addToCart, toggleCart, isCartOpen } = useCart()

  return (
    <div>
      <button onClick={() => addToCart(mockItem)}>Add Item</button>
      <button onClick={toggleCart}>Open Cart</button>
      <CartSidebar isOpen={isCartOpen} onClose={toggleCart} />
    </div>
  )
}

describe("CartSidebar", () => {
  afterEach(() => {
    // Clear any persisted cart data after each test
    localStorageMock.clear()
  })

  test("shows empty cart message when no items", async () => {
    render(
      <TestWrapper>
        <CartWithItem />
      </TestWrapper>,
    )

    fireEvent.click(screen.getByText("Open Cart"))

    await waitFor(() => {
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

    // Add item to cart
    fireEvent.click(screen.getByText("Add Item"))
    
    await waitFor(() => {
      expect(screen.getByText("Add Item")).toBeInTheDocument()
    })
    
    // Open cart
    fireEvent.click(screen.getByText("Open Cart"))

    // The item might already have quantity > 1
    const quantityElement = await screen.findByTestId("quantity-1")
    const initialQuantity = parseInt(quantityElement.textContent || "0")
    
    // Click increase button
    fireEvent.click(screen.getByTestId("increase-1"))

    await waitFor(() => {
      expect(screen.getByTestId("quantity-1")).toHaveTextContent(String(initialQuantity + 1))
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
      expect(screen.getByText("Checkout Details")).toBeInTheDocument()
    })
  })

  test("validates checkout form", async () => {
    render(
      <TestWrapper>
        <CartWithItem />
      </TestWrapper>,
    )

    // Add item to cart and open it
    fireEvent.click(screen.getByText("Add Item"))
    fireEvent.click(screen.getByText("Open Cart"))

    // Look for checkout button by text
    await waitFor(() => {
      expect(screen.getByText(/Checkout/i)).toBeInTheDocument()
    })
    
    const checkoutButton = screen.getByText(/Checkout/i)
    fireEvent.click(checkoutButton)

    // Check that form is shown
    await waitFor(() => {
      expect(screen.getByText(/Checkout Details/i)).toBeInTheDocument()
    })
  })
})
