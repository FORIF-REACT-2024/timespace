import { useEffect, useState } from 'react';
import GroupDataApi from './GroupDataApi'; // GroupDataApi import

const GroupDataViewer = () => {
  const [data, setData] = useState(null); // GroupDataApi에서 가져온 데이터를 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 메시지 관리

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GroupDataApi(); // GroupDataApi 호출
        setData(result); // 가져온 데이터를 상태에 저장
      } catch (error) {
        setError(error.message); // 에러 메시지 저장
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // 로딩 중 메시지
  }

  if (error) {
    return <p>Error: {error}</p>; // 에러 메시지 표시
  }

  if (!data) {
    return <p>No data available.</p>; // 데이터가 없을 때
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Group Data Viewer</h1>

      <div>
        <h2>TimeTable Data:</h2>
        <pre style={{ backgroundColor: '#f4f4f4', padding: '10px' }}>
          {JSON.stringify(data.timeTable, null, 2)}
        </pre>
      </div>

      <div>
        <h2>Group Data:</h2>
        <pre style={{ backgroundColor: '#f4f4f4', padding: '10px' }}>
          {JSON.stringify(data.groups, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default GroupDataViewer;
