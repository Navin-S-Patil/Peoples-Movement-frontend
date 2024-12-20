import axios from "axios";
// import useStore from "../store/useStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// apiClient.interceptors.request.use((config) => {
//   const token = useStore.getState().token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => Promise.reject(error));

export default apiClient;
