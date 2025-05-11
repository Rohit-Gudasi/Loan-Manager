import axios from 'axios';

// Set the base URL of the backend API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // Update this if needed
});

export default api;
