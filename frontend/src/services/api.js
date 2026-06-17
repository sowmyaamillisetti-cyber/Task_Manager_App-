import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-app-2-hkxz.onrender.com",
});

export default API;