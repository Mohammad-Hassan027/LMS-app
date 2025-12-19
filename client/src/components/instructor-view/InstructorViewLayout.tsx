import { Link, Outlet } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { GraduationCap } from "lucide-react";
import InstructorCourses from "./courses";
import InstructorDashboard from "./dashboard";
import { Button } from "../ui/button";
import { useInstructorContext } from "../../contexts/Instructor/hook";

function InstructorViewLayout() {
  const { activeTab, setActiveTab } = useInstructorContext();

  const menuItems = [
    {
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard />,
    },
    {
      label: "Courses",
      value: "courses",
      component: <InstructorCourses />,
    },
  ];
  return (
    <div>
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 mr-4" />
          <span className="font-extrabold text-base sm:text-xl">
            LMS LERN
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex md:hidden">
            {menuItems.map((menuItem) => (
              <Button
                key={menuItem.value}
                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                onClick={() => setActiveTab(menuItem.value)}
              >
                {menuItem.label}
              </Button>
            ))}
          </div>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default InstructorViewLayout;
