import { Outlet } from "react-router-dom";
import StudentViewHeader from "./StudentViewHeader";

function StudentViewLayout() {
  return (
    <div>
      <StudentViewHeader />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

export default StudentViewLayout;
