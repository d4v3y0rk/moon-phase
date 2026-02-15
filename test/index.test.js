import { describe, it, expect, afterAll } from 'vitest'
import request from 'supertest'
import { app, getLedCount } from '../index.js'

describe('getLedCount', () => {
  it('returns 0 for new moon (phase 0)', () => {
    expect(getLedCount(0)).toBe(0)
  })

  it('returns 1 for early waxing', () => {
    expect(getLedCount(0.1)).toBe(1)
  })

  it('returns 3 for half moon', () => {
    expect(getLedCount(0.5)).toBe(3)
  })

  it('returns 5 for nearly full', () => {
    expect(getLedCount(0.9)).toBe(5)
  })

  it('returns 6 for full moon (phase 1.0)', () => {
    expect(getLedCount(1.0)).toBe(6)
  })

  it('returns 0 for negative values', () => {
    expect(getLedCount(-0.1)).toBe(0)
  })

  it('maps all 6 LED ranges correctly', () => {
    expect(getLedCount(0)).toBe(0)
    expect(getLedCount(1/6)).toBe(1)
    expect(getLedCount(2/6)).toBe(2)
    expect(getLedCount(3/6)).toBe(3)
    expect(getLedCount(4/6)).toBe(4)
    expect(getLedCount(5/6)).toBe(5)
    expect(getLedCount(1)).toBe(6)
  })
})

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('GET /moon', () => {
  it('returns a number between 0 and 6', async () => {
    const res = await request(app).get('/moon')
    expect(res.status).toBe(200)
    const led = parseInt(res.text)
    expect(led).toBeGreaterThanOrEqual(0)
    expect(led).toBeLessThanOrEqual(6)
  })
})

describe('GET /moon/phase', () => {
  it('returns a decimal between 0 and 1', async () => {
    const res = await request(app).get('/moon/phase')
    expect(res.status).toBe(200)
    const phase = parseFloat(res.text)
    expect(phase).toBeGreaterThanOrEqual(0)
    expect(phase).toBeLessThanOrEqual(1)
  })
})

describe('GET /moon/up', () => {
  it('returns true or false', async () => {
    const res = await request(app).get('/moon/up')
    expect(res.status).toBe(200)
    expect(['true', 'false']).toContain(res.text)
  })
})

describe('unknown routes', () => {
  it('returns 404 for unknown paths', async () => {
    const res = await request(app).get('/nonexistent')
    expect(res.status).toBe(404)
  })
})
