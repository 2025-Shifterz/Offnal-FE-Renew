import { Todo } from '../../infrastructure/local/entities/TodoEntity'
import { TodoEntity } from '../models/TodoEntity'

export const toTodoDataModel = (entity: Todo): TodoEntity => ({
  id: entity.id,
  content: entity.content,
  isCompleted: entity.completed,
})

export const toTodoDataModelArray = (entities: Todo[]): TodoEntity[] => {
  return entities.map(entity => toTodoDataModel(entity))
}
