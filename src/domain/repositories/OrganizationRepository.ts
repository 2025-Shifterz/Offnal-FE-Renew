import { Organization } from '../models/Organization'

export interface OrganizationRepository {
  getOrganization(): Promise<Organization> // TODO: 단일 조직 반환으로 바꾸기
}
