import { Outlet } from "react-router-dom";
import StudentViewHeader from "@/components/student-view/StudentViewHeader";
import { Suspense } from "react";
import Loader from "@/components/Loader";

function StudentViewLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StudentViewHeader />
      <main className="grow">
        <Suspense fallback={<Loader height="h-48" />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default StudentViewLayout;
