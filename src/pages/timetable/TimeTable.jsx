import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { TbTrash } from "react-icons/tb"; // 쓰레기통 아이콘

import DirectAddModal from "./TimeTableComponents/DirectAddModal"; // 직접 추가 모달
import ShadowBox from "../../components/ShadowBox"; // 테두리
import useTimetableEdit from "./TimeTableFunction/useTimetableEdit"; // 삭제 모드 by 쓰레기통 아이콘

const days = ["월", "화", "수", "목", "금", "토", "일"];
const timeLabels = [
  "09:00 ~ 10:00",
  "10:00 ~ 11:00",
  "11:00 ~ 12:00",
  "12:00 ~ 13:00",
  "13:00 ~ 14:00",
  "14:00 ~ 15:00",
  "15:00 ~ 16:00",
  "16:00 ~ 17:00",
  "17:00 ~ 18:00",
  "18:00 ~ 19:00",
];

const Timetable = () => {
  const timetableParent = useRef(null); // 시간표 부모 요소
  const [timetableParentWidth, setTimetableParentWidth] = useState(0); // 시간표 부모 요소 너비

  // 삭제 모드
  const { isEditMode, toggleEditMode, message } = useTimetableEdit();

  const [isDirectAddModalOpen, setDirectAddModalOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const openDirectAddModal = () => setDirectAddModalOpen(true);
  const closeDirectAddModal = () => setDirectAddModalOpen(false);

  const addSubject = (newSubject) => {
    setSubjects([...subjects, newSubject]);
  };

  // 쓰레기통 icon 클릭 -> 과목 삭제 filter로 거르기
  const deleteSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  // 서버에 시간표 데이터 GET 요청
  const fetchTimetable = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/timetable",
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        const timeData = res.data.data;

        console.log(timeData); // 불러온 거 확인

        if (timeData != undefined) setSubjects(timeData); // <--------------- 필요한 피일별로 수정
        // toast.success("GET timetable successful!");
      } else {
        // toast.error("GET failed!");
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  // 컴포넌트 렌더링 시 GET
  useEffect(() => {
    fetchTimetable();
  }, []); // 빈 배열로 설정 -> 한 번만 실행

  useEffect(() => {
    const handleResize = () => {
      console.log(
        "width",
        timetableParent.current ? timetableParent.current.offsetWidth : 0
      );
      console.log(timetableParent.current.getBoundingClientRect());
      setTimetableParentWidth(timetableParent.current.offsetWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 컴포넌트가 마운트될 때 초기 width 설정

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 빈 배열로 설정 -> 컴포넌트 마운트 시 한 번만 실행

  // "저장" 버튼 핸들러
  const saveTimetable = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/timetable",
        { timetable: subjects },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        toast.success("시간표 저장 성공!");
      } else {
        // toast.error("POST failed!");
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-4 transform -translate-y-4 mt-10 ">
      {/* 삭제 모드 메시지 */}
      {message && (
        <div
          className="opacity-50 animate-fadeOut fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white text-center text-lg px-4 py-2 rounded shadow-lg z-50"
          style={{ transition: "opacity 0.5s ease-in-out" }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}

      <ShadowBox width="w-3/4 max-w-6xl" padding="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-black font-bold">내 시간표</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleEditMode}
              className="text-gray-500 hover:text-red-700"
            >
              <TbTrash size={20} />
            </button>

            <ShadowBox width="w-auto" padding="p-0">
              <button
                className="px-4 py-1 bg-white text-black font-semibold rounded-lg active:translate-y-1 active:shadow-none"
                onClick={saveTimetable} // "저장" 버튼 -> POST
              >
                저장
              </button>
            </ShadowBox>
          </div>
        </div>

        {/* 시간표 영역 */}
        <div
          className="relative border border-gray-300 bg-white w-full h-[500px] flex flex-col"
          // 시간표 부모 요소
        >
          {/* 요일 */}
          <div className="flex" ref={timetableParent}>
            <div className="flex flex-1 h-[40px] items-center justify-center border-r border-gray-300 text-black font-semibold bg-gray-100">
              {""}
            </div>
            {days.map((day) => (
              <div
                key={day}
                className="flex flex-1 items-center justify-center border-r border-gray-300 text-black font-semibold bg-gray-100 text-xl"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 가로선 & 시간 레이블 */}
          <div className=" top-[40px] left-0">
            {timeLabels.map((time) => (
              <div
                key={time}
                className="relative flex items-center border-b border-gray-300 text-black bg-white"
                style={{ height: "46px", fontSize: "12px" }} // 폰트 크기 조정 및 배경색 설정
              >
                <div
                  className="absolute left-0 h-full flex items-center justify-center text-lg"
                  style={{
                    borderRight: "1px solid #ccc",
                    backgroundColor: "#f3f3f3", // 추가로 회색 강조
                    width: timetableParentWidth / 8,
                  }}
                >
                  {time}
                </div>
              </div>
            ))}
          </div>

          {/* 과목 데이터 */}
          {subjects.map((subject, index) => {
            const startTop = ((subject.startTime - 540) * 46) / 60; // 09:00 = 540분 기준
            const height = ((subject.endTime - subject.startTime) * 46) / 60;
            const dayIndex = days.indexOf(subject.day);

            if (dayIndex === -1) return null;

            return (
              <div
                key={index}
                className={` absolute text-black text-sm flex justify-center items-center ${subject.color} text-xl`} // 색상 적용
                style={{
                  top: `${startTop + 40}px`, // 상단 요일 헤더 높이 보정
                  left: `${
                    (timetableParentWidth / 8) * dayIndex +
                    timetableParentWidth / 8
                  }px`,
                  height: `${height}px`,
                  width: timetableParentWidth / 8,
                }}
                onClick={() => isEditMode && deleteSubject(index)}
              >
                {subject.name}
              </div>
            );
          })}
        </div>
      </ShadowBox>

      {/* '직접 추가' 버튼 */}
      <ShadowBox width="w-auto" padding="p-0">
        <button
          onClick={openDirectAddModal}
          className="px-4 py-2 bg-white text-black font-semibold rounded-lg active:translate-y-1 active:shadow-none"
        >
          추가하기
        </button>
      </ShadowBox>

      {/* 모달 컴포넌트 */}
      <DirectAddModal
        isOpen={isDirectAddModalOpen}
        onClose={closeDirectAddModal}
        onAddSubject={addSubject}
      />
    </div>
  );
};

export default Timetable;
