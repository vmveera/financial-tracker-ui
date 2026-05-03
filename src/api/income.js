import axios from 'axios';

const BASE_URL = 'https://51no8tj6ff.execute-api.us-east-1.amazonaws.com/prod';

console.log('API URL:', BASE_URL);

export const saveIncome = async (userId, income, month) => {
  const response = await axios.post(`${BASE_URL}/income`, {
    userId,
    income: parseFloat(income),
    month
  });
  return response.data;
};

export const getIncome = async (userId, month) => {
  const response = await axios.get(`${BASE_URL}/income`, {
    params: { userId, month }
  });
  return response.data;
};

export const getAllIncome = async (userId) => {
  const response = await axios.get(`${BASE_URL}/income`, {
    params: { userId }
  });
  return response.data;
};
