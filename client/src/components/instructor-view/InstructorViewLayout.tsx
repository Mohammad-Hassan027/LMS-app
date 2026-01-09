import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { useInstructorContext } from "@/contexts/Instructor/hook";

function InstructorViewLayout() {
  const { activeTab, setActiveTab } = useInstructorContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      variant={activeTab === item.value ? "secondary" : "ghost"}
      className={`w-full justify-start mb-2 ${
        activeTab === item.value
          ? "bg-muted font-bold"
          : "text-muted-foreground"
      }`}
      onClick={() => {
        setActiveTab(item.value);
        if (isMobile) setIsMobileMenuOpen(false);
      }}
    >
      {item.icon}
      {item.label}
    </Button>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="hidden md:flex w-64 flex-col border-r bg-white shadow-sm">
        <div className="p-4 border-b h-16 flex items-center">
          <Link to={"/"} className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-extrabold text-xl">PathOS Instructor</span>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <NavItem key={item.value} item={item} />
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 lg:px-6">
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

          <div className="flex items-center gap-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </header>

        {/* SCROLLABLE BODY CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {menuItems.map((item) =>
            item.value === activeTab ? (
              <div key={item.value}>{item.component}</div>
            ) : null
          )}
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
