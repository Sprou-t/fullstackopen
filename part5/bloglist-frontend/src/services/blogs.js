import axios from 'axios'
const baseUrl = '/api/blog'

let token = null

const setToken = newToken => { 
  // this function will be used in App.jsx to set the token state in handleLogin function
  token = `Bearer ${newToken}`
}

const getAll = async() => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async (newObject) => {
  // config obj used to set headers for HTTP req made w axios
  // the obj can include various settings, such as headers, auth credentials etc
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data // return the data sent from back server ie. newly created note
}

const update = async(id, newObject) =>{
  const response = await axios.put(`${baseUrl}/${id}`, newObject);
	return response.data
}

const remove = async(id) =>{
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data; 
  // return response data from backend. ie. backend sends back status code 204
  // useful for testing
}

export default { getAll, create, setToken,update,remove }