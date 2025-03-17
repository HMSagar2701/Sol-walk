import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.fitbit.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthorizationToken = (token: string) => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default axiosInstance;