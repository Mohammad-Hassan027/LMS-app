import { Outlet } from "react-router-dom";
import StudentViewHeader from "@/components/student-view/StudentViewHeader";

function StudentViewLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StudentViewHeader />
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentViewLayout;
