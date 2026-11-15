import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import Header from '@/components/Header'

const route = vi.hoisted(() => ({ pathname: '/' }))
vi.mock('next/link', () => ({ default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a href={href} {...props}>{children}</a> }))
vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }))
vi.mock('next-auth/react', () => ({ useSession: () => ({ data: null, status: 'unauthenticated' }), signOut: vi.fn() }))

// Model the real pointer event order; click alone hid the close/reopen regression.
function tap(element: HTMLElement) {
  fireEvent.pointerDown(element)
  fireEvent.pointerUp(element)
  fireEvent.click(element)
}
const toggle = () => screen.getByRole('button', { name: /^(Open|Close) menu$/ })
const menu = () => screen.queryByRole('navigation', { name: 'Mobile navigation' })
beforeEach(() => {
  vi.stubGlobal('React', React)
  vi.stubEnv('NEXT_PUBLIC_STATIC_EXPORT', 'true')
  localStorage.clear()
  route.pathname = '/'
})
afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.unstubAllGlobals() })

describe('Header mobile menu', () => {
  it('opens and closes with the full pointer event sequence, repeatedly', () => {
    render(<Header />)
    for (let i = 0; i < 2; i++) {
      tap(toggle())
      expect(menu()).toBeInTheDocument()
      expect(toggle()).toHaveAttribute('aria-expanded', 'true')
      tap(toggle())
      expect(menu()).not.toBeInTheDocument()
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    }
  })
  it('ignores a pointer inside the menu, dismisses on outside pointer and navigation', () => {
    const view = render(<Header />)
    tap(toggle())
    fireEvent.pointerDown(menu()!)
    expect(menu()).toBeInTheDocument()
    fireEvent.pointerDown(document.body)
    expect(menu()).not.toBeInTheDocument()
    tap(toggle())
    tap(within(menu()!).getByRole('link', { name: 'Map' }))
    expect(menu()).not.toBeInTheDocument()
    tap(toggle())
    route.pathname = '/quiz'
    view.rerender(<Header />)
    expect(menu()).not.toBeInTheDocument()
  })
  it('retains click-only activation used by keyboard button activation', () => {
    render(<Header />)
    // Native Enter/Space synthesis is covered by the real Chromium CI test.
    fireEvent.click(toggle(), { detail: 0 })
    expect(menu()).toBeInTheDocument()
    fireEvent.click(toggle(), { detail: 0 })
    expect(menu()).not.toBeInTheDocument()
  })
})
