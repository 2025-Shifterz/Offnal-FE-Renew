export const formatRemainingTime = (
  nextTriggerAtMillis: number,
  referenceMillis: number = Date.now()
): string => {
  const remainingMillis = nextTriggerAtMillis - referenceMillis
  const isPast = remainingMillis < 0
  const totalMinutes = Math.floor(Math.abs(remainingMillis) / 60_000)
  const days = Math.floor(totalMinutes / (24 * 60))
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const minutes = totalMinutes % 60

  const segments: string[] = []

  if (days > 0) {
    segments.push(`${days}일`)
  }

  if (hours > 0) {
    segments.push(`${hours}시간`)
  }

  if (minutes > 0) {
    segments.push(`${minutes}분`)
  }

  if (segments.length === 0) {
    return isPast ? '방금 전' : '지금'
  }

  if (segments.length === 1) {
    return `${segments[0]} ${isPast ? '전' : '후'}`
  }

  return `${segments.join(' ')} ${isPast ? '전' : '후'}`
}
