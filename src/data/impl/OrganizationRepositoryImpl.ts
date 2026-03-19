import { Organization } from '../../domain/models/Organization'
import { OrganizationRepository } from '../../domain/repositories/OrganizationRepository'
import { OrganizationService } from '../../infrastructure/remote/api/OrganizationService'

// Service: 데이터를 가져오는 방법 (API 호출)
// Repository: 데이터 접근을 추상화

export class OrganizationRepositoryImpl implements OrganizationRepository {
  constructor(private organizationService: OrganizationService) {}

  async getAllOrganizations(): Promise<Organization[]> {
    try {
      const response = await this.organizationService.getAllOrganizations()
      return response
    } catch (error) {
      throw error
    }
  }
}
