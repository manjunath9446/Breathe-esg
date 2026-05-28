import axios from "axios";

const api = axios.create({
  baseURL:
    "https://breathe-esg-1-v1zk.onrender.com",
});

export default api;