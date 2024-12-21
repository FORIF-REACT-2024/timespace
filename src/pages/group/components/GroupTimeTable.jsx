import { useEffect, useState, useRef } from "react";
import { fetchTimetable, fetchUserTimetable } from "../../../api/timeTableAPi";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const TIME_SLOTS = [
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

const HEADER_HEIGHT = 60;

const GroupTimetable = ({ groupData }) => {
  const [memberSchedules, setMemberSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const timetableParent = useRef(null);
  const [timetableParentWidth, setTimetableParentWidth] = useState(0);
  const [cellHeight, setCellHeight] = useState(65);

  useEffect(() => {
    const fetchAllSchedules = async () => {
      if (!groupData?.members?.length) return;

      try {
        setLoading(true);
        // 모든 그룹 멤버의 시간표를 가져옴
        const memberSchedules = await Promise.all(
          groupData.members.map((member) => fetchUserTimetable(member.id))
        );

        // 모든 시간표 데이터 합치기
        const allSchedules = memberSchedules
          .filter((schedule) => schedule !== null)
          .flat();

        console.log("All schedules:", allSchedules);

        // 각 시간대별로 수업이 있는 멤버 수를 집계
        const aggregatedData = {};
        DAYS.forEach((day) => {
          TIME_SLOTS.forEach((timeSlot) => {
            const [startHour] = timeSlot.split(" ~ ")[0].split(":");
            const [endHour] = timeSlot.split(" ~ ")[1].split(":");
            const startTime = parseInt(startHour) * 60;
            const endTime = parseInt(endHour) * 60;

            // 해당 시간대에 수업이 있는 멤버 수 계산
            const count = allSchedules.filter(
              (item) =>
                item.day === day &&
                item.startTime < endTime &&
                item.endTime > startTime
            ).length;

            aggregatedData[`${day}-${timeSlot}`] = count;
          });
        });

        setMemberSchedules(aggregatedData);
      } catch (error) {
        console.error("시간표 조회 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSchedules();
  }, [groupData]);

  useEffect(() => {
    const updateDimensions = () => {
      if (timetableParent.current) {
        setTimetableParentWidth(timetableParent.current.offsetWidth);
        const availableHeight =
          timetableParent.current.offsetHeight - HEADER_HEIGHT;
        const newCellHeight = availableHeight / TIME_SLOTS.length;
        setCellHeight(newCellHeight);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [timetableParent.current]);

  if (loading) {
    return (
      <div className="relative h-full">
        <div className="absolute top-[11px] left-0 right-0 bottom-0 bg-[#254D64] rounded-[20px]" />
        <div className="relative h-full bg-white border-[3px] border-[#254D64] rounded-[20px] p-4 flex items-center justify-center">
          <div>로딩중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="absolute top-[11px] left-0 right-0 h-[calc(100%-22px)] bg-[#254D64] rounded-[20px]" />
      <div className="relative h-[calc(100%-22px)] bg-white border-[3px] border-[#254D64] rounded-[20px] p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-black font-bold">
            {groupData?.name || "그룹"} 시간표
          </h2>
        </div>

        <div className="h-[calc(100%-3rem)]">
          <div
            className="border border-gray-300 bg-white w-full h-full flex flex-col"
            ref={timetableParent}
          >
            {/* 요일 헤더 */}
            <div
              className="flex"
              style={{
                height: `${HEADER_HEIGHT}px`,
                minHeight: `${HEADER_HEIGHT}px`,
              }}
            >
              <div className="flex flex-1 items-center justify-center border-r border-gray-300 text-black font-semibold bg-gray-100">
                {""}
              </div>
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="flex flex-1 items-center justify-center border-r border-gray-300 text-xl text-black font-semibold bg-gray-100"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 시간 레이블과 그리드 */}
            <div className="relative flex-1">
              {TIME_SLOTS.map((time, timeIndex) => (
                <div
                  key={time}
                  className="absolute w-full border-b border-gray-300"
                  style={{
                    height: `${cellHeight}px`,
                    top: `${timeIndex * cellHeight}px`,
                  }}
                >
                  <div
                    className="text-xl absolute left-0 h-full flex items-center justify-center text-sm"
                    style={{
                      width: timetableParentWidth / 8,
                      borderRight: "1px solid #ccc",
                      backgroundColor: "#f3f3f3",
                    }}
                  >
                    {time}
                  </div>

                  {DAYS.map((day, dayIndex) => {
                    const memberCount = memberSchedules[`${day}-${time}`] || 0;
                    const opacity =
                      memberCount / (groupData?.members?.length || 1);

                    return (
                      <div
                        key={`${day}-${time}`}
                        className="absolute flex items-center justify-center"
                        style={{
                          left: `${
                            (timetableParentWidth / 8) * (dayIndex + 1)
                          }px`,
                          width: `${timetableParentWidth / 8}px`,
                          height: `${cellHeight}px`,
                          backgroundColor:
                            memberCount > 0 ? "#90EE90" : "transparent",
                          opacity: opacity,
                          borderRight: "1px solid #ccc",
                        }}
                      >
                        {memberCount > 0 && (
                          <span className="text-black font-bold">
                            {memberCount}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupTimetable;
