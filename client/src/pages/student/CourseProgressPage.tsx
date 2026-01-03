import { useUser } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import {
  useGetStudentCourseProgressService,
  useMarkCurrentLectureAsViewedService,
  useResetCurrentCourseProgressService,
} from "../../service/studentQueries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import Loader from "../../components/Loader";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { useEffect, useState } from "react";
import CourseProgressSidebar from "../../components/student-view/progress/CourseProgressSidebar";
import type { Lecture } from "../../@types/types";
import Player from "../../components/video-player";
import Confetti from "react-confetti";
import { Label } from "../../components/ui/label";

export default function CourseProgressPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("progress");
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { courseId } = useParams();
  const { user } = useUser();

  const { data, isLoading, refetch } = useGetStudentCourseProgressService(
    courseId || "",
    user?.id || ""
  );
  const { mutateAsync: markCurrentLectureAsViewed } =
    useMarkCurrentLectureAsViewedService(courseId || "", user?.id || "");
  const { mutateAsync: resetProgress } = useResetCurrentCourseProgressService(
    courseId || "",
    user?.id || ""
  );

  async function handleVideoEnded() {
    if (currentLecture?._id) {
      await markCurrentLectureAsViewed(currentLecture._id);
      // Optional: If you want to auto-advance to the next video, you can do it here
      // by finding the next index and settingCurrentLecture.
      // For now, refetching will update the sidebar progress checkmarks.
      await refetch();
    }
  }

  async function handleRewatchCourse() {
    const response = await resetProgress();
    if (response) {
      setCurrentLecture(data?.courseDetails?.curriculum[0] || null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      await refetch();
    }
  }

  useEffect(() => {
    if (data?.completed) {
      setShowCourseCompleteDialog(true);
      setShowConfetti(true);
    }
  }, [data?.completed]);

  useEffect(() => {
    if (
      !currentLecture &&
      data?.courseDetails?.curriculum?.length &&
      data?.progress?.length
    ) {
      const lastViewedIndex = data.progress.reduceRight((acc, obj, index) => {
        return acc === -1 && obj.viewed ? index : acc;
      }, -1);

      const nextIndex = lastViewedIndex === -1 ? 0 : lastViewedIndex + 1;

      const safeIndex =
        nextIndex < data.courseDetails.curriculum.length
          ? nextIndex
          : lastViewedIndex; // Stay on the last video if finished

      setCurrentLecture(data.courseDetails.curriculum[safeIndex]);
    } else if (!currentLecture && data?.courseDetails?.curriculum?.length) {
      // Fallback if progress array is empty/mismatched
      setCurrentLecture(data.courseDetails.curriculum[0]);
    }
  }, [data, currentLecture]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 15000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  if (isLoading) return <Loader height="h-screen" />;

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
            <Button onClick={() => navigate(`/course/details/${courseId}`)}>
              Go to Course Details Page
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      {showConfetti && <Confetti />}
      <SidebarInset className="h-screen overflow-hidden flex flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 lg:h-[60px] transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/my-courses")}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Back
            </Button>
            <h2 className="text-lg font-bold truncate max-w-[300px] md:max-w-md">
              {data.courseDetails?.title}
            </h2>
          </div>
          <SidebarTrigger />
        </header>

        <main className="flex-1 overflow-auto p-4 bg-muted/20 flex flex-col items-center">
          <div className="w-full max-w-4xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{currentLecture?.title}</h3>
            </div>

            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg flex items-center justify-center text-white relative">
              {currentLecture ? (
                <Player
                  url={currentLecture?.videoUrl}
                  width={800}
                  height={400}
                  onStart={() => console.log("Video started")}
                  onEnded={handleVideoEnded}
                />
              ) : (
                <div className="text-muted-foreground">
                  Select a lecture to start
                </div>
              )}
            </div>

            <div className="p-4 bg-background rounded-lg border">
              <h4 className="font-medium mb-2">About this lecture</h4>
              <p className="text-sm text-muted-foreground">
                No additional description provided.
              </p>
            </div>
          </div>
        </main>
      </SidebarInset>

      <CourseProgressSidebar
        progress={data.progress}
        courseDetails={data.courseDetails}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setCurrentLecture={setCurrentLecture}
        currentLecture={currentLecture}
      />

      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You have completed the course</Label>
              <div className="flex flex-row gap-3">
                <Button onClick={() => navigate("/my-courses")}>
                  My Courses Page
                </Button>
                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
