import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TimeTable from "../table/GroupTable";
import processData from "./processData"; // processData 함수 import
import GroupFriendList from "./GroupFriendList";
import GroupTab from "../../components/GroupTab";
import Navigation from "../../components/Navigation"; // Navigation 컴포넌트 불러오기
import ShadowBox from "../../components/ShadowBox";

// import timeTableData from "../../testdataset/testdata.json"; // JSON 파일 import
import timeTableData from '../group/GroupDataApi'; // GroupDataApi import

const GroupPage = () => {
  const { name } = useParams(); // 선택된 그룹 이름
  const [groupData, setGroupData] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]); // 체크된 멤버 상태 관리

  /*
  useEffect(() => {
    // 선택된 그룹 데이터 가져오기
    const group = timeTableData.GroupDataApi.groups[name];
    if (group) {
      setGroupData(group);
      setSelectedFriends(group.members); // 초기 상태: 모든 멤버 체크
    }
  }, [name]);*/

  useEffect(() => {
    const fetchData = async () => {
      const result = await timeTableData.GroupDataApi(); // GroupDataApi 호출
      setData(result); // 가져온 데이터를 상태에 저장
    };

    fetchData();
  }, []);

  // 멤버들의 시간표만 필터링하여 전달
  const filteredTimeTableData = {};
  if (groupData) {
    selectedFriends.forEach((member) => {
      filteredTimeTableData[member] = timeTableData.timeTable[member];
    });
  }

  // processData로 필터링된 데이터 처리
  const result = processData(filteredTimeTableData);

  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      {/* 상단 네비게이션 바 */}
      <div className="m-3">
        <ShadowBox>
          <Navigation />
        </ShadowBox>
      </div>

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
                members={groupData ? groupData.members : []}
                selectedFriends={selectedFriends} // 체크된 멤버 전달
                setSelectedFriends={setSelectedFriends} // 체크 상태 업데이트 함수 전달
              />
            </ShadowBox>
          </div>
        </div>
      </div>

      <div className="m-3">
        <ShadowBox>
          <GroupTab />
        </ShadowBox>
      </div>

      <footer className="w-full" style={{ height: "90%" }}></footer>
    </div>
  );
};

export default GroupPage;
