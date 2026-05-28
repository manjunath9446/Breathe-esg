import axios from "axios";

const api = axios.create({
  baseURL:
    "https://breathe-esg-y4dg.onrender.com/api",
});

export default api;