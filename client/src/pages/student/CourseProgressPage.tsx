import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import {
  useGetStudentCourseProgressService,
  useMarkCurrentLectureAsViewedService,
  useResetCurrentCourseProgressService,
} from "@/service/studentQueries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useProtectedUser } from "@/hooks/useProtectedUser";
import { Badge } from "@/components/ui/badge";

export default function CourseProgressPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("progress");
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { courseId } = useParams();

  const user = useProtectedUser();

  const { data, isLoading, refetch } = useGetStudentCourseProgressService(
    courseId || "",
    user.id,
  );
  const { mutateAsync: markCurrentLectureAsViewed } =
    useMarkCurrentLectureAsViewedService(courseId || "", user.id);
  const { mutateAsync: resetProgress } = useResetCurrentCourseProgressService(
    courseId || "",
    user.id,
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

  const handleNextLecture = () => {
    if (!currentLecture || !data?.courseDetails?.curriculum) return;
    const currentIndex = data.courseDetails.curriculum.findIndex(
      (l) => l._id === currentLecture._id,
    );
    if (currentIndex < data.courseDetails.curriculum.length - 1) {
      setCurrentLecture(data.courseDetails.curriculum[currentIndex + 1]);
    }
  };

  const handlePrevLecture = () => {
    if (!currentLecture || !data?.courseDetails?.curriculum) return;
    const currentIndex = data.courseDetails.curriculum.findIndex(
      (l) => l._id === currentLecture._id,
    );
    if (currentIndex > 0) {
      setCurrentLecture(data.courseDetails.curriculum[currentIndex - 1]);
    }
  };

  if (isLoading) return <Loader height="h-screen" />;

  if (!data || !data.isPurchased) {
    return (
      <div className="h-screen flex items-center justify-center bg-background p-4">
        <Dialog open>
          <DialogContent className="w-full max-w-md rounded-xl border-none shadow-2xl">
            <DialogHeader className="space-y-4 flex flex-col items-center">
              <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
              <DialogTitle className="text-center text-2xl font-bold">
                Access Restricted
              </DialogTitle>
              <DialogDescription className="text-center text-base">
                Please purchase this course to unlock the content.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate(`/course/details/${courseId}`)}
              >
                View Course Details
              </Button>
            </DialogFooter>
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
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 lg:px-6 z-20">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/my-courses")}
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <h1 className="font-bold text-lg tracking-tight line-clamp-1 max-w-[200px] md:max-w-md">
              {data.courseDetails?.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <SidebarTrigger variant="outline" />
            </div>
          </div>
        </header>

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-2 md:p-4 bg-muted/20 flex flex-col">
          <div className="w-full max-w-4xl mx-auto space-y-4">
            {/* Video Player Container */}
            <div className="rounded-xl overflow-hidden shadow-2xl bg-black border border-zinc-800 relative group">
              <div className="aspect-video w-full flex items-center justify-center">
                {currentLecture ? (
                  <Player
                    url={currentLecture?.videoUrl}
                    onEnded={handleVideoEnded}
                    width={"100%"}
                    height={"100%"}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-500">
                    <Loader />
                    <p className="mt-4 text-sm">Loading Lecture...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {currentLecture?.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-muted-foreground font-normal"
                    >
                      Lecture{" "}
                      {data?.courseDetails?.curriculum.length &&
                        data.courseDetails?.curriculum.findIndex(
                          (l) => l._id === currentLecture?._id,
                        ) + 1}
                    </Badge>
                    {data.progress?.find(
                      (p) => p.lectureId === currentLecture?._id,
                    )?.viewed && (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevLecture}
                    disabled={
                      !currentLecture ||
                      data.courseDetails?.curriculum.findIndex(
                        (l) => l._id === currentLecture._id,
                      ) === 0
                    }
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                  </Button>
                  <Button
                    onClick={handleNextLecture}
                    disabled={
                      !currentLecture ||
                      data.courseDetails?.curriculum.findIndex(
                        (l) => l._id === currentLecture._id,
                      ) ===
                        (data.courseDetails?.curriculum.length
                          ? data.courseDetails?.curriculum.length
                          : 0) -
                          1
                    }
                  >
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Lecture Description */}
              <div className="bg-background border rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  Lecture Notes
                </h3>
                <div className="prose prose-sm text-muted-foreground max-w-none mb-10 sm:mb-2">
                  <p>
                    There are no specific notes attached to this lecture. Please
                    focus on the key concepts demonstrated in the video. If you
                    have questions, you can refer to the course overview.
                  </p>
                </div>
              </div>
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
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="flex flex-col items-center gap-4">
            <div className="text-6xl animate-bounce pt-4">🎓</div>
            <DialogTitle className="text-2xl font-bold text-green-600">
              Course Completed!
            </DialogTitle>
            <DialogDescription className="text-base">
              You've successfully completed{" "}
              <strong>{data.courseDetails?.title}</strong>. We are proud of your
              achievement!
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => navigate("/my-courses")}
            >
              Back to Dashboard
            </Button>
            <Button className="flex-1" onClick={handleRewatchCourse}>
              Restart Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
