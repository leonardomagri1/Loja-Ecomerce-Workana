import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

function createStorageMock() {
  let store: Record<string, string> = {}

  return {
    clear: () => {
      store = {}
    },
    getItem: (key: string) => store[key] ?? null,
    key: (index: number) => Object.keys(store)[index] ?? null,
    removeItem: (key: string) => {
      delete store[key]
    },
    setItem: (key: string, value: string) => {
      store[key] = String(value)
    },
    get length() {
      return Object.keys(store).length
    },
  }
}

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: createStorageMock(),
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})
