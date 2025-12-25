import { useUser } from "@clerk/clerk-react";
import { useGetMyCoursesService } from "../../service/studentQueries";
import { Card, CardContent, CardTitle } from "../../components/ui/card";
import Loader from "../../components/Loader";

function MyCourses() {
  const { user } = useUser();
  // if (!user) return;
  const { data, isLoading } = useGetMyCoursesService(user?.id || "");

  if (isLoading) return <Loader height="h-screen" />;

  const courseList = data?.courses || [];

  if (courseList.length === 0) {
    return <div className="p-10 text-center">No courses found.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {courseList?.map((course) => (
        <Card
          key={course.courseId}
          className="cursor-pointer hover:shadow-lg transition-shadow"
        >
          <CardContent className="flex gap-4">
            <picture className="w-56 h-40 shrink-0">
              <img
                width={300}
                height={150}
                src={course.courseImage}
                alt={`course-image`}
                className="object-cover"
              />
            </picture>
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
              <p className="mb-1 text-sm text-gray-600">
                Created By{" "}
                <span className="font-bold">{course.instructorName}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default MyCourses;
