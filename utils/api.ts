import { API_URL } from "@/constants/api";
import axios, { type CreateAxiosDefaults } from "axios";

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
