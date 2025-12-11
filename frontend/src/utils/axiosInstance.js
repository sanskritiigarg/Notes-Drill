import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // known errors
      return Promise.reject(error.response);
    } else if (error.request) {
      // backend didn't reply
      return Promise.reject({ message: 'Network error occurred' });
    } else {
      // other errors
      return Promise.reject({ message: 'An error occurred' });
    }
  }
);

export { axiosInstance };
