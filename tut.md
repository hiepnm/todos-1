Simplifying the Arrow Functions
How to reduce the syntactic noise in the action creators and components when using arrow functions.
	- If the arrow function only contains a single return statement, you can replace the body of the arrow function with just a value. 
		If this value is an object, don't forget to wrap it in parenthesis so that the parser understands that this is an expression and not a block.
	- Also, it can be nicer to use the concise method notation inside mapDispatchToProps, instead of arrow functions because it's harder.

Supplying the Initial State
	- The initial state of the combineReducer function is going to be an object containing initial state of each member in it.
		=> become initial state of store.
	- However, sometimes we want to load some existing data into the app synchronously before it starts.
	- Redux lets me pass the persistentState as the second argument to the createStore function, and it will override the value specified by the reducers. 
		With keys that don't appear in persistentState (ex: visibilityFilter in tutorial), It take the default value specified by the reducer. (reducer take control)
	- You might get tempted to specify all the initial state tree of your app in a single place and pass it to createStore, but we don't recommend this. Co-locating the initial state with the reducer definition makes it easy to test and change, so you should always strive to do that.


OUTSIDE
Implementation of createStore and combineReducers
const createStore = (reducer, persistentState) => {
	let state = persistentState;
	let listeners = [];
	const getState = () => state;
	const dispatch = (action) => {
		state = reducer(state, action);
		listeners.forEach(listener => listener());	
	}
	const subscribe = (listener) => {
		listeners.push(listener);
		return () => {
			listners = listeners.filter(l=>l!==listener);
		};
	}
	dispatch({});
	return {getState, dispatch, subscribe};
}
const combineReducers = (reducers) => {
	return (state={},action)=>{
		return Object.keys(reducers).reduce(
			(nextState, key) => {
				nextState = reducers[key](state[key], action);
				return nextState;
			},
			{}
		);
	}
}