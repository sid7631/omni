// src/config/config.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const API_URLS = {
    createAccount: `${API_BASE_URL}/api/v3/accounts`
};
