import API from "../api/api";

export const register = async (data) => {
  return await API.post("/auth/register", data);
};

export const login = async (data) => {
  const res = await API.post("/auth/login", data);

  localStorage.setItem("token", res.data.access_token);

  return res;
};

export const getProfile = async () => {
  return await API.get("/users/me");
};