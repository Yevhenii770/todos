import "@testing-library/jest-dom"
import { vi } from "vitest"
import React from "react"

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: "/",
    params: {},
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js image component
vi.mock("next/image", () => ({
  default: (props: {
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
    priority?: boolean
    quality?: number
    style?: React.CSSProperties
  }) => {
    return React.createElement("img", {
      ...props,
      src: props.src,
      alt: props.alt,
    })
  },
}))

// Mock Next.js link component
vi.mock("next/link", () => ({
  default: (props: {
    href: string
    children: React.ReactNode
    className?: string
    prefetch?: boolean
    replace?: boolean
    scroll?: boolean
  }) => {
    return React.createElement(
      "a",
      {
        ...props,
        href: props.href,
      },
      props.children
    )
  },
}))

// Add any global mocks or setup here
