import { OcrResult, OcrResultItem } from '../../domain/models/OcrResult'
import { PostBedrockVisionResponse } from '../../infrastructure/remote/response/PostBedrockVisionResponse'

export const toOcrResultDomain = (
  response: PostBedrockVisionResponse
): OcrResult => {
  return response.data.bedrockResponse.calendars.map(
    ({ team, shifts }): OcrResultItem => ({
      team: normalizeTeamNumber(team),
      shifts,
    })
  )
}

function normalizeTeamNumber(team: string) {
  const trimmedTeam = team.trim()

  if (trimmedTeam.endsWith('조')) {
    return trimmedTeam.slice(0, -1)
  }

  return trimmedTeam
}
