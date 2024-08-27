// this file creates the logger functions these functions will be exported and used in
// request logger middleware in middleware.js 
const info = (...params) => {
	console.log(...params);
};

const error = (...params) => {
	console.error(...params);
};

module.exports = {
	info,
	error,
};
