"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"

interface AsyncBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
}

export function AsyncBoundary({
  children,
  fallback = <div>Loading...</div>,
  errorFallback,
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
