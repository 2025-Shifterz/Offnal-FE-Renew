import { Todo } from '../../../domain/models/Todo';
import { TodoEntity } from '../models/TodoEntity';

export const toTodoDomain = (entity: TodoEntity): Todo => ({
  id: entity.id,
  content: entity.content,
  isCompleted: entity.isCompleted,
});

export const fromTodoDomain = (domain: Todo): TodoEntity => ({
  id: domain.id,
  content: domain.content,
  isCompleted: domain.isCompleted,
});