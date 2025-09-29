// Polyfills and test setup
import '@testing-library/jest-dom'
import 'whatwg-fetch'

// Minimal localStorage mock for Node environment (jsdom provides one, but ensure methods exist)
if (typeof window !== 'undefined' && !window.localStorage) {
  const storage = {}
  window.localStorage = {
    getItem: (k) => (k in storage ? storage[k] : null),
    setItem: (k, v) => { storage[k] = String(v) },
    removeItem: (k) => { delete storage[k] },
  }
}
