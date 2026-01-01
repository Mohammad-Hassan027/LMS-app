import { useUser } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ChevronLeftIcon, Sidebar } from "lucide-react";
import { useGetStudentCourseProgressService } from "../../service/studentQueries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import Loader from "../../components/Loader";
import {
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { useState } from "react";

export default function CourseProgressPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overView");
  const { courseId } = useParams();
  const { user } = useUser();

  const { data, isLoading } = useGetStudentCourseProgressService(
    courseId || "",
    user?.id || ""
  );

  if (isLoading) return <Loader height="h-screen" />;

  console.log(data);

  if (!data || !data.isPurchased) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Dialog open>
          <DialogHeader>
            <DialogTitle>
              You need to purchase this course to access it.
            </DialogTitle>
          </DialogHeader>
          <DialogContent>
            <Button onClick={() => navigate(`course/details/${courseId}`)}>
              Go to Course Details Page
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Head */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Button variant={"ghost"} size={"sm"}>
            <ChevronLeftIcon className="w-4 h-4" />
            Back to My Courses Page
          </Button>
          <h2 className="text-2xl font-bold">{data.courseDetails?.title}</h2>
        </div>
      </div>
      {/* Content */}
      <SidebarProvider>
        <SidebarInset className="flex flex-col">
          <header>
            <SidebarTrigger />
          </header>
          <main></main>
        </SidebarInset>
        <Sidebar className="mt-16 h-[calc(100vh-4rem)] border-r bg-background">
          <SidebarHeader className="border-b px-4 flex justify-between font-bold">
            <Button
              className="w-full justify-start mb-3"
              variant={activeTab === "progress" ? "secondary" : "ghost"}
            ></Button>
            <Button
              className="w-full justify-start mb-3"
              variant={activeTab === "overView" ? "secondary" : "ghost"}
            ></Button>
          </SidebarHeader>
          <SidebarContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value={"progress"}>
                {data.progress?.lectureId}
              </TabsContent>
              <TabsContent value={"overView"}>
                {data.courseDetails?.description}
              </TabsContent>
            </Tabs>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
