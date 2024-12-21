import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TimeTable from "../table/GroupTable";
import ConvertToTestData from "./ConvertData"; // ConvertData에서 데이터 불러오기
import processData from "./processData"; // processData 함수 import
import GroupFriendList from "./GroupFriendList";
import GroupTab from "../../components/GroupTab";
import Navigation from "../../components/Navigation"; // Navigation 컴포넌트 불러오기
import ShadowBox from "../../components/ShadowBox";

const GroupPage = () => {
  const { name } = useParams(); // 선택된 그룹 이름
  const [groupData, setGroupData] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]); // 선택된 멤버 상태
  const [timeTableData, setTimeTableData] = useState(null); // 시간표 데이터 상태

  function handleselectedFriends(friends) {
    setSelectedFriends(friends);
  }

  useEffect(() => {
    // ConvertData로 시간표 데이터 가져오기
    const fetchTimeTableData = async () => {
      const data = await ConvertToTestData();
      setTimeTableData(data);
    };

    fetchTimeTableData();
  }, []);

  useEffect(() => {
    // 선택된 그룹 데이터 가져오기
    if (timeTableData && timeTableData.groups) {
      const group = timeTableData.groups[name];
      if (group) {
        setGroupData(group);
      }
    }
  }, [name, timeTableData]);

  // 멤버들의 시간표만 필터링하여 전달
  const filteredTimeTableData = {};
  if (groupData && selectedFriends.length > 0 && timeTableData) {
    selectedFriends.forEach((member) => {
      filteredTimeTableData[member] = timeTableData.timeTable[member];
    });
  }

  // processData로 필터링된 데이터 처리
  const result = selectedFriends.length > 0 ? processData(filteredTimeTableData) : {}; // 선택된 멤버가 없으면 빈 데이터 반환

  // 그룹 이름 목록 생성
  const groupNames = timeTableData?.groups
    ? Object.keys(timeTableData.groups).map((key) => ({
        id: key,
        name: key,
      }))
    : [];

  return (
    <div className="flex flex-col">
      {/* 상단 네비게이션 바 */}
      {/* <div className="m-3">
        <ShadowBox>
          <Navigation />
        </ShadowBox>
      </div> */}

      {/* 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col">
        {/* 첫 번째 콘텐츠 영역: 왼쪽 (TimeTable) */}
        <div className="flex-1 flex">
          <div className="w-[70%] border-4 border-white bg-white m-2">
            <ShadowBox>
              {/* 필터링된 멤버들의 시간표 데이터만 전달 */}
              <TimeTable timeTableData={result} groupName={name} />
            </ShadowBox>
          </div>
          {/* 오른쪽: FriendTable */}
          <div className="w-[30%] border-4 border-white bg-white m-2">
            <ShadowBox>
              <GroupFriendList 
                groupId={groupData?.id} // 그룹 ID 전달
                members={groupData ? groupData.members : []} 
                onSelect={handleselectedFriends} // 선택된 멤버 업데이트
              />
            </ShadowBox>
          </div>
        </div>
      </div>

      <div className="m-3 pb-10">
        <ShadowBox>
          <GroupTab
            groups={groupNames} // 그룹 이름 목록 전달
            onSelectGroup={(group) => console.log("Selected group:", group)} // 그룹 선택 콜백
          />
        </ShadowBox>
      </div>

      <footer className="w-full" style={{ height: "90%" }} />
    </div>
  );
};

export default GroupPage;
