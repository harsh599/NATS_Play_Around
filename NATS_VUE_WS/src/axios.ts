import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000", // Replace with your API base URL
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default apiClient;
