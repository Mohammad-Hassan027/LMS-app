import { useNavigate } from "react-router-dom";
import { courseCategories } from "@/config";
import { GraduationCap, PlayCircle, Users, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative w-full border-b bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mb-6">
            Unlock your potential with{" "}
            <span className="text-primary relative whitespace-nowrap">
              PathOS
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-primary/20 -z-10"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl mb-10">
            A comprehensive Learning Management System connecting students with
            expert instructors. Explore courses, track your progress, and
            achieve your goals today.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-6 shadow-lg shadow-primary/20"
              onClick={() => navigate("/courses")}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-6 bg-white hover:bg-gray-50"
              onClick={() => navigate("/courses")}
            >
              Browse Categories
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-primary py-12 text-primary-foreground shadow-inner">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-foreground/20">
            <div className="space-y-1">
              <h3 className="text-4xl font-extrabold tracking-tighter">10k+</h3>
              <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wider">
                Students
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-extrabold tracking-tighter">500+</h3>
              <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wider">
                Courses
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-extrabold tracking-tighter">150+</h3>
              <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wider">
                Instructors
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-extrabold tracking-tighter">4.9</h3>
              <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wider">
                Average Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Explore Categories
              </h2>
              <p className="text-muted-foreground">
                Find the perfect path for your career.
              </p>
            </div>
            <Button
              variant="ghost"
              className="group text-primary font-semibold hidden md:inline-flex items-center gap-2"
              onClick={() => navigate("/courses")}
            >
              View All Categories
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            {courseCategories.map((category) => (
              <Button
                key={`category-${category.id}`}
                variant="outline"
                className="rounded-full px-6 py-6 text-md font-medium border-gray-200 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300"
                onClick={() => navigate(`/courses?category=${category.id}`)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Why learn with PathOS?
            </h2>
            <p className="text-lg text-muted-foreground">
              We provide a supportive environment for you to learn new skills
              and advance your career with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <PlayCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Self-Paced Learning
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Start and stop whenever you want. You have lifetime access to
                your courses and updates.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Expert Instructors
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Learn from industry experts who are passionate about teaching
                and helping you grow.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Certified Completion
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Earn a certificate for every course you finish to showcase on
                your CV and LinkedIn profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <Skeleton className="h-10 w-64 mb-10" />
              <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                {skeletonArray.map((_, index) => (
                  <CourseSkeletonCard key={index} />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <FeaturedCoursesSection />
      </Suspense>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-3xl bg-primary p-10 md:p-14 text-center md:text-left flex flex-col justify-center shadow-xl shadow-primary/20">
              <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
                Ready to start learning?
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-md text-lg">
                Get unlimited access to thousands of courses from expert
                instructors and take your career to the next level.
              </p>
              <div>
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-8 font-bold text-primary"
                  onClick={() => navigate("/courses")}
                >
                  Explore Courses
                </Button>
              </div>
            </div>

            <div className="rounded-3xl bg-gray-50 p-10 md:p-14 text-center md:text-left border border-gray-200 flex flex-col justify-center shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Become an Instructor
              </h2>
              <p className="text-gray-600 mb-8 max-w-md text-lg">
                Share your knowledge with millions of students and earn money
                doing what you love.
              </p>
              <div>
                <Button
                  className="px-8 bg-gray-900 hover:bg-black text-white"
                  size="lg"
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
