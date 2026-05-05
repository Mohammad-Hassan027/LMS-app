import { useNavigate } from "react-router-dom";
import { courseCategories } from "@/config";
import {
  GraduationCap,
  PlayCircle,
  Users,
  ArrowRight,
  CheckCircle2,
  Globe2,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense, lazy } from "react";
const Footer = lazy(() => import("@/components/student-view/Footer"));
const BackgroundRippleEffect = lazy(() =>
  import("@/components/GridBackground").then((m) => ({
    default: m.BackgroundRippleEffect,
  })),
);
import FeaturedCoursesSection from "@/components/student-view/home/FeaturedCoursesSection";
import { CourseSkeletonCard } from "@/components/student-view/home/CourseSkeletonCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

function HomePage() {
  const navigate = useNavigate();
  const skeletonArray = new Array(4).fill(null);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <section className="relative w-full border-b border-gray-100">
        <Suspense fallback={null}>
          <BackgroundRippleEffect
          rows={isMobile ? 5 : 10}
          cols={isMobile ? 8 : 50}
          cellSize={isMobile ? 45 : 52}
          />
        </Suspense>
        <div className="min-h-[85vh] md:min-h-200 py-20">
          <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
            <div className="mb-8 animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold text-sm shadow-sm hover:bg-primary/15 transition-colors cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="tracking-wide uppercase text-xs">
                  Over 500+ New Courses
                </span>
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mb-6 leading-tight">
              Master new skills with{" "}
              <span className="text-primary relative whitespace-nowrap inline-block">
                PathOS
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-primary/30 -z-10"
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

            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl mb-10 leading-relaxed">
              The premier Learning Management System connecting ambitious
              students with world-class instructors. Track your progress, earn
              certificates, and accelerate your career.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6 shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-200"
                onClick={() => navigate("/courses")}
              >
                Get Started Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 hover:text-primary transition-all duration-200"
                onClick={() => navigate("/courses")}
              >
                Explore Categories
              </Button>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200/60 w-full max-w-4xl mx-auto">
              <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">
                Trusted by learners from
              </p>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-gray-400 grayscale opacity-70">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-5 h-5" /> Global Univ
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" /> Top Companies
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Certified Orgs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-foreground/10">
            <div className="space-y-2">
              <h3 className="text-5xl font-extrabold tracking-tighter">10k+</h3>
              <p className="text-primary-foreground/80 text-sm font-semibold uppercase tracking-widest">
                Active Students
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl font-extrabold tracking-tighter">500+</h3>
              <p className="text-primary-foreground/80 text-sm font-semibold uppercase tracking-widest">
                Courses Added
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl font-extrabold tracking-tighter">150+</h3>
              <p className="text-primary-foreground/80 text-sm font-semibold uppercase tracking-widest">
                Expert Instructors
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl font-extrabold tracking-tighter">4.9</h3>
              <p className="text-primary-foreground/80 text-sm font-semibold uppercase tracking-widest">
                Average Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                Explore Top Categories
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Discover your passion and find the perfect path for your career
                growth.
              </p>
            </div>
            <Button
              variant="ghost"
              className="group text-primary font-bold text-md hidden md:inline-flex items-center gap-2 hover:bg-primary/5"
              onClick={() => navigate("/courses")}
            >
              View All Categories
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            {courseCategories.map((category) => (
              <Button
                key={`category-${category.id}`}
                variant="outline"
                className="rounded-full px-8 py-6 text-md font-medium border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
                onClick={() => navigate(`/courses?category=${category.id}`)}
              >
                {category.label}
              </Button>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate("/courses")}
            >
              View All Categories
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-y border-gray-200">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Why learn with PathOS?
            </h2>
            <p className="text-lg text-muted-foreground">
              We provide a supportive, feature-rich environment designed to help
              you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <PlayCircle className="h-8 w-8" />,
                title: "Self-Paced Learning",
                desc: "Start and stop whenever you want. You have lifetime access to your courses and all future updates.",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Community Driven",
                desc: "Join a global community of learners. Share ideas, collaborate on projects, and get peer feedback.",
              },
              {
                icon: <GraduationCap className="h-8 w-8" />,
                title: "Certified Completion",
                desc: "Earn a verified certificate for every course you finish to showcase on your CV and LinkedIn profile.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl rotate-3 group-hover:rotate-6 transition-transform flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="py-24 bg-white">
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
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="rounded-3xl bg-primary p-10 md:p-16 text-center md:text-left flex flex-col justify-center shadow-2xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-white/20"></div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white relative z-10">
                Ready to start learning?
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-md text-lg relative z-10 leading-relaxed">
                Get unlimited access to thousands of courses from expert
                instructors and take your career to the next level.
              </p>
              <div className="relative z-10">
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-8 py-6 text-lg font-bold text-primary hover:scale-105 transition-transform"
                  onClick={() => navigate("/courses")}
                >
                  Explore Courses
                </Button>
              </div>
            </div>

            <div className="rounded-3xl bg-gray-50 p-10 md:p-16 text-center md:text-left border border-gray-200 flex flex-col justify-center shadow-sm hover:shadow-lg transition-shadow">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Become an Instructor
              </h2>
              <p className="text-gray-600 mb-8 max-w-md text-lg leading-relaxed">
                Share your knowledge with millions of students and earn money
                doing what you love. Join our instructor network today.
              </p>
              <div>
                <Button
                  className="px-8 py-6 text-lg bg-gray-900 hover:bg-black text-white hover:scale-105 transition-transform"
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

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default HomePage;
