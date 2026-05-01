import API from "../api/api";

const AUTH_URL = "/auth";

export const register = async (data) => {
  const res = await API.post(`${AUTH_URL}/register`, data);
  return res.data;
};

export const login = async (data) => {
  const res = await API.post(`${AUTH_URL}/login`, data);
  return res.data;
 };