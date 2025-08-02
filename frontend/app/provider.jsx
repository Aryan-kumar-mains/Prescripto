"use client"

import { SessionProvider } from "next-auth/react"
import { LoadingProvider } from "@/app/_components/general/LoadingSpinner"

export function Providers({ children }) {
  return (
    <SessionProvider>
      <LoadingProvider>
        {children}
      </LoadingProvider>
    </SessionProvider>
  )
}
