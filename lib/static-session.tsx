// Build-time alias for the static edition. Never requests an authentication API.
'use client'
import type { ReactNode } from 'react'
export function SessionProvider({ children }: { children: ReactNode }) { return <>{children}</> }
export function useSession() { return { data: null, status: 'unauthenticated' } }
export async function signOut() { /* No accounts in the static edition. */ }
