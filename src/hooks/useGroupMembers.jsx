import { useState, useCallback } from "react";
import { groupApi } from "../api/groupApi";

export const useGroupMembers = (groupId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addMembers = useCallback(
    async (userIds) => {
      try {
        setLoading(true);
        setError(null);
        await groupApi.addGroupMembers(groupId, userIds);
        return true;
      } catch (err) {
        setError(err.response?.data || "멤버 추가에 실패했습니다.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [groupId]
  );

  const removeMembers = useCallback(
    async (userIds) => {
      try {
        setLoading(true);
        setError(null);
        await groupApi.removeGroupMembers(groupId, userIds);
        return true;
      } catch (err) {
        setError(err.response?.data || "멤버 제거에 실패했습니다.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [groupId]
  );

  return {
    loading,
    error,
    addMembers,
    removeMembers,
  };
};
