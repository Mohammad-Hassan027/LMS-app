import { useState, Suspense } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useInstructorContext } from "@/contexts/Instructor/hook";

function InstructorViewLayout() {
  const { activeTab, setActiveTab } = useInstructorContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isRootInstructorPath =
    location.pathname === "/instructor" || location.pathname === "/instructor/";

  const menuItems = [
    {
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard />,
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
    },
    {
      label: "Courses",
      value: "courses",
      component: <InstructorCourses />,
      icon: <BookOpen className="h-5 w-5 mr-2" />,
    },
  ];

  const NavItem = ({
    item,
    isMobile = false,
  }: {
    item: (typeof menuItems)[0];
    isMobile?: boolean;
  }) => (
    <Button
      key={item.value}
      variant="ghost"
      className={`w-full justify-start h-12 px-4 rounded-xl transition-all duration-200 ${
        activeTab === item.value
          ? "bg-primary/5 text-primary font-bold shadow-sm ring-1 ring-primary/10"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
      }`}
      onClick={() => {
        navigate("/instructor");
        setActiveTab(item.value);
        if (isMobile) setIsMobileMenuOpen(false);
      }}
    >
      {item.icon}
      <span className="ml-3">{item.label}</span>
    </Button>
  );

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <aside className="hidden md:flex w-72 flex-col border-r border-gray-100 bg-white shadow-[1px_0_20px_0_rgba(0,0,0,0.02)] z-20">
        <div className="p-6 h-20 flex items-center border-b border-gray-50">
          <Link to={"/"} className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              PathOS Instructor
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main Menu
          </div>
          {menuItems.map((item) => (
            <NavItem key={item.value} item={item} />
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* HEADER */}
        <header className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Show Logo only on mobile since Sidebar has it on Desktop */}
            <div className="flex items-center md:hidden">
              <GraduationCap className="h-6 w-6 mr-2" />
              <span className="font-bold text-lg">PathOS</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 border-2 border-white shadow-sm",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </header>

        {/* SCROLLABLE BODY CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in-50 duration-500 slide-in-from-bottom-5">
            {isRootInstructorPath ? (
              menuItems.map((item) =>
                item.value === activeTab ? (
                  <div key={item.value}>{item.component}</div>
                ) : null,
              )
            ) : (
              <Suspense fallback={<Loader height="h-screen" />}>
                <Outlet />
              </Suspense>
            )}
          </div>
        </main>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="relative flex-1 w-3/4 max-w-xs bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b flex items-center justify-between h-16">
              <span className="font-bold text-lg flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Menu
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <NavItem key={item.value} item={item} isMobile={true} />
              ))}
            </nav>

            <div className="mt-auto p-4 border-t">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Close Menu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorViewLayout;
