import { Organization } from '../models/Organization'

export interface OrganizationRepository {
  getAllOrganizations(): Promise<Organization[]>
}
