import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./index.css";

// 토스트 알림 띄우기 위해 쓰는 라이브러리
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./pages/Layout.jsx";
import Landing from "./pages/landing/Landing.jsx";
import GroupPage from "./pages/group/GroupPages.jsx";
import Mypage from "./pages/mypage/MyPage.jsx";
import TimeTable from "./pages/timetable/TimeTable.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import ApiTest from "./pages/group/APITest.jsx";

import { tokenLoader } from "./loader/tokenLoader.js";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        loader: tokenLoader,
        // errorElement: <Navigate to="/" />,
        children: [
          {
            path: "/mypage",
            element: <Mypage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/group",
            children: [
              {
                index: true,
                element: <GroupPage />,
              },
              {
                path: ":name",
                element: <GroupPage />,
              },
            ],
          },
          {
            path: "/timetable",
            element: <TimeTable />,
          },
        ],
      },
    ],
  },
  {
    path: "/apitest/",
    element: <ApiTest />,
  },
]);

createRoot(document.getElementById("root")).render(
  <div>
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
  </div>
);
