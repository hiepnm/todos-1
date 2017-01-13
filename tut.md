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


3. using withRouter function supplied by react-router to read the params.
note:
	parenthesis to tell react-router that it's optional, because if it's not specified, I want to show all todos.

=> thi bi bao warning. va thay cac ky tu ki di sau dau thang tren address bar.
	doc trong tut:
		it means that you're using the version of React Router that doesn't yet default to the browserHistory, and defaults to hash history instead.
		To fix it, you can import browserHistory from React Router and pass it as a history prop to Router. 
4. Shorthand notation of mapDispatchToProps().
	- When the arguments for the callback prop match the arguments to the action creator exactly, there is a shorter way to specify mapDispatchToProps.
		{callback: actionCreator}
	- It is very common that the arguments passed through the callback props are passed through to the action creators in the same order.

5. Colocating Selectors with Reducers
	- My mapStateToProps function uses the getVisibleTodos function, and it passes the slice of the state corresponding to the todos. However, if I ever change the state structure, I'll have to remember to update this whole side.
	- Move the getVisibleTodos function out of my view layer and place it in the file (reducer file) that knows best about the state.todos internal structure.
	- The convention: 
		+ The default export is always the reducer function
		+ Any named export starting with get is a function that prepares the data to be displayed by the UI.
		+ => call selector, because they select something from the current state.
	- export again selector on root reducer.
		+ using the namespace import syntax to avoid the same name in the scope.
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



Review Build ReactApp with Redux.
1. Using Arrow Function:
	- Using Arrow Function voi cac function nam ngoai.
		const function_name = (params) => {

		}
	- Su dung ES6 function, voi cac function nam trong. vi du nam trong mapDispatchToProps
		{
			...
			function_name (params) {

			}
		}

2. Supplying the initialState
	- Them vao tham so thu 2 cua ham createStore.

3. Persisting the State to the LocalStorage.
	- localStorage.setItem(key, value), localStorage.getItem(key) de get, set localstorage.
	- cung cap no o tham so thu 2 cua createStore(reducer, persistenData).
	- Su dung thottle trong lodash/thottle de giam viec su dung ham JSON.stringify trong setState.
	- Su dung v4() trong node-uuid de tranh viec trung lap ID.

4. Refactoring the Entry Point.
	- Tao Root Component.
	- Tach viec configureStore ra khoi index.js

5. Adding ReactRouter
6. Navigating with <Link>
7. Filtering Redux State with ReactRouter params.
8. Using withRouter() to Inject the Params into Connected Components.
	- Trong Root Component them vao ReactRouter.
	<Provider>
		<Router history={browserHistory}>
			<Route path='/(:filter)' component={App}/>	day la cach them param va de trong dau () la optional
		</Router>
	</Provider>
	- FilterLink
	<Link 
		to={filter==='all'?'':filter}
		activeStyle={{textDecoration: 'none', color: 'black'}}
	>
		{children}
	</Link>
	- VisibileTodoList
	const mapStateToProps = (state, {params}) => {
		todos: getVisibleTodos(state.todos, params.filter || 'all')
	}
	...
	const VisibleTodoList = withRouter(connect(mapStateToProps, mapDispatchToProps)(TodoList));

9. Using mapDispatchToProps() shorthand notation.
	Nếu arg của callback function và action creator giống nhau. => có thể viết dạng ngắn gọn của mapDispatchToProps như sau:
	const VisibleTodoList = withRouter(connect(
	  mapStateToProps,
	  { onTodoClick: toggleTodo }
	)(TodoList));
	
10. Colocating Selectors with Reducers
	doc phan 5 o phia tren cung.

11. Normalizing the State Shape.
	Problem of todoApp.
		We probably have more than a single array and then todos with the same IDs in different arrays might get out of sync.
	Solution.
		Treat my state as a database.

	Mixing the objects spread operator (not ES6) with the computed property syntax
	All the state shape knowledge is encapsulated in the selector.

12. Wrapping dispatch() to Log Actions
	const addLoggingToDispatch = (store) => {
		const rawDispatch = store.dispatch;
		if (!console.group) {
			return rawDispatch;
		}
		return (action) => {
			console.group(action.type);
			console.log('%c prev state', 'color: gray', store.getState());
			console.log('%c action', 'color: blue', action);
			const returnValue = rawDispatch(action);
			console.log('%c next state', 'color: green', store.getState());
			console.groupEnd(action.type);
			return returnValue;
		}
	}

	...
	if (process.env.NODE_ENV !== 'production') {	//it will only work correctly if in the production build you use Define plugin for Webpack or transform for Browserify.
		store.dispatch = addLoggingToDispatch(store);
	}
	...

