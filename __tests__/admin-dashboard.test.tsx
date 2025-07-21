import { render, screen, fireEvent } from "@testing-library/react"
import AdminDashboard from "@/app/admin/page"
import { useSession } from "next-auth/react"

// Mock modules need to be redefined for this test
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Type the mock
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Set up the mock for all tests in this file
beforeEach(() => {
  mockUseSession.mockReturnValue({
    data: {
      user: { 
        id: "admin-user", 
        email: "admin@bakery.com", 
        role: "admin" 
      } as any,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    },
    status: "authenticated",
    update: jest.fn() as any,
  })
})

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: "/admin",
    query: {},
    asPath: "/admin",
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => "/admin"),
}))

describe("AdminDashboard", () => {
  test("renders dashboard stats", async () => {
    render(<AdminDashboard />);

    expect(await screen.findByText("Admin Dashboard", {}, { timeout: 3000 })).toBeInTheDocument();

    expect(await screen.findByText("Total Orders")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Pending Orders")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("$250.00")).toBeInTheDocument();
  });

  test("shows products table", async () => {
    render(<AdminDashboard />);

    expect(await screen.findByText("Admin Dashboard", {}, { timeout: 3000 })).toBeInTheDocument();

    expect(await screen.findByText("Rainbow Cupcakes")).toBeInTheDocument();
    expect(screen.getByText("Strawberry Shortcake")).toBeInTheDocument();
    expect(screen.getByText("Chocolate Chip Cookies")).toBeInTheDocument();
  });


  test("can open add product dialog", async () => {
    render(<AdminDashboard />)

    expect(await screen.findByText("Admin Dashboard", {}, { timeout: 3000 })).toBeInTheDocument();

    // Look for the Add Product button with Plus icon
    const addProductButton = screen.getByRole('button', { name: /add product/i });
    fireEvent.click(addProductButton);

    // Check that the dialog opens
    expect(await screen.findByText("Add New Product")).toBeInTheDocument();
  })
})