import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TimeTable from "../table/GroupTable";
import ConvertToTestData from "./ConvertData";
import processData from "./processData";
import GroupFriendList from "./GroupFriendList";
import GroupTab from "../../components/GroupTab";
import ShadowBox from "../../components/ShadowBox";

const GroupPage = () => {
  const { name } = useParams(); // 선택된 그룹 이름
  const [groupData, setGroupData] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]); // 선택된 멤버 상태
  const [timeTableData, setTimeTableData] = useState(null); // 시간표 데이터 상태
  const [selectedGroup, setSelectedGroup] = useState(null); // 선택된 그룹 데이터

  function handleselectedFriends(friends) {
    setSelectedFriends(friends);
  }

  useEffect(() => {
    const fetchTimeTableData = async () => {
      const data = await ConvertToTestData();
      setTimeTableData(data);
    };

    fetchTimeTableData();
  }, []);

  useEffect(() => {
    if (timeTableData && timeTableData.groups) {
      const group = timeTableData.groups[name];
      if (group) {
        setGroupData(group);
        setSelectedFriends(group.members || []);
      }
    }
  }, [name, timeTableData]);

  const handleGroupSelection = (groupName) => {
    const group = timeTableData?.groups[groupName];
    if (group) {
      setSelectedGroup(group); // 선택된 그룹 데이터를 저장
      setSelectedFriends(group.members || []); // 선택된 그룹 멤버로 초기화
    }
  };

  const filteredTimeTableData = {};
  if (groupData && selectedFriends.length > 0 && timeTableData) {
    selectedFriends.forEach((member) => {
      filteredTimeTableData[member] = timeTableData.timeTable[member];
    });
  }

  const result = selectedFriends.length > 0 ? processData(filteredTimeTableData) : {};

  const groupNames = timeTableData?.groups
    ? Object.keys(timeTableData.groups).map((key) => ({
        id: key,
        name: key,
      }))
    : [];

  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <div className="flex flex-1 flex-col">
        <div className="flex-1 flex">
          <div className="w-[70%] border-4 border-white bg-white m-2">
            <ShadowBox>
              <TimeTable timeTableData={result} groupName={name} />
            </ShadowBox>
          </div>
          <div className="w-[30%] border-4 border-white bg-white m-2">
            <ShadowBox>
              <GroupFriendList
                groupId={selectedGroup?.id} // 선택된 그룹 ID 전달
                members={selectedGroup?.members || []} // 선택된 그룹 멤버 전달
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
            onSelectGroup={handleGroupSelection} // 그룹 선택 시 콜백 호출
          />
        </ShadowBox>
      </div>
      <footer className="w-full" style={{ height: "90%" }} />
    </div>
  );
};

export default GroupPage;
