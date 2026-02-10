"use client"

import { useState, useCallback } from "react"

export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null)

  const handleError = useCallback((err: unknown, fallbackMessage = "发生错误，请重试") => {

    if (typeof err === "string") {
      setError(err)
    } else if (err instanceof Error) {
      setError(err.message || fallbackMessage)
    } else if (typeof err === "object" && err !== null && "message" in err) {
      setError((err as { message: string }).message || fallbackMessage)
    } else {
      setError(fallbackMessage)
    }

    return err
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const setTemporaryError = useCallback((message: string, duration = 3000) => {
    setError(message)
    setTimeout(() => {
      setError(null)
    }, duration)
  }, [])

  return {
    error,
    setError,
    handleError,
    clearError,
    setTemporaryError,
  }
}

