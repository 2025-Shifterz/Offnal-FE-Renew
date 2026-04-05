export interface PostBedrockVisionResponse {
  code: string
  message: string
  data: BedrockVisionData
}

export interface BedrockVisionData {
  bedrockResponse: BedrockResponsePayload
}

export interface BedrockResponsePayload {
  calendars: BedrockCalendarResponse[]
  unreadableCells: UnreadableCell[]
}

export interface BedrockCalendarResponse {
  team: string
  shifts: Record<string, string>
}

export type UnreadableCell = Record<string, unknown>
