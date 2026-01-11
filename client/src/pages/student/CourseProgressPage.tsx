import { useUser } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import {
  useGetStudentCourseProgressService,
  useMarkCurrentLectureAsViewedService,
  useResetCurrentCourseProgressService,
} from "@/service/studentQueries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/components/Loader";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import CourseProgressSidebar from "@/components/student-view/progress/CourseProgressSidebar";
import type { Lecture } from "@/@types/types";
import Player from "@/components/video-player";
import Confetti from "react-confetti";
// import { Label } from "@/components/ui/label";

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
          : lastViewedIndex;

      setCurrentLecture(data.courseDetails.curriculum[safeIndex]);
    } else if (!currentLecture && data?.courseDetails?.curriculum?.length) {
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
      <div className="h-screen flex items-center justify-center bg-background">
        <Dialog open>
          <DialogContent className="w-[90%] max-w-md rounded-xl border-none shadow-xl">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-center text-xl font-bold">
                Access Restricted 🔒
              </DialogTitle>
              <DialogDescription className="text-center text-base">
                You need to purchase this course to access the content.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Button
                className="w-full h-12 text-base rounded-lg"
                onClick={() => navigate(`/course/details/${courseId}`)}
              >
                Go to Course Details
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={true}
      className="flex flex-col md:flex-row h-screen overflow-hidden"
    >
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 100, // High enough to see, but usually pointer-events-none helps
            pointerEvents: "none", // Allows clicking through the confetti
          }}
          numberOfPieces={500}
          recycle={false}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      <SidebarInset className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 lg:h-[60px]">
          <div className="flex items-center gap-2 lg:gap-4 overflow-hidden">
            <Button
              onClick={() => navigate("/my-courses")}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 shrink-0"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <h2 className="text-sm md:text-lg font-bold truncate max-w-[200px] md:max-w-md">
              {data.courseDetails?.title}
            </h2>
          </div>

          {/* Only show Sidebar Toggle on Desktop (Mobile uses Sheet) */}
          <SidebarTrigger className="hidden md:flex" />
        </header>

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-2 md:p-4 bg-muted/20 flex flex-col">
          <div className="w-full max-w-4xl mx-auto space-y-4">
            {/* Title above video */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-semibold line-clamp-2">
                {currentLecture?.title}
              </h3>
            </div>

            {/* Video Player Container */}
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg flex items-center justify-center text-white relative">
              {currentLecture ? (
                <Player
                  url={currentLecture?.videoUrl}
                  onStart={() => console.log("Video started")}
                  onEnded={handleVideoEnded}
                />
              ) : (
                <div className="text-muted-foreground p-4 text-center">
                  Select a lecture to start
                </div>
              )}
            </div>

            {/* Lecture Description */}
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

      {/* COMPLETION DIALOG */}
      <Dialog
        open={showCourseCompleteDialog}
        onOpenChange={setShowCourseCompleteDialog}
      >
        <DialogContent className="w-[90%] max-w-md rounded-xl border-none shadow-2xl p-6">
          <DialogHeader className="items-center space-y-4">
            <div className="text-4xl animate-bounce">🎉</div>

            <DialogTitle className="text-2xl font-extrabold text-center">
              Congratulations!
            </DialogTitle>

            <DialogDescription className="text-center text-base font-medium text-muted-foreground">
              You have successfully completed the course: <br />
              <span className="text-foreground font-bold mt-1 block">
                {data.courseDetails?.title}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 pt-6">
            <Button
              className="w-full h-11 text-base rounded-lg shadow-md"
              onClick={() => navigate("/my-courses")}
            >
              Go to My Courses
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 text-base rounded-lg border-gray-300"
              onClick={handleRewatchCourse}
            >
              Rewatch Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
