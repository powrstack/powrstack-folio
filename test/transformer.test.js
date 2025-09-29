import { describe, it, expect } from 'vitest'
import { transformResumeData } from '../src/lib/dataTransformer'
import minimal from './fixtures/minimalResume.json'

describe('transformResumeData', () => {
  it('transforms minimal resume without throwing', () => {
    const out = transformResumeData(minimal)
    expect(out).toBeTruthy()
    expect(out.personalInfo.name).toBe('Test User')
    expect(out.experience[0].company).toBe('ACME')
    expect(Array.isArray(out.skills.skillNames) || out.skills).toBeTruthy()
  })

  it('handles missing optional fields gracefully', () => {
    const copy = JSON.parse(JSON.stringify(minimal))
    delete copy.basics.profiles
    const out = transformResumeData(copy)
    expect(out.personalInfo.social.github).toBeUndefined()
  })
})
