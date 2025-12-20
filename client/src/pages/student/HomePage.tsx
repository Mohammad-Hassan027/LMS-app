import Loader from "../../components/Loader";
import { Button } from "../../components/ui/button";
import { courseCategories } from "../../config";
import { useStudentAllCourses } from "../../service/studentQueries";

function HomePage() {
  const { data: studentViewCoursesList, isLoading } = useStudentAllCourses();

  if (isLoading) {
    return <Loader height="h-screen" />;
  }

  return (
    <div>
      <section className="mt-10 flex flex-col md:flex-row items-center gap-10">
        <div>
          <picture className="">
            <img src="/Hero.png" alt="Hero image" height={700} width={700} />
          </picture>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">
            Welcome to the Learning Management System,
          </h1>
          <p className="ml-2 text-xl font-medium text-gray-800">
            your journey to success starts here.
          </p>
        </div>
      </section>
      <section className="mt-10 p-6 bg-gray-100">
        <h2 className="text-3xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-4">
          {courseCategories.map((category) => (
            <Button
              variant={"ghost"}
              className="border"
              key={`category-${category.id}`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="mt-10 p-6">
        <h2 className="text-3xl font-semibold mb-4">Featured Courses</h2>
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
                  <h3 className="text-lg font-medium mt-2">{course.title}</h3>
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
      </section>
    </div>
  );
}

export default HomePage;
