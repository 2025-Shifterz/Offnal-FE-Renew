const REDACTED = '[REDACTED]'

const SENSITIVE_KEYS = new Set([
  'authorization',
  'servicekey',
  'access_token',
  'accesstoken',
  'refresh_token',
  'refreshtoken',
  'token',
  'password',
])

const toPlainRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object') {
    return {}
  }

  const withToJSON = value as { toJSON?: () => unknown }
  const jsonValue =
    typeof withToJSON.toJSON === 'function' ? withToJSON.toJSON() : value

  if (!jsonValue || typeof jsonValue !== 'object') {
    return {}
  }

  return jsonValue as Record<string, unknown>
}

export const redactNetworkRecord = (
  value: unknown
): Record<string, unknown> => {
  const record = toPlainRecord(value)

  return Object.fromEntries(
    Object.entries(record).map(([key, entryValue]) => [
      key,
      SENSITIVE_KEYS.has(key.toLowerCase()) ? REDACTED : entryValue,
    ])
  )
}

export const redactBodyForLog = (value: unknown): string | undefined => {
  if (value === undefined || value === null) {
    return undefined
  }

  return REDACTED
}
