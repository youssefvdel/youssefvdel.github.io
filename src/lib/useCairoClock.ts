import { useEffect, useState } from 'react'

const cairoTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Cairo',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export function useCairoClock() {
  const [time, setTime] = useState(() => cairoTime.format(new Date()))

  useEffect(() => {
    const timer = window.setInterval(() => setTime(cairoTime.format(new Date())), 15_000)
    return () => window.clearInterval(timer)
  }, [])

  return time
}
