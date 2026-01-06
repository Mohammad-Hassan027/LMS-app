import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayCircle, CheckCircle } from "lucide-react";
import type { Course, Lecture, LectureProgress } from "@/@types/types";

type Props = {
  progress: LectureProgress[] | undefined;
  courseDetails: Course | undefined;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  currentLecture: Lecture | null;
  setCurrentLecture: (lecture: Lecture) => void;
};

export default function CourseProgressSidebar({
  progress,
  courseDetails,
  activeTab,
  setActiveTab,
  currentLecture,
  setCurrentLecture,
}: Props) {
  return (
    <Sidebar
      side="right"
      variant="floating"
      collapsible="offcanvas"
      className="mt-15 border-l"
    >
      <SidebarHeader className="border-b p-4 bg-background">
        <div className="flex w-full items-center justify-between bg-muted rounded-lg p-1">
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
      </SidebarHeader>

      <SidebarContent className="bg-background">
        {activeTab === "progress" && (
          <SidebarGroup>
            <SidebarGroupLabel>Course Content</SidebarGroupLabel>
            <SidebarGroupContent>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <SidebarMenu>
                  {courseDetails?.curriculum?.map((item) => {
                    const isCompleted = progress?.some(
                      (p) =>
                        p.lectureId?.toString() === item._id?.toString() &&
                        p.viewed
                    );

                    // CHECK: Is this the video currently playing?
                    const isActive = currentLecture?._id === item._id;

                    return (
                      <SidebarMenuItem key={item._id}>
                        <SidebarMenuButton
                          isActive={isActive}
                          onClick={() => setCurrentLecture(item)}
                          className="h-auto py-3"
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon Logic */}
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
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </ScrollArea>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {activeTab === "overView" && (
          <div className="p-4">
            <h3 className="font-semibold mb-2">About this course</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {courseDetails?.description || "No description available."}
            </p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
