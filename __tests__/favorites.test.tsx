/**
 * Favorites functionality tests
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { FavoriteButton } from "@/components/favorite-button"

// Mock the useSession hook directly in the test
const mockUseSession = jest.fn()
jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  useSession: () => mockUseSession(),
}))

describe("FavoriteButton", () => {
  const mockSession = {
    user: { id: "user1", name: "Test User", email: "test@example.com" },
    expires: "2024-12-31",
  }

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it("renders favorite button", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "authenticated",
      update: jest.fn(),
    })

    render(<FavoriteButton productId="1" />)
    
    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
  })

  it("shows unfilled heart when not favorited", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "authenticated",
      update: jest.fn(),
    })

    render(<FavoriteButton productId="1" isFavorited={false} />)
    
    const button = screen.getByRole("button")
    const svg = button.querySelector("svg")
    expect(svg).not.toHaveClass("fill-red-500")
  })

  it("shows filled heart when favorited", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "authenticated",
      update: jest.fn(),
    })

    render(<FavoriteButton productId="1" isFavorited={true} />)
    
    const button = screen.getByRole("button")
    const svg = button.querySelector("svg")
    expect(svg).toHaveClass("fill-red-500")
  })

  it("requires authentication to favorite", async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: jest.fn(),
    })

    // Mock console.error to avoid error output in tests
    const consoleError = jest.spyOn(console, "error").mockImplementation()

    render(<FavoriteButton productId="1" />)
    
    const button = screen.getByRole("button")
    fireEvent.click(button)

    // In this implementation, unauthenticated users see a toast
    // We can't test toast directly since it's mocked, but we can verify fetch wasn't called
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled()
    })

    consoleError.mockRestore()
  })

  it("adds product to favorites", async () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "authenticated",
      update: jest.fn(),
    })

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    const onFavoriteChange = jest.fn()
    render(
      <FavoriteButton
        productId="1"
        productName="Test Product"
        isFavorited={false}
        onFavoriteChange={onFavoriteChange}
      />
    )
    
    const button = screen.getByRole("button")
    fireEvent.click(button)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/favorites",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ productId: "1" }),
        })
      )
      expect(onFavoriteChange).toHaveBeenCalledWith(true)
    })
  })

  it("removes product from favorites", async () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "authenticated",
      update: jest.fn(),
    })

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    const onFavoriteChange = jest.fn()
    render(
      <FavoriteButton
        productId="1"
        productName="Test Product"
        isFavorited={true}
        onFavoriteChange={onFavoriteChange}
      />
    )
    
    const button = screen.getByRole("button")
    fireEvent.click(button)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/favorites/1",
        expect.objectContaining({
          method: "DELETE",
        })
      )
      expect(onFavoriteChange).toHaveBeenCalledWith(false)
    })
  })

  it("handles API errors gracefully", async () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "authenticated",
      update: jest.fn(),
    })

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to add favorite" }),
    })

    // Mock console.error to avoid error output in tests
    const consoleError = jest.spyOn(console, "error").mockImplementation()

    render(<FavoriteButton productId="1" isFavorited={false} />)
    
    const button = screen.getByRole("button")
    fireEvent.click(button)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    consoleError.mockRestore()
  })
})
