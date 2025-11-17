import { Memo } from '../../domain/models/Memo'
import { Memo as MemoEntity } from '../../infrastructure/local/entities/MemoEntity'
import dayjs from 'dayjs'

export const toMemoDomain = (entity: MemoEntity): Memo => ({
  id: entity.id,
  title: entity.title,
  content: entity.content,
  targetDate: dayjs(entity.targetDate).toISOString(),
})

export const toMemoDomainArray = (entities: MemoEntity[]): Memo[] => {
  return entities.map(entity => toMemoDomain(entity))
}
