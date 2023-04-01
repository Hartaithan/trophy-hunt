import axios, { type CreateAxiosDefaults } from "axios";

const config: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

const API = axios.create(config);

export default API;
