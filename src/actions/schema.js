import { schema } from 'normalizr';

const todo = new schema.Entity('todos');
exports.todo = todo;
exports.arrayOfTodos = [todo]; //shorthand of new schema.Array(todo);