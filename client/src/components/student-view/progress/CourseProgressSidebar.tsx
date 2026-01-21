import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Play, Check, ListVideo, FileText } from "lucide-react";
import type { Course, Lecture, LectureProgress } from "@/@types/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type Props = {
  progress: LectureProgress[] | undefined;
  courseDetails: Course | undefined;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  currentLecture: Lecture | null;
  setCurrentLecture: (lecture: Lecture) => void;
};

function CourseCurriculum({
  courseDetails,
  progress,
  currentLecture,
  setCurrentLecture,
}: Omit<Props, "setActiveTab" | "activeTab">) {
  return (
    <div className="flex flex-col w-full h-full">
      {courseDetails?.curriculum?.map((item, index) => {
        const isCompleted = progress?.some(
          (p) => p.lectureId?.toString() === item._id?.toString() && p.viewed,
        );
        const isActive = currentLecture?._id === item._id;

        return (
          <div
            key={item._id}
            onClick={() => setCurrentLecture(item)}
            className={`group flex items-start gap-3 p-4 border-b last:border-0 cursor-pointer transition-all hover:bg-muted/50 ${
              isActive
                ? "bg-primary/5 border-l-4 border-l-primary"
                : "border-l-4 border-l-transparent"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isCompleted ? (
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Check className="h-3 w-3" />
                </div>
              ) : isActive ? (
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                  <Play className="h-3 w-3 fill-current" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <span className="text-xs font-medium">{index + 1}</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <h4
                className={`text-sm font-medium leading-tight ${isCompleted ? "text-muted-foreground" : "text-foreground"}`}
              >
                {item.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                Video • 10 mins {/* Placeholder duration */}
              </p>
            </div>
          </div>
        );
      })}
    </div>
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
  // Calculate Progress Percentage
  const completedCount = progress?.filter((p) => p.viewed).length || 0;
  const totalCount = courseDetails?.curriculum?.length || 0;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const SidebarContentComponent = (
    <div className="flex flex-col h-full bg-background">
      {/* Sidebar Header */}
      <div className="p-5 border-b space-y-4">
        <div>
          <h2 className="font-bold text-lg leading-tight line-clamp-2 mb-1">
            {courseDetails?.title || "Course Content"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {courseDetails?.instructorName}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span>{Math.round(progressPercentage)}% Complete</span>
            <span>
              {completedCount}/{totalCount} Lectures
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-5 pt-4 pb-2">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="progress" className="gap-2">
              <ListVideo className="w-4 h-4" /> Content
            </TabsTrigger>
            <TabsTrigger value="overView" className="gap-2">
              <FileText className="w-4 h-4" /> Overview
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="progress" className="mt-0 h-full">
            <CourseCurriculum
              courseDetails={courseDetails}
              progress={progress}
              currentLecture={currentLecture}
              setCurrentLecture={setCurrentLecture}
            />
          </TabsContent>

          <TabsContent value="overView" className="mt-0 h-full p-5">
            <div className="prose prose-sm text-muted-foreground max-w-none">
              <h3 className="text-foreground font-semibold mb-2">
                Description
              </h3>
              <p>
                {courseDetails?.description ||
                  "No description available for this course."}
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );

  return (
    <>
      {/* --- Mobile View (Bottom Sheet) --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-background border-t p-4 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Current Lecture
          </span>
          <span className="font-semibold text-sm truncate max-w-[200px]">
            {currentLecture?.title || "Select a lecture"}
          </span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="shrink-0 gap-2 shadow-lg"
            >
              <ListVideo className="h-4 w-4" />
              Content
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[85vh] p-0 gap-0 rounded-t-2xl"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Course Curriculum</SheetTitle>
            </SheetHeader>
            {SidebarContentComponent}
          </SheetContent>
        </Sheet>
      </div>

      {/* --- Desktop View (Standard Sidebar) --- */}
      <Sidebar
        side="right"
        variant="sidebar"
        collapsible="none"
        className="hidden md:flex h-full border-l w-80 lg:w-96 shrink-0 bg-background z-10"
      >
        {SidebarContentComponent}
      </Sidebar>
    </>
  );
}
