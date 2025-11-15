export interface MemberRepository {
  isMemberScheduleRegistered(): Promise<boolean>

  withDrawMember(): Promise<void>
}
