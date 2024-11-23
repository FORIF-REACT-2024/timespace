import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Easteregg from "./pages/Easteregg.jsx";
// 토스트 알림 띄우기 위해 쓰는 라이브러리
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProfilePage from "./pages/profile/ProfilePage.jsx";
import Mypage from "./pages/mypage/MyPage.jsx";
import Test from "./pages/test/Test.jsx";
import Landing from "./pages/landing/Landing.jsx";
import GroupPage from "./pages/group/GroupPages.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/mypage",
    element: <Mypage />,
  },
  {
    path: "/easteregg",
    element: <Easteregg />,
  },
  {
    path: "/group",
    element: <GroupPage />,
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
