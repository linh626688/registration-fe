import axios from 'axios';

// const API_ROOT = 'localhost:8080/api'
const API_ROOT = 'https://sleepy-shelf-66824.herokuapp.com/api'

const UserServices = {
  doRegister(payload) {
    return axios.post(`${API_ROOT}/register`, payload)
  }
};

export default UserServices;
