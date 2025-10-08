import { Memo } from '../../infrastructure/local/entities/MemoEntity'
import { MemoEntity } from '../models/MemoEntity'

export const toMemoDataModel = (entity: Memo): MemoEntity => ({
  id: entity.id,
  content: entity.content,
})

export const toMemoDataModelArray = (entities: Memo[]): MemoEntity[] => {
  return entities.map(entity => toMemoDataModel(entity))
}
