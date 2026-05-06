import { BarChart, Book, LogOut } from "lucide-react";
import { lazy, Suspense } from "react";
import Loader from "@/components/Loader";
const InstructorDashboard = lazy(
  () => import("@/components/instructor-view/dashboard"),
);
const InstructorCourses = lazy(
  () => import("@/components/instructor-view/courses"),
);
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useClerk } from "@clerk/clerk-react";
import { useInstructorContext } from "@/contexts/Instructor/hook";
import { toast } from "sonner";

function InstructorDashboardPage() {
  const { activeTab, setActiveTab } = useInstructorContext();
  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: InstructorDashboard,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: InstructorCourses,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  const { signOut } = useClerk();

  function handleLogout() {
    signOut({ redirectUrl: "/" });
    toast.success("Logged out successfully.");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
                key={menuItem.value}
                className="w-full justify-start mb-3"
                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent value={menuItem.value} key={menuItem.value}>
                {menuItem.component !== null ? (
                  <Suspense fallback={<Loader height="h-48" />}>
                    <menuItem.component />
                  </Suspense>
                ) : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardPage;
