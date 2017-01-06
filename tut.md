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

React Router
1. Adding
- npm install --save react-router => sau khi import, code => bi loi: Cannot read property 'getCurrentLocation' of undefined in Router.js file.
=> fix:
	npm install --save react-router@2.8.1
- sau do code:
Router component
Route configuration component
import { Router, Route } from 'react-router';
import App from './App';

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
			<Route path='/' component={App}/>
    </Router>
  </Provider>
);
2. Navigating with <Link>
- Adding parameter to Router path is very important. => It will pass params to child component.
import {Link} from 'react-router';
<Link
	to={set the path to string, using prop here to compare} eg: to={filter==="all" ? "" : filter}
	activeStyle={{
		textDecoration: 'none',
		color: 'black',
	}}
>
	{children}
</Link>
note:
	parenthesis to tell react-router that it's optional, because if it's not specified, I want to show all todos.

=> thi bi bao warning. va thay cac ky tu ki di sau dau thang tren address bar.
	doc trong tut:
		it means that you're using the version of React Router that doesn't yet default to the browserHistory, and defaults to hash history instead.
		To fix it, you can import browserHistory from React Router and pass it as a history prop to Router. 

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

2, throttle in lodash
- Wrapping my call back in a throttle call insures that the inner function that I pass is not going to be called more often than the number of milliseconds I specify.
import {thottle} from 'lodash';
thottle(callback, x);
- dam bao rang chi goi callback 1 lan trong vong x milliseconds (tinh tu lan goi gan nhat).

3, import note
su dung.
import throttle from 'lodash/thottle';
- nguyen nhan khong dung import {throttle} from 'lodash'; => import kieu nay se import toan bo lodash vao => lam cho build bi phinh to, trong khi chi dung co 1 ham throttle.
