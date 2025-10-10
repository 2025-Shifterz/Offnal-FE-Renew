import { Memo } from '../../domain/models/Memo'
import { Memo as MemoEntity } from '../../infrastructure/local/entities/MemoEntity'

export const toMemoDomain = (entity: MemoEntity): Memo => ({
  id: entity.id,
  content: entity.content,
})

export const toMemoDomainArray = (entities: MemoEntity[]): Memo[] => {
  return entities.map(entity => toMemoDomain(entity))
}
