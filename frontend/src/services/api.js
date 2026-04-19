import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Add JWT token to every request automatically
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// Auth APIs
export const registerUser = (data) =>
    axios.post(`${BASE_URL}/auth/register`, data, {
        headers: { Authorization: null } // ← don't send token for register
    });

export const loginUser = (data) =>
    axios.post(`${BASE_URL}/auth/login`, data, {
        headers: { Authorization: null } // ← don't send token for login
    });

// Chat APIs
export const sendMessage = (data) =>
    axios.post(`${BASE_URL}/healthcare/chat`, data);

export const getChatHistory = (userId) =>
    axios.get(`${BASE_URL}/healthcare/history/${userId}`);