const reverse = (string) => {
	return string.split("").reverse().join("");
};

const average = (array) => {
	const reducer = (sum, item) => {
		return sum + item;
	};
	// 0 is the second parameter that provides the value of sum
	 return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

module.exports = {
	reverse,
	average,
};
