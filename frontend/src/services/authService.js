
const API_URL = "http://localhost:5000/api/auth";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const registerUser = (userData) => {
  return request("/register", {
    method: "POST",
    body: JSON.stringify(userData)
  });
};

export const loginUser = (credentials) => {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
};

export const getProfile = (token) => {
  return request("/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
