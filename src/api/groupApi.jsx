// src/api/groupApi.jsx
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const groupApi = {
  // 기존 API들
  getGroups: async () => {
    const response = await axios.get(`${BASE_URL}/group`, {
      withCredentials: true,
    });
    return response.data;
  },

  createGroup: async (name, userId) => {
    const response = await axios.post(
      `${BASE_URL}/group/new`,
      {
        name,
        user_ids: userId,
      },
      { withCredentials: true }
    );
    return response.data;
  },

  // 수정된 API들
  addGroupMembers: async (groupId, userIds) => {
    const response = await axios.post(
      `${BASE_URL}/group/${groupId}/addfriend`, // 실제 엔드포인트로 수정
      { user_ids: userIds },
      { withCredentials: true }
    );
    return response.data;
  },

  removeGroupMembers: async (groupId, userIds) => {
    const response = await axios.post(
      `${BASE_URL}/group/${groupId}/removefriend`, // 실제 엔드포인트로 수정
      { user_ids: userIds },
      { withCredentials: true }
    );
    return response.data;
  },

  getGroupMembers: async (groupId) => {
    const response = await axios.get(`${BASE_URL}/group/${groupId}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