13. Adding a Fake Backend to the Project
We will learn about fake backend module that we will be using throughout the next lessons to simulate data fetching.
	- See src/api/index.js
	- This approach lets us explore how Redux works with asynchronous data fetching without writing a real backend for the app.

14. Fetching Data on Route Change
We will learn how to fire up an async request when the route changes.
I want to fetch the todos inside my component. The component that displays and selects the todos is the VisibleTodoList. 
A good place to call the API would be inside componentedDidMount life cycle hook.
see VisibleTodoList to know how to wrap Component, and define lifecycle hook like componentDidMount, componentDidUpdate.

15. Dispatching Actions with the Fetched Data
We will learn how to dispatch a Redux action after the data has been fetched and recap how to do it when the route changes.
We want the fetched todos to become a part of the Redux Store state. The only way to get something into the state is to dispatch an action.
I'm going to call the callback prop called receiveTodos, whether to todos I just fetched.
To make it available inside the component, I need to pass a function called receiveTodos that would be an action creator inside the second argument of connect function.

16.Wrapping dispatch() to Recognize Promises
We will learn how to teach dispatch() to recognize Promises so that we can move the async logic out of the components into asynchronous action creators.
Muc dich la group this code (phan code fetchTodos va receiveTodos trong VisibleTodoList) into a single action creator.
Muc dich2: move the async logic out of the components into asynchronous action creators.
sua actions/index.js
	const receiveTodos = (filter, response) => ({
		type: 'RECEIVE_TODOS',
		filter,
		response,
	});

	export const fetchTodos = (filter) => 
		api.fetchTodos(filter).then(response => 
			receiveTodos(filter, response)
		);
sua VisibleTodoList.js
	fetchData() {
		const {filter, fetchTodos} = this.props;
		fetchTodos(filter);
	}
Sua 1 hoi bi sai vi: Redux only allows dispatch in plain objects rather than promises.
Sua nhu sau: We can teach it to recognize promises by using the same trick that we use for addLoggingToDispatch.
	addLoggingToDispatch is the function we wrote before that creates the dispatch from the store and returns a new version of dispatch that logs every action and the state.
	In a similar fashion, I can create a function called addPromiseSupportToDispatch that takes the store and returns a version of dispatch that supports promises.
	check if it has a .then method that is a function, which is a way to tell if something is a promise.
	
17. The Middleware Chain.
	We will learn how we can generalize wrapping dispatch() for different purposes into a concept called “middleware” that is widely available in the Redux ecosystem.
	Middleware can serve very different purposes. It might add some useful debugging information, such as the case with login middleware, or it might amend dispatch to understand something other than plain actions, which is the case with the promise middleware.
	Middleware is a powerful system that lets us put custom behavior before action reaches the reducers.
	addPromiseSupportToDispatch returns acts like a normal dispatch function, but if it gets a promise, it waits for this promise to resolve and passes the result to rawDispatch, where rawDispatch is the previous value of store.dispatch. For non-promises, it calls rawDispatch right away.
	...
	=> we might want to override dispatch function before adding the logger.
	work, but it's not really great at re-override the public API and replace it with custom functions.
	To get away from this pattern, I am declaring an array of what I'm calling middlewares functions, which is just a fancy name I use for these functions I wrote,
		const middlewares = [];
		middlewares.push(addLoggingToDispatch);	
		middlewares.push(addPromiseSupportToDispatch);
	Write a separate function that applies the middlewares.
		middlewares.forEach(middleware=>store.dispatch = middleware(store))
	Refactor middleware function.
		there is a certain pattern that I have to repeat. I'm grabbing the value of store.dispatch, and I'm storing it in a variable called next so that I can call it later.
		To make it a part of the middleware contract, I can make next an outside argument, just like the store before it and the action after it.
	Sap xep middleware theo order cua action. 
		it would be more natural to specify the order in which the action propagates through the middlewares.
		This is why I'm changing my middleware declaration to specify them in the order in which the action travels through them.

18. Applying Redux Middleware
	using the existing core: applyMiddleware 
	and third party utilities: redux-logger, redux-promise.
		The applyMiddleware returns something called an enhancer. This is the optional last argument to create store. If you want to also supply the persistentState, you need to do this before the enhancer.



QUESTION:
Tim hieu thu tu dat middleware trong redux app.


















