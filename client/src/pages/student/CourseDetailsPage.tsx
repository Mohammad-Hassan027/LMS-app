import { useNavigate, useParams } from "react-router-dom";
import { useStudentViewCourseDetailsService } from "@/service/studentQueries";
import Loader from "@/components/Loader";
import {
  CheckCircle,
  Globe,
  Lock,
  PlayCircle,
  Video,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Player from "@/components/video-player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Suspense, useEffect, useState } from "react";
import PaypalPayment from "@/components/PaypalPayment";
import { useUser } from "@clerk/clerk-react";
import { checkIsStudentEnrolledService } from "@/service";
import type { UserResource } from "@clerk/shared/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function CourseDetailsContent({
  courseId,
  user,
}: {
  courseId: string;
  user: UserResource | null | undefined;
}) {
  const navigate = useNavigate();
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [freePreviewLectureVideoUrl, setFreePreviewLectureVideoUrl] =
    useState("");
  const [isEnrollmentChecking, setIsEnrollmentChecking] = useState(true);

  const { data: studentViewCourseDetails, isLoading } =
    useStudentViewCourseDetailsService(courseId);

  useEffect(() => {
    if (!courseId) return;

    if (!user?.id) {
      setIsEnrollmentChecking(false);
      return;
    }

    let canceled = false;
    (async () => {
      try {
        const isEnrolled = await checkIsStudentEnrolledService(
          courseId,
          user.id,
        );
        if (!canceled && isEnrolled) {
          navigate(`/course-progress/${courseId}`);
        } else {
          if (!canceled) setIsEnrollmentChecking(false);
        }
      } catch (e) {
        if (!canceled) setIsEnrollmentChecking(false);
        console.error(e);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [courseId, user, navigate]);

  const handleFreePreviewDialog = (videoUrl: string, isFree: boolean) => {
    if (isFree) {
      setFreePreviewLectureVideoUrl(videoUrl);
      setShowFreePreviewDialog(true);
    }
  };

  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (isEnrollmentChecking || isLoading) return <Loader height="h-screen" />;

  if (!studentViewCourseDetails)
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Course Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-gray-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {studentViewCourseDetails?.category}
              </Badge>
              <span className="flex items-center gap-1 text-gray-300 text-sm">
                <Globe className="w-3 h-3" />
                {capitalize(studentViewCourseDetails?.primaryLanguage)}
              </span>
              <span className="text-gray-300 text-sm">•</span>
              <span className="text-gray-300 text-sm">
                {capitalize(studentViewCourseDetails?.level)} Level
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {studentViewCourseDetails?.title}
            </h1>

            <p className="text-lg text-gray-300 max-w-2xl font-light">
              {studentViewCourseDetails?.subtitle ||
                "Master this skill with our comprehensive curriculum designed by industry experts."}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-gray-400 text-sm">Created By</span>
              <span className="font-semibold text-white">
                {studentViewCourseDetails?.instructorName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">What you'll learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentViewCourseDetails?.objectives
                    .split(",")
                    .map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="text-primary w-5 h-5 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {objective}
                        </span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl flex items-center justify-between">
                  <span>Course Content</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {studentViewCourseDetails?.curriculum.length} Lectures
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {studentViewCourseDetails?.curriculum.map(
                    (lecture, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 transition-colors ${
                          lecture.isFreePreview
                            ? "cursor-pointer hover:bg-blue-50/50"
                            : "opacity-80 hover:bg-gray-50/50"
                        }`}
                        onClick={() =>
                          handleFreePreviewDialog(
                            lecture.videoUrl,
                            lecture.isFreePreview,
                          )
                        }
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-full ${lecture.isFreePreview ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}
                          >
                            <Video className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-sm md:text-base text-gray-800">
                            {lecture.title}
                          </span>
                        </div>

                        {lecture.isFreePreview ? (
                          <div className="flex items-center gap-1.5 text-xs md:text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </div>
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Description</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm md:prose-base text-gray-600 max-w-none">
                {studentViewCourseDetails?.description}
              </CardContent>
            </Card>
          </div>

          <aside className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-24 space-y-6">
              <Card className="overflow-hidden shadow-xl border-0 ring-1 ring-gray-200">
                <div
                  className="aspect-video relative bg-black flex items-center justify-center group cursor-pointer"
                  onClick={() => {
                    const preview = studentViewCourseDetails?.curriculum.find(
                      (c) => c.isFreePreview,
                    );
                    if (preview)
                      handleFreePreviewDialog(preview.videoUrl, true);
                  }}
                >
                  {studentViewCourseDetails?.curriculum.some(
                    (c) => c.isFreePreview,
                  ) ? (
                    <>
                      <img
                        src={studentViewCourseDetails.image}
                        alt="Course Preview"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                      />
                      <PlayCircle className="absolute w-8 h-8 text-white opacity-90 group-hover:scale-110 transition-transform" />
                      <div className="absolute bottom-4 text-white font-medium text-sm">
                        Preview this course
                      </div>
                    </>
                  ) : (
                    <img
                      src={studentViewCourseDetails?.image}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <CardContent className="p-6 space-y-6">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ${studentViewCourseDetails?.pricing}
                    </span>
                    <span className="text-lg text-gray-500 line-through mb-1.5 opacity-60">
                      $
                      {(
                        Number(studentViewCourseDetails?.pricing) * 1.5
                      ).toFixed(0)}
                    </span>
                  </div>

                  <div className="w-full">
                    <PaypalPayment
                      user={user}
                      course={studentViewCourseDetails}
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-center text-muted-foreground">
                      30-Day Money-Back Guarantee
                    </p>
                    <Separator />
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Includes:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" /> Lifetime Access
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Certificate of
                        Completion
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
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

          <div className="flex items-center justify-center w-full">
            <Player url={freePreviewLectureVideoUrl} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CourseDetails() {
  const { courseId } = useParams();
  const { user } = useUser();

  if (!courseId) return <div>Invalid Course ID</div>;

  return (
    <Suspense fallback={<Loader height="h-screen" />}>
      <CourseDetailsContent courseId={courseId} user={user} />
    </Suspense>
  );
}

export default CourseDetails;
