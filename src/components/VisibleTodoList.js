import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import TodoList from './TodoList';
import {withRouter} from 'react-router';
import {getVisibleTodos, getErrorMessage, getIsFetching} from '../reducers';
import FetchError from './FetchError';

class VisibleTodoList extends Component {
	componentDidMount() {
		this.fetchData();
	}
	componentDidUpdate(prevProps) {
		if (this.props.filter !== prevProps.filter)
			this.fetchData();
	}
	fetchData() {
		const {filter, fetchTodos} = this.props;
		fetchTodos(filter)
			.then(()=>console.log("done!"));	//schedule some code after the asynchronous action has completed
	}
	render() {
		const {toggleTodo, errorMessage, todos, isFetching} = this.props;
		if (isFetching && !todos.length) {
			return <p>Loading...</p>;
		}
		if (errorMessage && !todos.length) {
			return (
				<FetchError 
					message={errorMessage}
					onRetry={()=>this.fetchData()}
				/>
			);
		}
		return (
			<TodoList 
				todos={todos}
				onTodoClick={toggleTodo}
			/>
		);
	}
}

VisibleTodoList.propTypes = {
	filter: PropTypes.oneOf(["all", "active", "completed"]).isRequired,
	todos: PropTypes.array.isRequired,
	isFetching: PropTypes.bool.isRequired,
	fetchTodos: PropTypes.func.isRequired,
	toggleTodo: PropTypes.func.isRequired,
};

const mapStateToProps = (state, {params}) => {
	const filter = params.filter || 'all';
	return {
		todos: getVisibleTodos(state, filter),
		errorMessage: getErrorMessage(state, filter),
		isFetching: getIsFetching(state, filter),
		filter,
	}
};

VisibleTodoList = withRouter(connect(
  mapStateToProps,
  actions
)(VisibleTodoList));

export default VisibleTodoList;
