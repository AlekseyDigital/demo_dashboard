import axios from 'axios';
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default {
  setHeader(name, value) {
    api.defaults.headers.common[name] = value;
  },

  deleteHeader(name) {
    delete api.defaults.headers.common[name];
  },
  
  async get(path, options) {
    return await api.get(path, options);
  },

  async post(path, data, options) {
    return await api.post(path, data, options);
  },

  async put(path, data, options) {
    return await api.put(path, data, options);
  },

  async delete(path, options) {
    return await api.delete(path, options);
  },
};

export const getRequest = async (path, options) => {
  return await axios.get(path, options);
}

export const postRequest = async (path, data, options) => {
  return await axios.post(path, data, options);
}

export const putRequest = async (path, data, options) => {
  return await axios.put(path, data, options);
}

export const deleteRequest = async (path, options) => {
  return await axios.delete(path, options);
}
