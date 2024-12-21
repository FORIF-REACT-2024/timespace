import { useState } from "react";
import { useFriends } from "../../../hooks/useFriends";
import { groupApi } from "../../../api/groupApi";

const GroupMemberList = ({ group, onMembersUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState(new Set());
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const { friends } = useFriends();

  // 현재 그룹 멤버 필터링
  const filteredMembers =
    group?.members?.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // 모달에서 보여줄 친구 목록 필터링
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(modalSearchTerm.toLowerCase())
  );

  const handleSaveMembers = async () => {
    if (!group?.id || !group?.members) {
      console.error("그룹 정보가 없습니다.");
      return;
    }

    try {
      const currentMemberIds = new Set(
        group.members.map((m) => m.id.toString())
      );
      const selectedIds = Array.from(selectedFriends).map((id) =>
        id.toString()
      );

      // 추가할 멤버들
      const membersToAdd = selectedIds.filter(
        (id) => !currentMemberIds.has(id)
      );
      if (membersToAdd.length > 0) {
        await groupApi.addGroupMembers(group.id, membersToAdd.join(","));
      }

      // 제거할 멤버들
      const membersToRemove = Array.from(currentMemberIds).filter(
        (id) => !selectedIds.includes(id)
      );
      if (membersToRemove.length > 0) {
        await groupApi.removeGroupMembers(group.id, membersToRemove.join(","));
      }

      setModalOpen(false);
      onMembersUpdate();
    } catch (error) {
      console.error("멤버 수정 에러:", error);
    }
  };

  return (
    <div className="relative h-full">
      <div className="absolute top-[11px] left-0 right-0 h-[calc(100%-22px)] bg-[#254D64] rounded-[20px]" />
      <div className="relative h-[calc(100%-22px)] bg-white border-[3px] border-[#254D64] rounded-[20px] p-4">
        <div className="flex flex-col h-full">
          {/* 상단 영역 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">그룹 멤버</h2>
              <button
                onClick={() => {
                  setSelectedFriends(
                    new Set(group?.members?.map((m) => m.id) || [])
                  );
                  setModalOpen(true);
                }}
                className="px-4 py-2 border-[3px] border-[#254D64] rounded-[10px] text-base hover:bg-[#254D64] hover:text-white transition-colors"
              >
                멤버 관리
              </button>
            </div>
            <input
              type="text"
              placeholder="검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[67px] px-5 text-base border-[3px] border-[#254D64] rounded-[10px] text-black mb-4"
            />
          </div>

          {/* 멤버 목록 영역 */}
          <div className="flex-1 overflow-auto min-h-0">
            {filteredMembers.map((member, index) => (
              <div key={member.id} className="relative">
                <div className="py-4 px-5 text-base text-black text-left">
                  {member.name}
                </div>
                {index !== filteredMembers.length - 1 && (
                  <div className="absolute bottom-0 left-0 right-0 border-b-[3px] border-[#254D64]" />
                )}
              </div>
            ))}
            {filteredMembers.length === 0 && (
              <div className="text-center text-gray-500 mt-4">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 멤버 관리 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-6 w-[500px] max-h-[80vh] flex flex-col">
            <h3 className="text-xl font-bold mb-4">멤버 관리</h3>

            <input
              type="text"
              placeholder="친구 검색"
              value={modalSearchTerm}
              onChange={(e) => setModalSearchTerm(e.target.value)}
              className="w-full h-[40px] px-3 mb-4 border-2 border-[#254D64] rounded-[10px]"
            />

            <div className="flex-1 overflow-y-auto min-h-0 mb-4">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
                >
                  <input
                    type="checkbox"
                    id={`friend-${friend.id}`}
                    checked={selectedFriends.has(friend.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedFriends);
                      if (e.target.checked) {
                        newSelected.add(friend.id);
                      } else {
                        newSelected.delete(friend.id);
                      }
                      setSelectedFriends(newSelected);
                    }}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor={`friend-${friend.id}`}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {friend.name}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border-2 border-[#254D64] rounded-[10px] hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={handleSaveMembers}
                className="px-4 py-2 bg-[#254D64] text-white rounded-[10px] hover:bg-opacity-90"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupMemberList;
