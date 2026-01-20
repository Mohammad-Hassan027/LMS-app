import { useStudentAllCoursesService } from "@/service/studentQueries";
import CourseCard from "./CourseCard";

function FeaturedCoursesSection() {
  const { data: studentViewCoursesList } = useStudentAllCoursesService();
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-10 text-center md:text-left">
          Featured Courses
        </h2>

        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((course) => (
              <CourseCard course={course} key={`course-id-${course._id}`} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-gray-500">
                No courses available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCoursesSection;
