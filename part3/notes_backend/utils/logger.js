// separate all printing of the entire proj into a single module

// When the function info is called, any arguments passed to it are collected
// into the params array.
// For example, if you call info('Hello', 42, true), the params array
// will be['Hello', 42, true].
const info = (...params) => {
	if (process.env.NODE_ENV !== "test") {
		console.log(...params);
	}
};

const error = (...params) => {
	if (process.env.NODE_ENV !== "test") {
		console.error(...params);
	}
};

export { info, error };
