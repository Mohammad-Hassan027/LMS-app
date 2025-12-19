import { Outlet, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { SignedOut } from "@clerk/clerk-react";
import ProtectedRoute from "./components/protected-route";
import Loader from "./components/Loader";

const SignInPage = lazy(() => import("./pages/auth/SignInPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const HomePage = lazy(() => import("./pages/student/HomePage"));
const InstructorDashboardPage = lazy(() => import("./pages/instructor"));
const StudentViewLayout = lazy(
  () => import("./components/student-view/StudentViewLayout")
);
const InstructorViewLayout = lazy(
  () => import("./components/instructor-view/InstructorViewLayout")
);
const AddNewCoursePage = lazy(() => import("./pages/instructor/addNewCourse"));
const CoursesPage = lazy(() => import("./pages/student/CoursesPage"));
const CourseDetailsPage = lazy(
  () => import("./pages/student/CourseDetailsPage")
);
const MyCoursesPage = lazy(() => import("./pages/student/MyCoursesPage"));

function App() {
  return (
    <>
      <Suspense fallback={<Loader height="h-screen" />}>
        <Routes>
          <Route
            path="/"
            element={
              <SignedOut treatPendingAsSignedOut={true}>
                <Outlet />
              </SignedOut>
            }
          >
            <Route path="login" element={<SignInPage />} />
            <Route path="register" element={<SignUpPage />} />
          </Route>

          <Route path="/" element={<StudentViewLayout />}>
            <Route index element={<HomePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="course/:courseId" element={<CourseDetailsPage />} />
          </Route>

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <StudentViewLayout />
              </ProtectedRoute>
            }
          >
            <Route path="cart" element={<div>Cart</div>} />
            <Route path="checkout" element={<div>Checkout page</div>} />
            <Route path="my-courses" element={<MyCoursesPage />} />
          </Route>

          <Route
            path="/instructor"
            element={
              <ProtectedRoute allowedRoles={["instructor"]}>
                <InstructorViewLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<InstructorDashboardPage />} />
            <Route path="add-new-course" element={<AddNewCoursePage />} />
            <Route
              path="edit-course/:courseId"
              element={<AddNewCoursePage />}
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

// import SignInPage from "./pages/auth/SignInPage";
// import SignUpPage from "./pages/auth/SignUpPage";
// import HomePage from "./pages/student/home";
// import InstructorDashboardPage from "./pages/instructor";
// import StudentViewLayout from "./components/student-view/StudentViewLayout";
// import InstructorViewLayout from "./components/instructor-view/InstructorViewLayout";
// import ProtectedRoute from "./components/protected-route";
// import AddNewCoursePage from "./pages/instructor/addNewCourse";
// import CoursesPage from "./pages/student/CoursesPage";
// import CourseDetails from "./pages/student/CourseDetailsPage";
// import MyCourses from "./pages/student/MyCoursesPage";
