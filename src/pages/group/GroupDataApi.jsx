import axios from 'axios';

const GroupDataApi = async () => {
  try {
    // 1. 로그인한 사용자 ID 가져오기
    console.log("Fetching user data...");
    const userRes = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/user`, {
      withCredentials: true,
    });
    const userId = userRes.data.id;
    console.log("User ID fetched:", userId);

    // 2. 해당 사용자 ID에 해당하는 그룹 데이터 가져오기
    console.log("Fetching group data for user ID:", userId);
    const groupRes = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/group/${userId}`,
      { withCredentials: true }
    );
    const groups = groupRes.data; // 그룹 정보 (그룹 이름과 멤버 리스트)
    console.log("Groups fetched:", groups);

    // 3. 스터디 그룹 멤버들의 시간표 데이터 가져오기
    console.log("Extracting member IDs from groups...");
    const memberIds = Object.values(groups).flatMap((group) => group.members); // 모든 멤버 ID 가져오기
    console.log("Member IDs:", memberIds);

    console.log("Fetching timetable data for member IDs...");
    const timetableRes = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/timetable`,
      { ids: memberIds },
      { withCredentials: true }
    );
    const timetableData = timetableRes.data; // 시간표 데이터
    console.log("Timetable data fetched:", timetableData);

    // 4. 최종 JSON 데이터 생성
    const result = {
      timeTable: timetableData,
      groups: groups,
    };
    console.log("Final result:", result);

    return result; // JSON 데이터 반환
  } 
  catch (error) {
    console.error('Error fetching group or timetable data:', error);
    throw error;
  }
};

export default GroupDataApi;
