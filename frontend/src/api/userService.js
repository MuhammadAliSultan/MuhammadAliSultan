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
  },

  updateUserInfo: async (userData) => {
    const response = await api.patch('/users/update-user-info', userData);
    return response.data;
  },

  changeCurrentPassword: async (passwordData) => {
    const response = await api.post('/users/change-current-password', passwordData);
    return response.data;
  },

  updateProfilePic: async (formData) => {
    const response = await api.patch('/users/update-profile-pic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getProfilePic: async () => {
    const response = await api.get('/users/get-profile-pic');
    return response.data;
  },

  blockUser: async (userId) => {
    const response = await api.post(`/users/block/${userId}`);
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await api.post(`/users/unblock/${userId}`);
    return response.data;
  },

  getBlockedUsers: async () => {
    const response = await api.get('/users/blocked-users');
    return response.data.data;
  },

  checkIfBlocked: async (userId) => {
    const response = await api.get(`/users/check-blocked/${userId}`);
    return response.data.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  }

};
