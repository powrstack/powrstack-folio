import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as loader from '../src/lib/resumeLoader'
import minimal from './fixtures/minimalResume.json'

describe('resumeLoader', () => {
  const originalFetch = global.fetch
  const originalNextRuntime = process.env.NEXT_RUNTIME
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL

  beforeEach(() => {
    // clear caches
    try { loader.clearResumeDataCache() } catch (e) {}
    // clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portfolio_resume_cache')
      localStorage.removeItem('portfolio_resume_cache_timestamp')
    }

    process.env.NEXT_RUNTIME = 'edge'
    process.env.NEXT_PUBLIC_SITE_URL = 'https://test.example'
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()

    if (typeof originalNextRuntime === 'undefined') {
      delete process.env.NEXT_RUNTIME
    } else {
      process.env.NEXT_RUNTIME = originalNextRuntime
    }

    if (typeof originalSiteUrl === 'undefined') {
      delete process.env.NEXT_PUBLIC_SITE_URL
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl
    }
  })

  it('loads data from fetch and caches it', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(minimal) }))
    const data = await loader.loadResumeData()
    expect(data).toBeTruthy()
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://test.example/resume.json',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' })
      })
    )
    // second call should hit memory cache (no new fetch)
    global.fetch = vi.fn(() => { throw new Error('should not be called') })
    const data2 = await loader.loadResumeData()
    expect(data2).toBeTruthy()
  })

  it('falls back to localStorage when fetch fails', async () => {
    // prime localStorage with transformed data
    const transformed = { test: true }
    localStorage.setItem('portfolio_resume_cache', JSON.stringify(transformed))
    localStorage.setItem('portfolio_resume_cache_timestamp', Date.now().toString())

    global.fetch = vi.fn(() => Promise.reject(new Error('network')))
    const data = await loader.loadResumeData()
    expect(data).toEqual(transformed)
    expect(global.fetch).toHaveBeenCalled()
  })
})
