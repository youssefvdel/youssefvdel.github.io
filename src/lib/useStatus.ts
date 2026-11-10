import { useEffect, useState } from 'react'
import { parseStatus } from './status'
import type { Status } from './status'

export type StatusState = { phase: 'loading' } | { phase: 'live'; data: Status } | { phase: 'offline' }

const ENDPOINT = '/api/status'
const POLL_MS = 60_000

export function useStatus(): StatusState {
  const [state, setState] = useState<StatusState>({ phase: 'loading' })

  useEffect(() => {
    let alive = true
    const controller = new AbortController()

    async function load() {
      try {
        const response = await fetch(ENDPOINT, {
          cache: 'no-store',
          headers: { accept: 'application/json' },
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`status ${response.status}`)

        const data = parseStatus(await response.json())
        if (!data) throw new Error('unexpected payload')
        if (alive) setState({ phase: 'live', data })
      } catch (error) {
        if (!alive || (error instanceof DOMException && error.name === 'AbortError')) return
        setState((current) => (current.phase === 'live' ? current : { phase: 'offline' }))
      }
    }

    void load()
    const timer = window.setInterval(() => void load(), POLL_MS)

    return () => {
      alive = false
      controller.abort()
      window.clearInterval(timer)
    }
  }, [])

  return state
}
