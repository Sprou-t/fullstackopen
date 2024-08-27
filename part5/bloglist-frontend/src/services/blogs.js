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
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async(id, newObject) =>{
  const response = await axios.put(`${baseUrl}/${id}`, newObject);
	return response.data
}

export default { getAll, create, setToken,update }