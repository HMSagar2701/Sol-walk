import axios from "axios";

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
};

export const API = axios.create(options);

