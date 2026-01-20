import { useNavigate } from "react-router-dom";
import { courseCategories } from "@/config";
import { GraduationCap, PlayCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/student-view/Footer";
import FeaturedCoursesSection from "@/components/student-view/home/FeaturedCoursesSection";
import { Suspense } from "react";
import { CourseSkeletonCard } from "@/components/student-view/home/CourseSkeletonCard";
import { Skeleton } from "@/components/ui/skeleton";

function HomePage() {
  const navigate = useNavigate();
  const skeletonArray = new Array(4).fill(null);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative w-full border-b bg-gray-50/50">
        <div className="container mx-auto px-6 py-16 md:py-24 lg:flex lg:items-center lg:justify-center lg:gap-12">
          <div className="text-center space-y-6 flex flex-col items-center justify-center lg:max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Unlock your potential with <span className="">PathOS</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
              A comprehensive Learning Management System connecting students
              with expert instructors. Explore courses, track your progress, and
              achieve your goals today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6 text-white"
                onClick={() => navigate("/courses")}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6"
                onClick={() => navigate("/courses")}
              >
                Browse Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-600 py-10 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-emerald-500/50">
            <div className="space-y-1">
              <h3 className="text-3xl font-bold">10k+</h3>
              <p className="text-blue-100 text-sm uppercase tracking-wide">
                Students
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-blue-100 text-sm uppercase tracking-wide">
                Courses
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold">150+</h3>
              <p className="text-blue-100 text-sm uppercase tracking-wide">
                Instructors
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold">4.9</h3>
              <p className="text-blue-100 text-sm uppercase tracking-wide">
                Average Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Explore Categories
            </h2>
            <Button
              variant="link"
              className="hidden md:block"
              onClick={() => navigate("/courses")}
            >
              View All Categories &rarr;
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            {courseCategories.map((category) => (
              <Button
                key={`category-${category.id}`}
                variant="outline"
                className="rounded-full px-6 py-6 text-md font-medium hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                onClick={() => navigate(`/courses?category=${category.id}`)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Why learn with PathOS?
            </h2>
            <p className="text-gray-600">
              We provide a supportive environment for you to learn new skills
              and advance your career.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <PlayCircle className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Self-Paced Learning
              </h3>
              <p className="text-gray-600">
                Start and stop whenever you want. You have lifetime access to
                your courses.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Expert Instructors
              </h3>
              <p className="text-gray-600">
                Learn from industry experts who are passionate about teaching.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-purple-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Certified Completion
              </h3>
              <p className="text-gray-600">
                Earn a certificate for every course you finish to showcase on
                your CV.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            <Skeleton className="h-8 w-48 mb-6 mx-auto" />
            {skeletonArray.map((_, index) => (
              <CourseSkeletonCard key={index} />
            ))}
          </div>
        }
      >
        <FeaturedCoursesSection />
      </Suspense>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col justify-center shadow-lg">
              <h2 className="text-3xl font-bold mb-4">
                Ready to start learning?
              </h2>
              <p className="text-gray-600 mb-8 max-w-md">
                Get unlimited access to thousands of courses from expert
                instructors.
              </p>
              <div>
                <Button
                  variant="secondary"
                  className="px-8 font-bold"
                  onClick={() => navigate("/courses")}
                >
                  Explore Courses
                </Button>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-8 md:p-12 text-center md:text-left border border-gray-200 flex flex-col justify-center shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Become an Instructor
              </h2>
              <p className="text-gray-600 mb-8 max-w-md">
                Share your knowledge with millions of students and earn money
                doing what you love.
              </p>
              <div>
                <Button
                  className="px-8"
                  onClick={() => navigate("/become-instructor")}
                >
                  Start Teaching
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
