// this file uses axios to send api request to our backend
import axios from "axios";
// localhost:3001 is the server that our backend runs in, so we r retrieving
// info from our backend
const baseUrl = `/api/notes`;

let token = null

// this function can change var token
// used in App.jsx 
const setToken = newToken => { 
	token = `Bearer ${newToken}`
}

const getAll = () => {
	const request = axios.get(baseUrl);
	const nonExisting = {
		id: 10000,
		content: "This note is not saved to server",
		important: true,
	};
	return request.then((response) => response.data.concat(nonExisting));
};

// newObj is the new note arg to be sent to server found in App.jsx
const create = async (newObject) => {
	const config = { // config is an obj
		// sets token to Authorization header
		// authorization is the key, token is the private var on top
		headers: { Authorization: token },
	}
  // baseurl is the endpt, newObj is the data sent to server in req body
  // config is opt para that contains req headers
	const response = await axios.post(baseUrl, newObject, config)
	return response.data // return the data sent from back server ie. newly created note
  }

const update = async (id, newObject) => {
	const response = await axios.put(`${baseUrl}/${id}`, newObject);
	return response.data
}

export default {
	getAll: getAll,
	create: create,
	update: update,
	setToken: setToken
};

// since both key and value names are the same, we can instead rewrite the
// expression, using a ES6 feature, into this:
// export default { getAll, create, update }
