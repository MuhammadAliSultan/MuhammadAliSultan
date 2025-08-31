import api from "./config";

export const messageService = {
  getMessages: async (receiverId) => {
    const res = await api.get(`/personal-messages?receiverId=${receiverId}`);
    // Return array of messages
    return res.data.data || [];
  },

  sendMessage: async (receiverId, content, attachments = []) => {
    const res = await api.post(`/personal-messages?receiverId=${receiverId}`, {
      content,
      attachments,
    });
    // Return the saved message object
    return res.data.data;
  },

  deleteMessage: async (messageId) => {
    const res = await api.delete(`/personal-messages/${messageId}`);
    return res.data.data;
  },
};
