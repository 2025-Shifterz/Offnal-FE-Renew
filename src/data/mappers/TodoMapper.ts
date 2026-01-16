import { Todo as TodoDomain } from '../../domain/models/Todo'
import { Todo } from '../../infrastructure/local/entities/TodoEntity'

export const toTodoDomain = (entity: Todo): TodoDomain => ({
  id: entity.id,
  content: entity.content,
  isCompleted: entity.completed, // DB의 0/1 값을 boolean으로 변환
  targetDate: entity.targetDate, // Unix timestamp 매핑
})

export const toTodosDomain = (entities: Todo[]): TodoDomain[] => {
  return entities.map(entity => toTodoDomain(entity))
}
