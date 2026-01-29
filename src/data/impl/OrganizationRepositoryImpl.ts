import { Organization } from '../../domain/models/Organization'
import { OrganizationRepository } from '../../domain/repositories/OrganizationRepository'
import { OrganizationService } from '../../infrastructure/remote/api/OrganizationService'

// Service: 데이터를 가져오는 방법 (API 호출)
// Repository: 데이터 접근을 추상화

export class OrganizationRepositoryImpl implements OrganizationRepository {
  constructor(private organizationService: OrganizationService) {}

  async getOrganization(): Promise<Organization> {
    try {
      const response = await this.organizationService.getOrganization()
      // 배열 중 마지막 조직을 반환
      if (response.length === 0) {
        return {} as Organization
      }
      return response[response.length - 1] // TODO : 단일 조직 반환으로 바꾸기 -> 객체 형태로
    } catch (error) {
      throw error
    }
  }
}
