import axios from 'axios';

const BASE_URL = 'https://51no8tj6ff.execute-api.us-east-1.amazonaws.com/prod';

console.log('API URL:', BASE_URL);

// POST - Save income
export const saveIncome = async (userId, income, month) => {
  const response = await axios.post(`${BASE_URL}/income`, {
    userId,
    income: parseFloat(income),
    month
  });
  return response.data;
};

// GET - Fetch specific month
export const getIncome = async (userId, month) => {
  const response = await axios.get(`${BASE_URL}/income`, {
    params: { userId, month }
  });
  return response.data;
};

// GET - Fetch all months
export const getAllIncome = async (userId) => {
  const response = await axios.get(`${BASE_URL}/income`, {
    params: { userId }
  });
  return response.data;
};

// ✅ DELETE - Delete a specific month
export const deleteIncome = async (userId, month) => {
  const response = await axios.delete(`${BASE_URL}/income`, {
    data: { userId, month }
  });
  return response.data;
};

// ✅ GET - Fetch all users
export const getUsers = async () => {
  const response = await axios.get(`${BASE_URL}/users`);
  return response.data;
};
