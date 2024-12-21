import React from "react";
import TimeTableRow from "./GroupTableRow";
import Chip from "../../components/Chip"; // Import the Chip component

const hourData = Array.from({ length: 11 }, (_, j) => j + 9); // 9~19시
const days = ["월", "화", "수", "목", "금", "토", "일"];

const GroupTable = ({ timeTableData, groupName, Edit }) => {
  return (
    <div>
      {/* 상단바 */}
      <div className="flex w-full max-w-5xl mb-4 px-4 gap-10">
        <h2 className="text-black text-2xl font-bold flex items-center space-x-2">
          <span>{groupName}</span>
          {/* 공유하기 이모티콘 추가 */}
          <button className="text-2xl cursor-pointer">
            📤 {/* 공유하기 이모티콘 */}
          </button>
        </h2>

        {/*
        <div className="flex space-x-4">
          <Chip
            isSelected={true}  // Dynamically control this state based on your needs
            onClick={() => {
              // Handle the click if necessary
            }}
          />
          <Chip
            isSelected={false}  // Dynamically control this state based on your needs
            onClick={() => {
              // Handle the click if necessary
            }}
          />
        </div>
        */}
      </div>

      {/* 시간표 테이블 */}
      <div className="w-full max-w-5xl border-t border-b overflow-y-auto border border-gray-300" style={{ maxHeight: "calc(100vh - 180px)" }}>
        <table className="table-fixed border-collapse w-full text-black">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 px-4 py-2 w-1/8">시간</th>
              {days.map((day) => (
                <th key={day} className="border border-gray-300 bg-gray-100 px-2 py-1 text-center w-1/8">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hourData.map((time) => (
              <tr key={time}>
                <td className="border border-gray-300 bg-gray-100 px-2 py-1 text-center">{`${time}:00 - ${time + 1}:00`}</td>
                <TimeTableRow
                  timeNum={time}
                  timeTableData={timeTableData}
                  Edit={Edit}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupTable;
