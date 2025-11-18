import { MemberRepository } from '../../domain/repositories/MemberRepository'
import { MemberService } from '../../infrastructure/remote/api/MemberService'

export class MemberRepositoryImpl implements MemberRepository {
  constructor(private memberService: MemberService) {}
  async withDrawMember(): Promise<void> {
    await this.memberService.withdrawMember()
  }
}
