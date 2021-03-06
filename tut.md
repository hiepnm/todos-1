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

19. Updating the State with the Fetched Data.
	We will learn how moving the "source of truth" for the data to the server changes the state shape and the reducers in our app.
	See reducers/todos.js to see problem
		If we have thousands of todos on the server, it would be impractical to fetch them all and filter them on the client.
		Solution:
			Rather than keep a big list of IDs, we'll keep a list of IDs for every tab so that they can be stored separately and filled according with the actions with the fetch data on the corresponding tab.
	Hieu duoc bai nay phai 
	xem lai 1 chuoi bai truoc do.
		video ve inject store.getState su dung Provider (hay context), tao thanh tu mapStateToProps tu khoa hoc truoc.
		video 9 dispatch shorthand.
		video 16 ve promise: Wraping dispatch to recognize Promise.
	hieu duoc co che promise khi dispatch roi render lai. 
		render => ComponentDidMount => dispatch(fetchTodo) => fetchTodo => response => receiveTodos => dispatch(receiveTodo) => update state in store => update Component.
		
20. Refactoring the Reducers
	We will learn how to remove the duplication in our reducer files and how to keep the knowledge about the state shape colocated with the newly extracted reducers.
	Tóm lại ở đây, tách ra các reducer và export 1 vài selector. Mục đích của selector thì rõ ràng là để việc thay đổi code về sau, chỉ xảy ra ở module chứa selector đó. Nếu không dùng selector thì sao, thì mai sau thay đổi code base thì phải thay đổi khá nhiều chỗ. Ví dụ trong index.js hoàn toàn có thể sử dụng.
		export const getVisibleTodos = (state, filter) => {
			const ids = fromList.getIds(state.listByFilter[filter]);
			return ids.map(id => state.byId[id]);	//tôi muốn nhắc đến dòng này. nhưng phải thay đổi để dùng selector của byId.
		};

		//như sau.
		export const getVisibleTodos = (state, filter) => {
			const ids = fromList.getIds(state.listByFilter[filter]);
			return ids.map(id => fromById.getTodo(state.byId, id));	//dùng selector như này.
		};

		Since I also moved the byId reducer into a separate file, I also don't want to make an assumption that it's just a lookup table, and I will use fromById.getTodo selector that it exports and pass its state and the corresponding id. This lets me change the state shape of any reducer in the future without rippling changes across the code base.

21. Displaying Loading Indicators
	=> create a action creator name requestTodos => dispatch it in the component before fetchTodo. type action is REQUEST_TODO.
	Modify the state shape of the list => an object that contains this array as a property. => and add a selector to select ids array and this properties. 
	=> this property (isFetching) viet thanh 1 reducer, nhan aciton REQUEST_TODO return true, nhan action RECEIVE_TODO return false.
	
22. Dispatching Actions Asynchronously with Thunks 
	We will learn about “thunks”—the most common way to write async action creators in Redux.
	How thunk middleware lets us dispatch multiple actions asynchronously.
	Muc dich cua video:
		It would be great if I could make requestTodos dispatched automatically when I fetch the todos because I never want to fire them separately.
	An action promise resolves through a single action at the end, but we want an abstraction that represents multiple actions dispatched over the period of time.
	This is why rather than return a promise, I want to return a function that accepts a dispatch callback argument.
	This lets me call dispatch as many times as I like at any point of time during the async operation.
	change 
	export const fetchTodos = (filter) => 
		api.fetchTodos(filter).then(response => 
			receiveTodos(filter, response))
	to
	export const fetchTodos = (filter) => (dispatch) => {
		dispatch(requestTodos(filter));

		return api.fetchTodos(filter).then(response => {
			dispatch(receiveTodos(filter, response));
		});
	}
		This means more typing than returning a promise, but it also gives me more flexibility. A promise can only express one async value, so fetchTodos now returns a function with a callback argument so that it can call it multiple times during the async operation.
	Such functions returned from other functions are often called thunks, so we're going to implement a thunk middleware to support them.
	Bay gio hieu nhu nay. action la function thi no la thunk.
	When we see an action that is really a function, a thunk, we call it with store.dispatch as an argument so that it can dispatch other actions by itself. 
	No matter what gets dispatched, it will go through the middleware chain again, and if its type is a function, it will be called like a thunk, but otherwise, it will be passed on to the next middleware in chain.
	Da hieu tai sao dat la next. Vi theo chieu goi function store.dispatch thi thunk -> logger -> raw. Nhu vay logger la next cua thunk. raw la next cua logger.
	=> mang middlewares cung sep theo thu tu cua chain nay (chieu goi dispatch)

