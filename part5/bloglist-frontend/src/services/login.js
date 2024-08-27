import axios from 'axios'
const baseUrl = '/api/login'

// note that this services of sending api request will be used in App.js
const login = async credentials => {
    // note that the 1st arg is the url
  const response = await axios.post(baseUrl, credentials)
  // data is 1 of the properties of response. the others r header etc
  return response.data 
  // retrieve the data sent back by server which includes the token generated, username & name
}

export default { login } // export an obj w login as 1 of the key & value