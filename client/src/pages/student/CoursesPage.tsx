import CoursesSidebar from "../../components/student-view/courses/CoursesSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { useStudentAllCourses } from "../../service/studentQueries";

export default function CoursesPage() {
  const { data: studentViewCoursesList, isLoading } = useStudentAllCourses();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex min-h-screen w-full">
      <SidebarProvider>
        <CoursesSidebar />
        <SidebarInset className="flex flex-col">
          <header className="flex h-14 items-center gap-2 border-b px-4 lg:h-[60px]">
            <SidebarTrigger />
            <span className="font-semibold">Course Catalog</span>
          </header>
          <main className="flex-1 p-4">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
              {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                studentViewCoursesList.map((course) => (
                  <div key={`course-id-${course._id}`}>
                    <picture>
                      <img
                        width={300}
                        height={150}
                        src={course.image}
                        alt={`course-image`}
                        className="w-full h-40 object-cover"
                      />
                    </picture>
                    <div className="p-4">
                      <h3 className="text-lg font-medium mt-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600">{course.description}</p>
                      <p className="text-gray-800 font-semibold mt-1">
                        ${course.pricing}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Courses Found.</h1>
              )}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
