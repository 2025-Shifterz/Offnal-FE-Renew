import { Todo as TodoDomain } from '../../domain/models/Todo'
import { Todo } from '../../infrastructure/local/entities/TodoEntity'

export const toTodoDomain = (entity: Todo): TodoDomain => ({
  id: entity.id,
  content: entity.content,
  isCompleted: entity.completed,
})

export const toTodosDomain = (entities: Todo[]): TodoDomain[] => {
  return entities.map(entity => toTodoDomain(entity))
}
