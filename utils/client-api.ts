import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Remove the interceptor that retrieves the token from localStorage
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token'); // Retrieve token from localStorage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export const signup = async (email: string, password: string, type: string) => {
  try {
    const response = await apiClient.post('/auth/signup', {
      email,
      password,
      type,
    });
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    document.cookie = `token=${response.data.token}; path=/`; // Store token in cookies
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export default apiClient;


