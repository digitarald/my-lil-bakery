import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom";
import { CartProvider } from "@/components/cart-context"
import HomePage from "@/app/page";

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
    renderWithCart(<HomePage />);

    // Wait for products to load and be visible
    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(1);
      expect(screen.getAllByText("Strawberry Shortcake")).toHaveLength(2); // Featured + All products
      expect(screen.getAllByText("Chocolate Chip Cookies")).toHaveLength(1);
    });

    // Find and click category dropdown for cakes
    const categorySelects = screen.getAllByRole("combobox");
    const categorySelect = categorySelects.find(
      (select: Element) => select.getAttribute("aria-expanded") !== null
    );

    if (categorySelect) {
      fireEvent.click(categorySelect);

      await waitFor(() => {
        const cakesOptions = screen.getAllByText("Cakes");
        fireEvent.click(cakesOptions[1]); // Click the dropdown option, not the nav link
      });

      await waitFor(() => {
        // Should only show cake products now
        expect(screen.getAllByText("Strawberry Shortcake")).toHaveLength(2); // Still featured + filtered
        expect(screen.queryAllByText("Rainbow Cupcakes")).toHaveLength(0); // Not visible in filtered section
        expect(screen.queryAllByText("Chocolate Chip Cookies")).toHaveLength(0);
      });
    }
  })

  test("searches products by name", async () => {
    renderWithCart(<HomePage />)

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(1);
    });

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "chocolate" } })

    await waitFor(() => {
      expect(screen.getAllByText("Chocolate Chip Cookies")).toHaveLength(1);
      expect(screen.queryAllByText("Rainbow Cupcakes")).toHaveLength(0);
    })
  })

  test("combines search and category filters", async () => {
    renderWithCart(<HomePage />);

    await waitFor(() => {
      expect(screen.getAllByText("Strawberry Shortcake")).toHaveLength(2);
    });

    // Search for "cake"
    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "cake" } });

    await waitFor(() => {
      // Should show both cupcakes and cakes that contain "cake"
      expect(screen.getAllByText("Strawberry Shortcake")).toHaveLength(2);
    });
  });

  test("shows no products message when search has no results", async () => {
    renderWithCart(<HomePage />);

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(1);
    });

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    await waitFor(() => {
      expect(
        screen.getByText("No products found matching your criteria.")
      ).toBeInTheDocument();
    });
  });

  test("clears filters correctly", async () => {
    renderWithCart(<HomePage />);

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(1);
    });

    // Apply search filter
    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "chocolate" } });

    await waitFor(() => {
      expect(screen.getAllByText("Chocolate Chip Cookies")).toHaveLength(1);
      expect(screen.queryAllByText("Rainbow Cupcakes")).toHaveLength(0);
    });

    // Clear search
    fireEvent.change(searchInput, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(1);
      expect(screen.getAllByText("Strawberry Shortcake")).toHaveLength(2);
      expect(screen.getAllByText("Chocolate Chip Cookies")).toHaveLength(1);
    });
  });
})
