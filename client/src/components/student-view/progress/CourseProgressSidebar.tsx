import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayCircle, CheckCircle, ListVideo } from "lucide-react";
import type { Course, Lecture, LectureProgress } from "@/@types/types";

type Props = {
  progress: LectureProgress[] | undefined;
  courseDetails: Course | undefined;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  currentLecture: Lecture | null;
  setCurrentLecture: (lecture: Lecture) => void;
};

function SidebarTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
}) {
  return (
    <div className="flex w-full items-center justify-between bg-muted rounded-lg p-1 mb-4">
      <Button
        className="w-1/2 h-8 text-xs rounded-md shadow-none"
        variant={activeTab === "progress" ? "default" : "ghost"}
        size="sm"
        onClick={() => setActiveTab("progress")}
      >
        Content
      </Button>
      <Button
        className="w-1/2 h-8 text-xs rounded-md shadow-none"
        variant={activeTab === "overView" ? "default" : "ghost"}
        size="sm"
        onClick={() => setActiveTab("overView")}
      >
        Overview
      </Button>
    </div>
  );
}

function CourseCurriculum({
  activeTab,
  courseDetails,
  progress,
  currentLecture,
  setCurrentLecture,
}: Omit<Props, "setActiveTab">) {
  if (activeTab === "overView") {
    return (
      <div className="p-4">
        <h3 className="font-semibold mb-2">About this course</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {courseDetails?.description || "No description available."}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-14rem)]">
      <div className="space-y-1 p-2">
        {courseDetails?.curriculum?.map((item) => {
          const isCompleted = progress?.some(
            (p) => p.lectureId?.toString() === item._id?.toString() && p.viewed
          );
          const isActive = currentLecture?._id === item._id;

          return (
            <div
              key={item._id}
              onClick={() => setCurrentLecture(item)}
              className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-green-600 fill-green-100" />
                ) : (
                  <PlayCircle
                    className={`h-4 w-4 ${
                      isActive
                        ? "text-primary fill-primary/10"
                        : "text-muted-foreground"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-sm leading-tight line-clamp-2 ${
                  isCompleted
                    ? "text-muted-foreground line-through decoration-transparent"
                    : "font-medium"
                }`}
              >
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export default function CourseProgressSidebar({
  progress,
  courseDetails,
  activeTab,
  setActiveTab,
  currentLecture,
  setCurrentLecture,
}: Props) {
  const sidebarContent = (
    <>
      <SidebarHeader className="border-b p-4 bg-background">
        <h2 className="font-bold text-lg mb-2 md:hidden">
          {courseDetails?.title || "Course"}
        </h2>
        <SidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </SidebarHeader>

      <div className="bg-background flex-1">
        <CourseCurriculum
          activeTab={activeTab}
          courseDetails={courseDetails}
          progress={progress}
          currentLecture={currentLecture}
          setCurrentLecture={setCurrentLecture}
        />
      </div>
    </>
  );

  return (
    <>
      <div className="md:hidden p-4 bg-background border-b flex items-center justify-between">
        <span className="font-semibold text-sm truncate pr-4">
          {currentLecture?.title || "Select a lecture"}
        </span>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0">
              <ListVideo className="h-4 w-4 mr-2" />
              Course Content
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[80vh] flex flex-col p-0 gap-0"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Course Curriculum</SheetTitle>
            </SheetHeader>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:block h-full">
        <Sidebar
          side="right"
          variant="floating"
          collapsible="offcanvas"
          className="mt-15 border-l h-full"
        >
          {sidebarContent}
        </Sidebar>
      </div>
    </>
  );
}
