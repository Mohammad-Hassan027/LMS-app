import { Outlet } from "react-router-dom";
import StudentViewHeader from "@/components/student-view/StudentViewHeader";

function StudentViewLayout() {
  return (
    <div>
      <StudentViewHeader />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentViewLayout;
