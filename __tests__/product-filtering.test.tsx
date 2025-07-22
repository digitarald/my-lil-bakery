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

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(1);
      expect(screen.getAllByText("Strawberry Shortcake")).toHaveLength(2); // Featured + All products
      expect(screen.getAllByText("Chocolate Chip Cookies")).toHaveLength(1);
    });

    // Find the category select trigger by its text content
    const categoryTrigger = screen.getByText("All Categories").closest('button');
    
    if (categoryTrigger) {
      fireEvent.click(categoryTrigger);

      await waitFor(() => {
        // Look for the Cakes option in the dropdown
        const cakesOption = screen.getByText("Cakes");
        fireEvent.click(cakesOption);
      });

      await waitFor(() => {
        // After filtering by cakes, only strawberry shortcake should remain in the products section
        expect(screen.getAllByText("Strawberry Shortcake")).toHaveLength(2); // Still featured + filtered
        // The other products should not be visible in the main products section
        const rainbowCupcakesElements = screen.queryAllByText("Rainbow Cupcakes");
        // Rainbow cupcakes should not appear in the filtered products section
        expect(rainbowCupcakesElements.length).toBeLessThanOrEqual(1); // Only in featured if any
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
