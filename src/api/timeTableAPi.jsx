// src/api/timetableApi.js
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const fetchTimetable = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/timetable`, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data?.data;
    }
  } catch (e) {
    toast.error(e.message);
    return null;
  }
};

export const fetchUserTimetable = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/timetable/${userId}`, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data?.data;
    }
  } catch (e) {
    console.error(`Failed to fetch timetable for user ${userId}:`, e);
    return null;
  }
};
