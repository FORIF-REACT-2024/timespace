import React from "react";

const GroupFriendList = ({ members, selectedFriends, setSelectedFriends, onAddFriends }) => {
  // 체크박스 상태 변경 핸들러
  const handleCheckboxChange = (name) => {
    setSelectedFriends((prevSelectedFriends) =>
      prevSelectedFriends.includes(name)
        ? prevSelectedFriends.filter((friend) => friend !== name) // 체크 해제
        : [...prevSelectedFriends, name] // 체크 추가
    );
  };

  return (
    <div>
      <div className="flex flex-col">
        {/* 버튼 영역 */}
        <div className="flex items-center justify-center m-3">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            onClick={onAddFriends}
          >
            그룹에 친구 추가
          </button>
        </div>

        {/* 친구 목록 */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
          {members.map((name, index) => (
            <div key={name} className="relative flex items-center justify-center py-4 text-2xl text-black">
              {/* 체크박스 */}
              <input
                type="checkbox"
                className="w-6 h-6 mr-2"
                checked={selectedFriends.includes(name)}
                onChange={() => handleCheckboxChange(name)}
              />
              <div className="flex items-center justify-center">{name}</div>
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
    </div>
  );
};

export default GroupFriendList;
