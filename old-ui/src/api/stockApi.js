// src/api/stockAPI.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchStockData = async (symbol) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    throw error;
  }
};
