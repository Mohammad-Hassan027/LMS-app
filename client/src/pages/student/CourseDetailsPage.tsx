import { lazy, Suspense, useEffect, useState } from "react";
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
  Star,
  User,
  // MessageCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  // CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PaypalPayment from "@/components/PaypalPayment";
import { useUser } from "@clerk/clerk-react";
import { checkIsStudentEnrolledService } from "@/service";
import type { UserResource } from "@clerk/shared/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useShoppingCart } from "@/contexts/student/hook";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const Player = lazy(() => import("@/components/video-player"));

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
  const [activeSection, setActiveSection] = useState("overview");

  const { addToCart } = useShoppingCart();

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

  // Smooth scroll handler
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjust for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (isEnrollmentChecking || isLoading) return <Loader height="h-screen" />;

  if (!studentViewCourseDetails)
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Course Not Found
      </div>
    );

  const handleAddToCart = () => {
    addToCart({
      _id: studentViewCourseDetails?._id,
      title: studentViewCourseDetails?.title,
      image: studentViewCourseDetails?.image,
      pricing: studentViewCourseDetails?.pricing,
      level: studentViewCourseDetails?.level,
      instructorName: studentViewCourseDetails?.instructorName,
      instructorId: studentViewCourseDetails?.instructorId,
    });
    toast.success("Added to cart");
  };

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
    { id: "instructor", label: "Instructor" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* --- HERO SECTION --- */}
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

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-gray-600">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${studentViewCourseDetails?.instructorName}`}
                  />
                  <AvatarFallback>
                    {studentViewCourseDetails?.instructorName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-white">
                  {studentViewCourseDetails?.instructorName}
                </span>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">4.8</span>
                <span className="text-gray-400 ml-1">(120 ratings)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STICKY NAVIGATION --- */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === item.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-6 mt-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-10">
            {/* 1. OVERVIEW SECTION */}
            <section id="overview" className="scroll-mt-28 space-y-6">
              <Card className="shadow-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl">What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentViewCourseDetails?.objectives
                      .split(",")
                      .map((objective, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 leading-relaxed">
                            {objective}
                          </span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Description</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm md:prose-base text-gray-600 max-w-none">
                  {studentViewCourseDetails?.description}
                </CardContent>
              </Card>
            </section>

            {/* 2. CURRICULUM SECTION */}
            <section id="curriculum" className="scroll-mt-28">
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="border-b bg-gray-50/50">
                  <CardTitle className="text-2xl flex items-center justify-between">
                    <span>Curriculum</span>
                    <span className="text-sm font-normal text-muted-foreground bg-white px-3 py-1 rounded-full border shadow-sm">
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
                          className={`flex items-center justify-between p-4 transition-colors group ${
                            lecture.isFreePreview
                              ? "cursor-pointer hover:bg-blue-50/30"
                              : "hover:bg-gray-50/50"
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
                              className={`p-2 rounded-full ${lecture.isFreePreview ? "bg-blue-100 text-blue-600 group-hover:bg-blue-200" : "bg-gray-100 text-gray-500"}`}
                            >
                              <Video className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-medium text-sm md:text-base text-gray-800 block">
                                {lecture.title}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Video Lecture
                              </span>
                            </div>
                          </div>

                          {lecture.isFreePreview ? (
                            <div className="flex items-center gap-1.5 text-xs md:text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
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
            </section>

            {/* 3. INSTRUCTOR SECTION */}
            <section id="instructor" className="scroll-mt-28">
              <Card className="shadow-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Your Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <Avatar className="h-24 w-24 border-2 border-gray-100 shadow-sm">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${studentViewCourseDetails?.instructorName}`}
                      />
                      <AvatarFallback className="text-xl">
                        {studentViewCourseDetails?.instructorName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {studentViewCourseDetails?.instructorName}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Senior Instructor & Developer
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>4.8 Rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <PlayCircle className="w-4 h-4" />
                          <span>10 Courses</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>2,500 Students</span>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        I am a passionate instructor with over 10 years of
                        experience in the industry. My goal is to help you
                        master new skills effectively and efficiently. Join me
                        in this course and take your career to the next level.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 4. REVIEWS SECTION */}
            <section id="reviews" className="scroll-mt-28 mb-10">
              <Card className="shadow-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Rating Summary */}
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl min-w-50">
                      <span className="text-5xl font-extrabold text-gray-900">
                        4.8
                      </span>
                      <div className="flex gap-1 my-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-5 h-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        Course Rating
                      </span>
                    </div>

                    {/* Placeholder Reviews List */}
                    <div className="flex-1 space-y-6">
                      {[1, 2].map((review) => (
                        <div key={review} className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>S{review}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-sm">
                                Student {review}
                              </h4>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className="w-3 h-3 text-yellow-400 fill-current"
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground ml-auto">
                              2 weeks ago
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            This course was fantastic! The explanations were
                            clear, and the projects really helped solidify my
                            understanding. Highly recommended for anyone looking
                            to learn this skill.
                          </p>
                          <Separator />
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        Load More Reviews
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* --- SIDEBAR (Pricing & Enroll) --- */}
          <aside className="w-full lg:w-95 shrink-0">
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
                        alt={studentViewCourseDetails?.title}
                        width={400}
                        height={225}
                        loading="lazy"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                      />
                      <PlayCircle className="absolute w-12 h-12 text-white opacity-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
                      <div className="absolute bottom-4 text-white font-bold text-sm tracking-wide bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                        Preview this course
                      </div>
                    </>
                  ) : (
                    <img
                      src={studentViewCourseDetails?.image}
                      alt={studentViewCourseDetails?.title}
                      loading="lazy"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <CardContent className="p-6 space-y-6">
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ${studentViewCourseDetails?.pricing}
                    </span>
                    <span className="text-lg text-gray-500 line-through mb-1.5 opacity-60 font-medium">
                      $
                      {(
                        Number(studentViewCourseDetails?.pricing) * 1.5
                      ).toFixed(0)}
                    </span>
                    <Badge
                      variant="outline"
                      className="mb-2 text-green-600 border-green-200 bg-green-50"
                    >
                      33% OFF
                    </Badge>
                  </div>

                  <div className="w-full space-y-3">
                    <Button
                      onClick={handleAddToCart}
                      className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all"
                      size="lg"
                    >
                      Add to Cart
                    </Button>
                    <div className="w-full">
                      <PaypalPayment
                        user={user}
                        courses={studentViewCourseDetails}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-center text-muted-foreground font-medium">
                      30-Day Money-Back Guarantee
                    </p>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="font-semibold text-gray-900">
                        This course includes:
                      </div>
                      <div className="flex items-center gap-3">
                        <Video className="w-4 h-4 text-blue-500" />
                        <span>Lifetime Access</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span>Access on Mobile & TV</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                        <span>Certificate of Completion</span>
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
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Course Preview</DialogTitle>
            <DialogDescription>
              Watch a free preview of this course
            </DialogDescription>
          </DialogHeader>

          <div className="aspect-video w-full">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center text-white">
                  Loading Player...
                </div>
              }
            >
              <Player
                url={freePreviewLectureVideoUrl}
                width="100%"
                height="100%"
              />
            </Suspense>
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
