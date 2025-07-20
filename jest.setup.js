import "@testing-library/jest-dom"
import { createDatabaseMocks } from "./__tests__/__mocks__/database"

// Mock the database module globally
jest.mock("@/lib/database", () => createDatabaseMocks())

// Mock Next.js Image component
jest.mock("next/image", () => {
  // eslint-disable-next-line react/display-name
  return function MockImage({ src, alt, ...props }) {
    return React.createElement("img", { src: src || "/placeholder.svg", alt, ...props })
  }
})

// Mock NextAuth.js with default unauthenticated state
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}))

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  prisma: {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}))

// Mock resend
jest.mock("@/lib/resend", () => ({
  resend: {
    emails: {
      send: jest.fn(),
    },
  },
}))

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: Object.assign(jest.fn(), {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  }),
  Toaster: () => null,
}))

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn()

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}))

// Mock React (needed for the Image component mock)
global.React = require("react")

// Silence console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}

// Mock window.location
delete window.location
window.location = {
  href: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
}
