Simplifying the Arrow Functions
How to reduce the syntactic noise in the action creators and components when using arrow functions.
	- If the arrow function only contains a single return statement, you can replace the body of the arrow function with just a value. 
		If this value is an object, don't forget to wrap it in parenthesis so that the parser understands that this is an expression and not a block.
	- Also, it can be nicer to use the concise method notation inside mapDispatchToProps, instead of arrow functions because it's harder.

