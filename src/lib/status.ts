export type Service = {
  name: string
  up: boolean
  ms: number
}

export type Status = {
  services: Service[]
  uptime: number
  load1: number
  memUsed: number
  memTotal: number
  diskUsed: number
  diskTotal: number
  probedAt: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function parseStatus(raw: unknown): Status | null {
  if (!isRecord(raw) || !Array.isArray(raw.services)) return null

  const services: Service[] = []
  for (const entry of raw.services) {
    if (!isRecord(entry) || typeof entry.name !== 'string' || typeof entry.up !== 'boolean') {
      return null
    }
    services.push({
      name: entry.name,
      up: entry.up,
      ms: isFiniteNumber(entry.ms) ? entry.ms : 0,
    })
  }

  const { uptime, load1, memUsed, memTotal, diskUsed, diskTotal, probedAt } = raw
  if (
    !isFiniteNumber(uptime) ||
    !isFiniteNumber(load1) ||
    !isFiniteNumber(memUsed) ||
    !isFiniteNumber(memTotal) ||
    !isFiniteNumber(diskUsed) ||
    !isFiniteNumber(diskTotal)
  ) {
    return null
  }

  const probed = typeof probedAt === 'number' ? probedAt : typeof probedAt === 'string' ? Date.parse(probedAt) : NaN
  if (!Number.isFinite(probed)) return null

  return {
    services,
    uptime,
    load1,
    memUsed,
    memTotal,
    diskUsed,
    diskTotal,
    probedAt: probed,
  }
}

export function formatAgo(then: number, now: number): string {
  const seconds = Math.max(0, Math.round((now - then) / 1000))
  if (seconds < 2) return 'just now'
  if (seconds < 60) return `${seconds} s ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h ago`

  return `${Math.floor(hours / 24)} d ago`
}

export function formatUptime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  if (total < 60) return `${total} s`

  const minutes = Math.floor(total / 60)
  if (minutes < 60) return `${minutes} min`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h ${minutes % 60} min`

  return `${Math.floor(hours / 24)} d ${hours % 24} h`
}

export function formatCapacity(used: number, total: number): string {
  const scale = (value: number) => (value >= 100 ? Math.round(value).toString() : value.toFixed(1))
  return `${scale(used / 1e9)} / ${scale(total / 1e9)} GB`
}
