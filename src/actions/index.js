import { normalize } from 'normalizr';
import * as schema from './schema';
import { getIsFetching } from '../reducers';
import * as api from '../api';

exports.fetchTodos = (filter) => (dispatch, getState) => {
	if (getIsFetching(getState(), filter)) {
		return Promise.resolve();
	}
	dispatch({
		type: 'FETCH_TODOS_REQUEST',
		filter,
	});
	return api.fetchTodos(filter).then(
		response => {
			dispatch({
				type: 'FETCH_TODOS_SUCCESS',
				filter,
				response: normalize(response, schema.arrayOfTodos),
			});
		},
		error => {	//rejection handler
			dispatch({
				type: 'FETCH_TODOS_FAILURE',
				filter,
				message: error.message || 'Something went wrong.'
			})
		}
	);
}
exports.addTodo = (text) => (dispatch) => 
	api.addTodo(text).then(
		response => {
			dispatch({
				type: 'ADD_TODO_SUCCESS',
				response: normalize(response, schema.todo),
			})
		},
		error => {
			dispatch({
				type: 'ADD_TODO_FAILURE',
			})
		}
	);

exports.toggleTodo = (id) => (dispatch) =>
	api.toggleTodo(id).then(
		response => {
			dispatch({
				type: 'TOGGLE_TODO_SUCCESS',
				response: normalize(response, schema.todo)
			})
		},
		error => {
			dispatch({
				type: 'TOGGLE_TODO_FAILURE'
			})
		}
	);
