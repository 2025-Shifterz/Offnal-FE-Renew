import { useEffect, useState } from 'react'

export const useCurrentTimeTick = (intervalMs: number = 60_000): number => {
  const [nowMillis, setNowMillis] = useState(() => Date.now())

  useEffect(() => {
    if (intervalMs <= 0) {
      return undefined
    }

    const timerId = setInterval(() => {
      setNowMillis(Date.now())
    }, intervalMs)

    return () => {
      clearInterval(timerId)
    }
  }, [intervalMs])

  return nowMillis
}
