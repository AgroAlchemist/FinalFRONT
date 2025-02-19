import axios from 'axios';

const API_URL = 'http://localhost:3000/users/'; // Adjust if needed

export const loginFarmer = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/farmer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');  
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error.message;
  } 
};

export const registerFarmer = async (userData) => {
  try {
    const response = await fetch('http://localhost:3000/farmer/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error.message;
  } 
};




export const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
 //   console.log('Login response:', data); // Add this to debug
    return data;
  } catch (error) {
    throw error.message;
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Signup failed';
  }
};
