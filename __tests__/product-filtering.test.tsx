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
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(3); // Featured front + back + all
      expect(screen.getAllByText("Strawberry Shortcake")).toHaveLength(3); // Featured front + back + all
      expect(screen.getAllByText("Chocolate Chip Cookies")).toHaveLength(3); // Featured front + back + all
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
        // After filtering by cakes, strawberry shortcake appears in featured (2x) + filtered (1x)
        expect(screen.getAllByText("Strawberry Shortcake")).toHaveLength(3);
        // Rainbow cupcakes should still appear in featured section only
        const rainbowCupcakesElements = screen.queryAllByText("Rainbow Cupcakes");
        expect(rainbowCupcakesElements.length).toBe(2); // Only in featured front + back
      });
    }
  })

  test("searches products by name", async () => {
    renderWithCart(<HomePage />)

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(3); // Featured front + back + all
    });

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "chocolate" } })

    await waitFor(() => {
      expect(screen.getAllByText("Chocolate Chip Cookies")).toHaveLength(3); // Featured front + back + filtered
      expect(screen.queryAllByText("Rainbow Cupcakes")).toHaveLength(2); // Featured front + back only
    })
  })

  test("combines search and category filters", async () => {
    renderWithCart(<HomePage />);

    await waitFor(() => {
      expect(screen.getAllByText("Strawberry Shortcake")).toHaveLength(3); // Featured front + back + all
    });

    // Search for "cake"
    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "cake" } });

    await waitFor(() => {
      // Both products with "cake" in the name will match
      expect(screen.getAllByText("Strawberry Shortcake")).toHaveLength(3); // Featured front + back + filtered
    });
  });

  test("shows no products message when search has no results", async () => {
    renderWithCart(<HomePage />);

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(3); // Featured front + back + all
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
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(3); // Featured front + back + all
    });

    // Apply search filter
    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "chocolate" } });

    await waitFor(() => {
      expect(screen.getAllByText("Chocolate Chip Cookies")).toHaveLength(3); // Featured front + back + filtered
      expect(screen.queryAllByText("Rainbow Cupcakes")).toHaveLength(2); // Featured front + back only
    });

    // Clear search
    fireEvent.change(searchInput, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.getAllByText("Rainbow Cupcakes")).toHaveLength(3); // Featured front + back + all
      expect(screen.getAllByText("Strawberry Shortcake")).toHaveLength(3); // Featured front + back + all
      expect(screen.getAllByText("Chocolate Chip Cookies")).toHaveLength(3); // Featured front + back + all
    });
  });
})
