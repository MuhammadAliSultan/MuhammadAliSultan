import api from './config.js';

export const userService = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/current-user');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },
getAllUsers: async () => {
  const response = await api.get('/users/all-users');
  return response.data.data; 
}


};
