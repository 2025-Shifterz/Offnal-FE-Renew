export interface GetAllOrganizationsResponse {
  code: string
  message: string
  data: GetAllOrganizationsResponseData[]
}

export interface GetAllOrganizationsResponseData {
  id: number
  organizationName: string
  team: string
}
