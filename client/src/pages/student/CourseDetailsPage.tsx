import { useNavigate, useParams } from "react-router-dom";
import { useStudentCourseDetailsService } from "../../service/studentQueries";
import Loader from "../../components/Loader";
import { CheckCircle, Globe, Lock, PlayCircle, Video } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Player from "../../components/video-player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { useEffect, useState } from "react";
import PaypalPayment from "../../components/PaypalPayment";
import { useUser } from "@clerk/clerk-react";
import { checkIsStudentEnrolledService } from "../../service";

function CourseDetails() {
  const { courseId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [freePreviewLectureVideoUrl, setFreePreviewLectureVideoUrl] =
    useState("");

  useEffect(() => {
    if (!courseId || !user?.id) return;
    let canceled = false;
    (async () => {
      try {
        const isEnrolled = await checkIsStudentEnrolledService(
          courseId,
          user.id
        );
        if (!canceled && isEnrolled) navigate(`/course-progress/${courseId}`);
      } catch (e) {
        console.log(e);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [courseId, user, navigate]);

  const { data: studentViewCourseDetails, isLoading } =
    useStudentCourseDetailsService(courseId || "");

  const handleFreePreviewDialog = (videoUrl: string, isFree: boolean) => {
    if (isFree) {
      setFreePreviewLectureVideoUrl(videoUrl);
      setShowFreePreviewDialog(true);
    }
    // Optional: Add an else block to show a toast like "Buy the course to watch this"
  };

  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (isLoading) return <Loader height="h-screen" />;
  if (!studentViewCourseDetails)
    return <div className="p-10">No Course Found</div>;

  return (
    <div className="container mx-auto p-4 md:p-10">
      {/* --- Header Section --- */}
      <div className="bg-gray-900 rounded-lg p-6 md:p-10 mb-8 text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          {studentViewCourseDetails?.title}
        </h1>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-4 text-sm md:text-base">
          <p className="opacity-90">
            Created By:{" "}
            <span className="font-semibold">
              {studentViewCourseDetails?.instructorName}
            </span>
          </p>
          <p className="flex items-center gap-2 opacity-90">
            <Globe className="w-4 h-4" />
            {capitalize(studentViewCourseDetails?.primaryLanguage)}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-medium opacity-80">
          <p>
            Category:{" "}
            <span className="text-white ml-1">
              {studentViewCourseDetails?.category}
            </span>
          </p>
          <p>
            Level:{" "}
            <span className="text-white ml-1">
              {capitalize(studentViewCourseDetails?.level)}
            </span>
          </p>
        </div>
      </div>

      {/* --- Main Content Layout --- */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Details & Curriculum */}
        <div className="flex-1 space-y-6">
          {/* Objectives */}
          <Card>
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentViewCourseDetails?.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              {studentViewCourseDetails?.description}
            </CardContent>
          </Card>

          {/* Curriculum */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentViewCourseDetails?.curriculum.map((lecture, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      lecture.isFreePreview
                        ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        : "opacity-75"
                    }`}
                    onClick={() =>
                      handleFreePreviewDialog(
                        lecture.videoUrl,
                        lecture.isFreePreview
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-sm md:text-base line-clamp-1">
                        {index + 1}. {lecture.title}
                      </span>
                    </div>

                    {lecture.isFreePreview ? (
                      <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                        <PlayCircle className="w-4 h-4" />
                        <span>Preview</span>
                      </div>
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sticky Sidebar for Purchase */}
        <aside className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-6 space-y-6">
            <Card className="overflow-hidden shadow-lg">
              <div className="aspect-video relative flex items-center justify-center">
                <Player
                  url={
                    studentViewCourseDetails?.curriculum?.[0]?.videoUrl || ""
                  }
                />
              </div>
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-4">
                  ${studentViewCourseDetails?.pricing}
                </div>
                <div className="w-full">
                  <PaypalPayment
                    user={user}
                    course={studentViewCourseDetails}
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  30-Day Money-Back Guarantee
                </p>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>

      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={setShowFreePreviewDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
            <DialogDescription>
              Watch a free preview of this course
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center aspect-video w-full">
            <Player url={freePreviewLectureVideoUrl} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CourseDetails;