23. Avoiding Race Conditions with Thunks
	We will learn how Redux Thunk middleware lets us conditionally dispatch actions to avoid unnecessary network requests and potential race conditions.
	
	Problem:
		I'm increasing the delay in my fake API client to five seconds. This lets me notice a problem.
		We don't check if the tab is already loading before starting a request, and then a bunch of RECEIVE_TODOS action comes back, potentially resulting in a race condition.
		Tại sao a bunch of RECEIVE_TODOS action come back lai co kha nang gay ra race condition?
		race condition la gi?
	Solution:
		Inject getState from store, pass store.getState to thunk in thunk middleware. Now thunk(dispatch, getState)
		Check isFetching in thunk, to avoid requestTodos too multiple times.
			export const fetchTodos = (filter) => (dispatch, getState) => {
				if (getIsFetching(getState(), filter)) {
					return;
			  }
			  ... //dispatch in period times
		  }
	Sumary:
		This is a good way to avoid unnecessary network operations and potential race conditions.
	
	Note:
		Look the return of the thunk. 
			It returns a promise. It doesn't have to, but it's convenient for the calling code.
		The thunk middleware itself does not use this promise.
			but it becomes the return value of dispatching this action creator, 
			so I can use it inside the component to schedule some code after the asynchronous action has completed.
	
	redux-thunk:
		npm install --save redux-thunk
		Use redux-thunk to dispatch actions asynchronously and conditionally.

24.  Displaying Error Messages
	We will learn how to handle an error inside an async action, display its message in the user interface, and offer user an opportunity to retry the action.
	The second argument to promise.then method, the rejection handler.
		=> dispatch error in it.
	Another way using:
		PromiseFunc
			.then(response => {
				...
			})
			.catch(error => {
				...
			})
		The downside of this approach is if one of your reducers or subscribe components throws while handling this action you'll get into the catch block and so you'll display an internal error message to the user.
		To avoid this error, I recommend that you don't use catch in this scenario and just pass the second argument so it catches only the errors from the underlying API promise. The error object usually comes with a message that we can wrap or display directly to the user with a fallback.
	Handle it in reducer.
	Display:
		
25. Creating Data on the Server
	We will learn how to wait until the item is created on the server, and update the corresponding local state.
	1, addTodo in fakeDatabase
	2, action creator addTodo -> thunk to get data async.
	3, update reducers.
		Using ... object spread operator and [] to create new in byId reducer.

26. Normalizing API Responses with normalizr
	We will learn how to use normalizr to convert all API responses to a normalized format so that we can simplify the reducers.
	Problem:
		FETCH_TODOS_SUCCESS response array of todo elements.
 		ADD_TODO_SUCCESS response a todo element
		=> response shape different => handle different way.
			Instead of adding new cases for every new API call, 
	=> I want to normalize the responses so the response shape is always the same.
	solution:
		1, install
			npm install -save normalizr
			A utility library that helps me normalize API responses to have the same shape.
		2, code
			create schema.js
			import Schema constructor, and arrayOf function.
			export const todo = new Schema('todos'); 
				todo object with normalized format.
				"todos" is the name of the dictionary in the normalized response
			export const arrayOfTodos = arrayOf(todo);
				the responses that contain arrays of todo objects.
		3, result:
			It contains two fields called entities and result. 
				Entities contains a normalized dictionary called todos that contains every todo in the response by its id. Normalizr found these todo objects in the response by following the array of todos schema. Conveniently, they are indexed by ids, so they will be easy to merge into the lookup table.
				The second field is the result. It's an array of todo ids. They are in the same order as the todos in the original response array. However, Normalizr replaced each todo with its id, and moved every todo into the todos dictionary.
			Normalizr can do this for any API response shape.

			Tom lai neu khai bao nhu tren (muc 2, code) thi ket qua tra ve se la 1 dictionary (entities), va 1 array of ids de lookup (result)
		4, sua reducer:
			using ... to merge.
		NOTE:
			The name of the dictionary inside entities corresponds to the string argument that I passed to the schema constructor when I created the todo schema.
			Version trong video la 2.1.0, rat khac so voi current version. => phai tim cach su dung version hien tai de co response shape hop ly.

27. Updating Data on the Server
We will learn how to wait until the item is updated on the server, and then update the corresponding local state.
Bai hoc rut ra. 
	=> Gui Update len server, 
	va chi update local o cho user hien thi, khong update local o cho ko hien thi, 
	neu chuyen sang cho khong hien thi => fetch lai tu server.

QUESTION:
Tim hieu thu tu dat middleware trong redux app.
single source of truth la gi?
=> doc bai Form trong react quickstart.
=> xem tren wiki.
In information systems design and theory, single source of truth (SSOT), is the practice of structuring information models and associated schemata such that every data element is stored exactly once (e.g., in no more than a single row of a single table). 

NOTE.
Ham createList rat ky dieu. Thuc ra moi action deu chay qua ham nay, nen check filter cho can than.



normalizr
Introduction: https://github.com/paularmstrong/normalizr/blob/master/docs/introduction.md 
Quickstart: https://github.com/paularmstrong/normalizr/blob/master/docs/quickstart.md
API: https://github.com/paularmstrong/normalizr/blob/master/docs/api.md#normalizedata-schema













