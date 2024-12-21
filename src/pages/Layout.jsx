import Navigation from "../components/Navigation";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
