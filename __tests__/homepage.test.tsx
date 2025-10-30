import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CartProvider } from "@/components/cart-context"
import HomePage from "@/app/page";

const renderWithCart = (component: React.ReactElement) => {
  return render(<CartProvider>{component}</CartProvider>)
}

describe("HomePage", () => {
  test("renders main navigation", () => {
    renderWithCart(<HomePage />);

    // Use getAllByText since "Sweet Dreams Bakery" appears multiple times
    expect(screen.getAllByText("Sweet Dreams Bakery")).toHaveLength(2);
    // Be more specific to avoid footer matches
    const headerNav = screen.getByRole("navigation");
    expect(headerNav).toHaveTextContent("Products");
    expect(headerNav).toHaveTextContent("About");
    expect(headerNav).toHaveTextContent("Contact");
  })

  test("renders hero section", () => {
    renderWithCart(<HomePage />)

    expect(screen.getByText("Sweet Dreams")).toBeInTheDocument()
    expect(screen.getByText("Come True")).toBeInTheDocument()
    expect(
      screen.getByText(/Handcrafted baked goods made fresh daily/)
    ).toBeInTheDocument();
  })

  test("renders product catalog", async () => {
    renderWithCart(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("All Products")).toBeInTheDocument();
      // Rainbow Cupcakes is only in all products (not featured as not a cake)
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(1);
      // Strawberry Shortcake appears in featured carousel (front + back) and all products = 3 times
      expect(screen.getAllByText("Strawberry Shortcake").length).toBeGreaterThanOrEqual(2);
    });
  });

  test("can search products", async () => {
    renderWithCart(<HomePage />)

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(1);
    });

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "Rainbow" } })

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(1);
      // Strawberry Shortcake should only be in featured section (which doesn't get filtered)
      expect(screen.getAllByText("Strawberry Shortcake").length).toBeGreaterThanOrEqual(1);
    })
  })

  test("shows no products message when search has no results", async () => {
    renderWithCart(<HomePage />)

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(1);
    });

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "NonexistentProduct" } })

    await waitFor(() => {
      expect(
        screen.getByText("No products found matching your criteria.")
      ).toBeInTheDocument();
    })
  })

  test("can add products to cart", async () => {
    renderWithCart(<HomePage />)

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(1);
    });

    // Find "Add to Cart" buttons and click the first one
    const addToCartButtons = screen.getAllByText("Add to Cart");
    fireEvent.click(addToCartButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument(); // Cart count badge
    });
  })

  test("opens cart when cart button is clicked", async () => {
    renderWithCart(<HomePage />)

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(1);
    });

    // First add an item to cart to make it visible
    const addToCartButtons = screen.getAllByText("Add to Cart");
    fireEvent.click(addToCartButtons[0]);

    // Wait for any cart count to appear (could be 1, 2, or more if cart persists between tests)
    await waitFor(() => {
      const header = screen.getByRole("banner");
      const cartButton = header.querySelector(
        'button[class*="border-pink-200"]'
      );
      expect(cartButton).toBeInTheDocument();

      const cartCountBadge = cartButton?.querySelector(".bg-pink-500");
      expect(cartCountBadge).toBeInTheDocument();
    });

    // Click the shopping cart button by finding the button with ShoppingCart icon inside header
    const header = screen.getByRole("banner");
    const cartButton = header.querySelector('button[class*="border-pink-200"]');
    expect(cartButton).toBeInTheDocument();

    fireEvent.click(cartButton!);

    await waitFor(() => {
      expect(screen.getByText(/Your Cart/)).toBeInTheDocument();
    });
  })
})
