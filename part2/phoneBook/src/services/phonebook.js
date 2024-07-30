import axios from "axios";
const baseUrl = "http://localhost:3001/persons";


// all these get,post,put,delete method r to interact w db
// when used in app w set, that is to only just update the frontend
const getAll = () => {
	const request = axios.get(baseUrl);
	// first then extracts the data from the response part of request
	return request.then((response) => response.data);
};

const create = (newObject) => {
	const request = axios.post(baseUrl, newObject);
	return request.then((response) => response.data);
};

// to find an item, do so using its id
const update = (id, newObject) => {
	const request = axios.put(`${baseUrl}/${id}`, newObject);
	return request.then((response) => response.data);
};

const remove = (id) => {
	const request = axios.delete(`${baseUrl}/${id}`);
	return request.then((response) => response.data);
};

export default { getAll, create, update, remove };
