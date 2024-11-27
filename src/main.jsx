import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// 토스트 알림 띄우기 위해 쓰는 라이브러리
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Landing from "./pages/landing/Landing.jsx";
import GroupPage from "./pages/group/GroupPages.jsx";
import Mypage from "./pages/mypage/MyPage.jsx";
import GroupView from "./pages/group/GroupDataViewer.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/mypage",
    element: <Mypage />,
  },
  {
    path: "/group",
    element: <GroupPage />,
  },
  {
    path: "/group/:name", // 새로운 라우트 추가
    element: <GroupPage />, // GroupPage에서 `name` 파라미터를 사용할 수 있도록 설정
  },
  {
    path: "/data/view",
    element: <GroupView />,
  },
  
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 알림 설정 */}
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      theme="dark"
      transition={Slide}
    />
    <RouterProvider router={router} />
  </StrictMode>
);