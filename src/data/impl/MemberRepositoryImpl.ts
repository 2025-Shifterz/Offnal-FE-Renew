import { MemberRepository } from '../../domain/repositories/MemberRepository'
import { HomeService } from '../../infrastructure/remote/api/HomeService'
import { MemberService } from '../../infrastructure/remote/api/MemberService'

export class MemberRepositoryImpl implements MemberRepository {
  constructor(
    private homeService: HomeService,
    private memberService: MemberService
  ) {}

  async isMemberScheduleRegistered(): Promise<boolean> {
    const result = await this.homeService.getHome().then(
      data => data != null,
      () => false
    )

    return result
  }

  async withDrawMember(): Promise<void> {
    await this.memberService.withdrawMember()
  }
}
