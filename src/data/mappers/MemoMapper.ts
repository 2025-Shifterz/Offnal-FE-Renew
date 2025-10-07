import { Memo } from '../../domain/models/Memo'
import { MemoEntity } from '../models/MemoEntity'

export const toMemoDomain = (entity: MemoEntity): Memo => ({
  id: entity.id,
  content: entity.content,
})

export const fromMemoDomain = (domain: Memo): MemoEntity => ({
  id: domain.id,
  content: domain.content,
})
