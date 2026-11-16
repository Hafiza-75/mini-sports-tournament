const API_URL = "http://localhost:5000/api/tournaments";

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken");

const request = async (url, options = {}) => {
  const token = getToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

export const getTournaments = () =>
  request(API_URL);

export const createTournament = (data) =>
  request(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTournament = (id, data) =>
  request(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteTournament = (id) =>
  request(`${API_URL}/${id}`, {
    method: "DELETE",
  });