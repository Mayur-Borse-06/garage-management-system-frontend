import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // Timeout limit (10 seconds)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Optional: Add request interceptors (e.g., automatically attach a bearer token)
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('user_token'); // Or wherever your token is stored
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Optional: Add response interceptors (e.g., catch global errors like 401 Unauthorized)
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Handle logout or refresh token logic here
//       console.error('Unauthorized! Redirecting to login...');
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;
