import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import AdminDashboard from "@/app/admin/page"

describe("AdminDashboard", () => {
  test("renders dashboard stats", () => {
    render(<AdminDashboard />)

    expect(screen.getByText("Total Products")).toBeInTheDocument()
    expect(screen.getByText("48")).toBeInTheDocument()
    expect(screen.getByText("Pending Orders")).toBeInTheDocument()
    expect(screen.getByText("12")).toBeInTheDocument()
    expect(screen.getByText("Total Customers")).toBeInTheDocument()
    expect(screen.getByText("324")).toBeInTheDocument()
  })

  test("shows products table", () => {
    render(<AdminDashboard />)

    expect(screen.getByText("Product Inventory")).toBeInTheDocument()
    expect(screen.getByText("Rainbow Cupcakes")).toBeInTheDocument()
    expect(screen.getByText("Strawberry Shortcake")).toBeInTheDocument()
    expect(screen.getByText("Chocolate Chip Cookies")).toBeInTheDocument()
  })

  test("can switch between tabs", async () => {
    render(<AdminDashboard />)

    // Click on Orders tab
    fireEvent.click(screen.getByText("Orders"))

    await waitFor(() => {
      expect(screen.getByText("Order Management")).toBeInTheDocument()
      expect(screen.getByText("ORD-001")).toBeInTheDocument()
    })

    // Click on Add Product tab
    fireEvent.click(screen.getByText("Add Product"))

    await waitFor(() => {
      expect(screen.getByText("Add New Product")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Enter product name")).toBeInTheDocument()
    })
  })

  test("can add new product", async () => {
    render(<AdminDashboard />)

    // Switch to Add Product tab
    fireEvent.click(screen.getByText("Add Product"))

    await waitFor(() => {
      // Fill out form
      fireEvent.change(screen.getByPlaceholderText("Enter product name"), {
        target: { value: "Test Product" },
      })
      fireEvent.change(screen.getByPlaceholderText("0.00"), {
        target: { value: "29.99" },
      })
      fireEvent.change(screen.getByPlaceholderText("0"), {
        target: { value: "10" },
      })

      // Submit form
      const submitButton = screen.getByText("Add Product")
      fireEvent.click(submitButton)
    })
  })
})
