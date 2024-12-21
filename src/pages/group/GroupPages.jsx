import { useEffect, useState } from "react";
import { useGroups } from "../../hooks/useGroups";
import { useParams } from "react-router-dom";
import { groupApi } from "../../api/groupApi"; // groupApi import 추가

import GroupTimetable from "./components/GroupTimeTable";
import GroupMemberList from "./components/GroupMemberList";
import GroupTab from "../profile/components/GroupTab";

export default function GroupPages() {
  const { name } = useParams();
  const { groups, activeGroup, selectGroup } = useGroups();
  const [currentGroup, setCurrentGroup] = useState(null);

  const refreshGroupData = async () => {
    if (!activeGroup) return;
    try {
      const groupDetails = await groupApi.getGroupMembers(activeGroup);
      setCurrentGroup(groupDetails);
    } catch (error) {
      console.error("그룹 정보 새로고침 실패:", error);
    }
  };

  useEffect(() => {
    const fetchGroupDetails = async (groupId) => {
      try {
        const groupDetails = await groupApi.getGroupMembers(groupId);
        setCurrentGroup(groupDetails);
      } catch (error) {
        console.error("그룹 상세 정보 조회 실패:", error);
      }
    };

    if (groups.length > 0 && name) {
      const foundGroup = groups.find((g) => g.name === name);
      if (foundGroup) {
        selectGroup(foundGroup.id);
        fetchGroupDetails(foundGroup.id); // 그룹 상세 정보 조회
      }
    } else if (groups.length > 0 && activeGroup) {
      const group = groups.find((g) => g.id === activeGroup);
      if (group) {
        fetchGroupDetails(group.id); // 그룹 상세 정보 조회
      }
    }
  }, [groups, activeGroup, name]);

  console.log("Current Group:", currentGroup); // 디버깅용

  return (
    <div className="max-w-[1920px] mx-auto p-5">
      <div className="flex gap-4">
        <div className="w-[1390px] h-[780px]">
          <GroupTimetable groupData={currentGroup} />
        </div>
        <div className="w-[471px] h-[780px]">
          <GroupMemberList
            group={currentGroup}
            onMembersUpdate={refreshGroupData}
          />
        </div>
      </div>
      <div className="mt-4">
        <GroupTab />
      </div>
    </div>
  );
}
