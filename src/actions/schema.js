import { schema } from 'normalizr';

export const todo = new schema.Entity('todos');
export const arrayOfTodos = [todo]; //shorthand of new schema.Array(todo);