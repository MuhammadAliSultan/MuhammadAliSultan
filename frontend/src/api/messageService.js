import api from "./config";
export const messageService = {
  getMessages: async (receiverId) => {
    const res = await api.get(`/personal-messages/${receiverId}`);
    return res.data.data || [];
  },

  getLastMessage: async (receiverId) => {
    const res = await api.get(`/personal-messages/${receiverId}/last`);
    return res.data.data || null;
  },

  sendMessage: async (receiverId, content, attachments = []) => {
    const res = await api.post(`/personal-messages/${receiverId}`, {
      content,
      attachments,
    });
    return res.data.data;
  },

  deleteMessage: async (messageId) => {
    const res = await api.delete(`/personal-messages/message/${messageId}`);
    return res.data.data;
  },

  deleteConversation: async (receiverId) => {
    const res = await api.delete(`/personal-messages/conversation/${receiverId}`);
    return res.data.data;
  },
};
