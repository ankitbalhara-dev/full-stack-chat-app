// ✅ Correct: Default export
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE==="develoment"? "http://localhost:5001/api":"/api",
  withCredentials: true,
});

export default axiosInstance;