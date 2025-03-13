import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const registerUser = (data: any) => API.post('/auth/register', data);
export const loginUser = (data: any) => API.post('/auth/login', data);
