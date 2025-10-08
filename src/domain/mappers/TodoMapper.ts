import { TodoEntity } from '../../data/models/TodoEntity'
import { Todo } from '../models/Todo'

export const toTodoDomain = (data: TodoEntity): Todo => ({
  id: data.id,
  content: data.content,
  isCompleted: data.isCompleted,
})

export const toTodosDomain = (data: TodoEntity[]): Todo[] => {
  return data.map(todo => toTodoDomain(todo))
}
