import { SignedOut } from "@clerk/clerk-react";
import ProtectedRoute from "@/components/protected-route";
import { Outlet, useRoutes } from "react-router-dom";
import { lazy } from "react";

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const SignInPage = lazy(() => import("@/pages/auth/SignInPage"));
const SignUpPage = lazy(() => import("@/pages/auth/SignUpPage"));
const HomePage = lazy(() => import("@/pages/student/HomePage"));
const InstructorDashboardPage = lazy(() => import("@/pages/instructor"));
const StudentViewLayout = lazy(
  () => import("@/components/student-view/StudentViewLayout"),
);
const InstructorViewLayout = lazy(
  () => import("@/components/instructor-view/InstructorViewLayout"),
);
const AddNewCoursePage = lazy(() => import("@/pages/instructor/addNewCourse"));
const CoursesPage = lazy(() => import("@/pages/student/CoursesPage"));
const CourseDetailsPage = lazy(
  () => import("@/pages/student/CourseDetailsPage"),
);
const MyCoursesPage = lazy(() => import("@/pages/student/MyCoursesPage"));
const CourseProgressPage = lazy(
  () => import("@/pages/student/CourseProgressPage"),
);
const BecomeInstructor = lazy(() => import("@/pages/student/BecomeInstructor"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("@/pages/UnauthorizedPage"));
const AboutPage = lazy(() => import("@/pages/student/AboutPage"));
const ContactPage = lazy(() => import("@/pages/student/ContactPage"));
const CartPage = lazy(() => import("@/pages/student/CartPage"));

export default function Routes() {
  const element = useRoutes([
    //auth
    {
      path: "/",
      element: (
        <SignedOut treatPendingAsSignedOut={true}>
          <Outlet />
        </SignedOut>
      ),
      children: [
        {
          path: "login",
          element: <SignInPage />,
        },
        {
          path: "register",
          element: <SignUpPage />,
        },
      ],
    },
    //free
    {
      path: "/",
      element: <StudentViewLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "courses",
          element: <CoursesPage />,
        },
        {
          path: "course/details/:courseId",
          element: <CourseDetailsPage />,
        },
        {
          path: "cart",
          element: <CartPage />,
        },
        {
          path: "about",
          element: <AboutPage />,
        },
        {
          path: "contact",
          element: <ContactPage />,
        },
      ],
    },
    // loggedIn student
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <StudentViewLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "become-instructor",
          element: <BecomeInstructor />,
        },
        {
          path: "my-courses",
          element: <MyCoursesPage />,
        },
        {
          path: "course-progress/:courseId",
          element: <CourseProgressPage />,
        },
      ],
    },
    // instructor
    {
      path: "/instructor",
      element: (
        <ProtectedRoute allowedRoles={["instructor"]}>
          <InstructorViewLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <InstructorDashboardPage />,
        },
        {
          path: "add-new-course",
          element: <AddNewCoursePage />,
        },
        {
          path: "edit-course/:courseId",
          element: <AddNewCoursePage />,
        },
      ],
    },
    {
      path: "admin",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/unauthorized",
      element: <UnauthorizedPage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);
  return element;
}
