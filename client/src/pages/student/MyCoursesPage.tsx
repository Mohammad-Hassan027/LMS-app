import { useGetMyCoursesService } from "@/service/studentQueries";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { WatchIcon, PlayCircle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Suspense } from "react";
import { useProtectedUser } from "@/hooks/useProtectedUser";

function MyCoursesList({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMyCoursesService(userId);

  const courseList = data?.courses || [];

  if (isLoading) return <Loader height="h-[50vh]" />;

  if (courseList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="bg-primary/10 p-8 rounded-full">
          <BookOpen className="w-16 h-16 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            No courses enrolled yet
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You haven't enrolled in any courses yet. Explore our catalog to
            start your learning journey today.
          </p>
        </div>
        <Button onClick={() => navigate("/courses")} size="lg">
          Browse Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Learning</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseList.map((course) => (
          <Card
            key={course.courseId}
            className="group flex flex-col overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 h-full cursor-pointer"
            onClick={() => navigate(`/course-progress/${course.courseId}`)}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={course.courseImage}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <PlayCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            <CardContent className="flex-1 p-5">
              <h3 className="text-lg font-bold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Instructor:{" "}
                <span className="font-medium text-foreground">
                  {course.instructorName}
                </span>
              </p>
            </CardContent>

            <CardFooter className="p-5 pt-0">
              <Button className="w-full gap-2 group-hover:bg-primary/90">
                <WatchIcon className="w-4 h-4" />
                Start Learning
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MyCourses() {
  const user = useProtectedUser();

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<Loader height="h-screen" />}>
        <MyCoursesList userId={user.id} />
      </Suspense>
    </div>
  );
}

export default MyCourses;
