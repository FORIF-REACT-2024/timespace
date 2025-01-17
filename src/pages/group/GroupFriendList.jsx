import { useState, useEffect } from "react";
import ShadowBox from "../../components/ShadowBox";
import ModifyGroupList from "./ModifyGroupList"; // ModifyGroupList 컴포넌트 임포트

const FriendsList = ({ groupId, members, onSelect }) => {
  const [selectedFriends, setSelectedFriends] = useState(members); // 초기값 설정
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태 관리

  useEffect(() => {
    // members 변경 시 전체 선택 상태 초기화
    setSelectedFriends(members);

    // 초기 렌더링 시에만 onSelect 호출
    if (onSelect) {
      onSelect(members);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  const handleCheckboxChange = (name) => {
    const updatedFriends = selectedFriends.includes(name)
      ? selectedFriends.filter((friend) => friend !== name) // 체크 해제
      : [...selectedFriends, name]; // 체크 추가

    setSelectedFriends(updatedFriends);
    onSelect(updatedFriends); // 상위 컴포넌트로 전달
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex items-center justify-center m-3">
          <ShadowBox>
            <button onClick={openPopup}>그룹에 친구추가</button>
          </ShadowBox>
        </div>
        <div
          className="flex-1 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          {members.map((name, index) => (
            <div key={name} className="relative flex items-center py-4 text-2xl text-black">
              <input
                type="checkbox"
                className="w-6 h-6 mr-2"
                checked={selectedFriends.includes(name)}
                onChange={() => handleCheckboxChange(name)}
              />
              <div>{name}</div>
              {index !== members.length - 1 && (
                <div className="absolute bottom-0 left-0 right-0 border-b-[3px] border-[#254D64]" />
              )}
            </div>
          ))}
          {members.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* ModifyGroupList 팝업 */}
      {isPopupOpen && (
        <ModifyGroupList
          groupId={groupId} // 그룹 ID 전달
          currentMembers={selectedFriends} // 현재 선택된 멤버 전달
          onUpdate={(updatedMembers) => {
            setSelectedFriends(updatedMembers); // 선택된 멤버 업데이트
            onSelect(updatedMembers); // 상위 컴포넌트로 전달
          }}
          onClose={closePopup} // 팝업 닫기 함수
        />
      )}
    </div>
  );
};

export default FriendsList;
