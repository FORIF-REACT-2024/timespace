import React, { useMemo, useState } from "react";

// 단계별 색상 정의
const backgroundColors = [
  "#D4F3D8", // 1단계 (가장 연한 초록색)
  "#BFEABF", // 2단계
  "#A9E2A5", // 3단계
  "#85E292", // 4단계
  "#5ED970", // 5단계
  "#3ABF5E", // 6단계 (더 진한 초록색)
  "#219646", // 7단계 (가장 진한 초록색)
];

// count에 따른 색상을 반환하는 함수
const getBackgroundColor = (count) => {
  if (count === 0) return "bg-gray-300"; // 데이터가 없을 경우 흰색 배경
  return backgroundColors[Math.min(count - 1, backgroundColors.length - 1)];
};

function GroupTableRow({ timeNum, timeTableData }) {
  const [popupIndex, setPopupIndex] = useState(null); // 팝업 상태 관리
  const [isPopupPinned, setIsPopupPinned] = useState(false); // 툴팁 고정 여부
  const days = ["월", "화", "수", "목", "금", "토", "일"];

  const rowData = useMemo(() => {
    return days.map((day) => {
      const timeData = timeTableData[day]?.find(
        (lecture) => lecture.start <= timeNum && timeNum < lecture.end
      );

      if (timeData) {
        if (timeData.start === timeNum) {
          return {
            count: timeData.count,
            rowSpan: timeData.end - timeData.start,
            namelist: timeData.namelist,
            isFirstCell: timeData.start === timeNum, // 첫 번째 셀 여부 확인
          };
        }
        return null;
      }

      return { count: 0, rowSpan: 1, namelist: [], isFirstCell: false };
    });
  }, [timeNum, timeTableData]);

  const handlePopupToggle = (idx) => {
    if (popupIndex === idx && isPopupPinned) {
      // 이미 고정된 팝업을 클릭하면 닫음
      setPopupIndex(null);
      setIsPopupPinned(false);
    } else {
      // 팝업 열거나 다른 팝업으로 이동
      setPopupIndex(idx);
      setIsPopupPinned(true);
    }
  };

  return (
    <>
      {rowData.map((data, idx) =>
        data ? (
          <td
            key={idx}
            rowSpan={data.rowSpan}
            className="border-t border-b border-gray-300 px-3 py-4 text-center relative"
            style={{
              backgroundColor: getBackgroundColor(data.count),
              height: data.rowSpan === 1 ? "70px" : undefined,
            }}
          >
            {data.count > 0 && (
              <>
                {/* count를 버튼 형식으로 표시 */}
                <button
                  className="bg-transparent border-none text-xl cursor-pointer"
                  onClick={() => handlePopupToggle(idx)} // 클릭 시 팝업 고정 토글
                  onMouseEnter={() => {
                    if (!isPopupPinned) setPopupIndex(idx); // 마우스 Hover 시 팝업 표시
                  }}
                  onMouseLeave={() => {
                    if (!isPopupPinned) setPopupIndex(null); // Hover 종료 시 팝업 숨기기
                  }}
                >
                  {data.count}
                </button>

                {/* namelist 툴팁 팝업 */}
                {data.isFirstCell && popupIndex === idx && (
                  <div
                    className={`absolute z-10 bg-white border border-gray-300 p-2 rounded shadow-lg border-t border-b ${
                      isPopupPinned ? "ring ring-blue-500" : ""
                    }`}
                    style={{
                      top: "60%",
                      left: "15%",
                      whiteSpace: "nowrap",
                      lineHeight: "1.5", // 줄 간격 추가
                    }}
                  >
                    {data.namelist.map((name, nameIdx) => (
                      <div key={nameIdx}>{name}</div> // 이름을 한 줄씩 출력
                    ))}
                  </div>
                )}
              </>
            )}
          </td>
        ) : null
      )}
    </>
  );
}

export default GroupTableRow;
