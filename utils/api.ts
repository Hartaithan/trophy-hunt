import axios, { type CreateAxiosDefaults } from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const config: CreateAxiosDefaults = {
  baseURL: API_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

const API = axios.create(config);

export default API;
