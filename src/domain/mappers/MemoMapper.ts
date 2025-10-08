import { MemoEntity } from '../../data/models/MemoEntity'
import { Memo } from '../models/Memo'

export const toMemoDomain = (entity: MemoEntity): Memo => ({
  id: entity.id,
  content: entity.content,
})
