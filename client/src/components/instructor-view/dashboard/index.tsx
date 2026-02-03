import { Button } from "@/components/ui/button";
import SectionCards from "./SectionCards";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInstructorContext } from "@/contexts/Instructor/hook";
import { useInstructorCoursesService } from "@/service/instructorQueries";
import { useProtectedUser } from "@/hooks/useProtectedUser";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { useNavigate } from "react-router-dom";

function InstructorDashboard() {
  const navigate = useNavigate();
  const user = useProtectedUser();
  const { data: listOfCourses } = useInstructorCoursesService(user.id);

  const {
    setActiveTab,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
    setCurrentEditedCourseId,
  } = useInstructorContext();

  const topPerforming = listOfCourses
    ? listOfCourses
        .filter((course) => Number(course.pricing) > 0)
        .sort(
          (a, b) =>
            b.students.length * Number(b.pricing) -
            a.students.length * Number(a.pricing),
        )
        .slice(0, 5)
    : [];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4 sm:gap-6">
        {/* Header Section - Mobile Stacked */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Overview of your performance and course activity.
            </p>
          </div>
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </div>

        {/* Section Cards Container */}
        <div className="flex flex-col gap-4">
          <SectionCards />
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 px-4 sm:px-0">
          {/* Revenue Chart */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-4 border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-0 sm:pl-2">
              <div className="h-50 sm:h-75 w-full flex items-end justify-between gap-1 sm:gap-2 px-2 sm:px-4">
                {/* Mock Bars */}
                {[35, 60, 45, 70, 50, 80, 65, 85, 90, 60, 75, 95].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="group relative w-full h-full flex items-end"
                    >
                      <div
                        className="w-full bg-primary/10 group-hover:bg-primary/80 transition-all duration-300 rounded-t-sm sm:rounded-t-md relative"
                        style={{ height: `${height}%` }}
                      >
                        {/* Tooltip on Hover */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] sm:text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          ${height * 100}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
              {/* X-Axis Labels */}
              <div className="flex justify-between px-2 sm:px-4 mt-4 text-[10px] sm:text-xs text-muted-foreground uppercase font-medium">
                <span>J</span>
                <span>F</span>
                <span>M</span>
                <span>A</span>
                <span>M</span>
                <span>J</span>
                <span>J</span>
                <span>A</span>
                <span>S</span>
                <span>O</span>
                <span>N</span>
                <span>D</span>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Courses */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-3 border-gray-100 shadow-sm flex flex-col">
            <CardHeader>
              <CardTitle>Top Performing Courses</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-6 flex-1">
                {topPerforming.length > 0 ? (
                  topPerforming.map((course, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        {/* Truncate long titles on mobile */}
                        <p className="text-sm font-semibold leading-none text-gray-900 truncate">
                          {course.title}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {course.students.length} sales this month
                        </p>
                      </div>
                      <div className="font-bold text-gray-900 whitespace-nowrap">
                        $
                        {course.students
                          .reduce(
                            (total, s) => total + Number(s.paidAmount || 0),
                            0,
                          )
                          .toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8">
                    <p className="text-muted-foreground mb-4 text-sm">
                      No sales yet. Start selling!
                    </p>
                    <Button
                      className="p-4 sm:p-5 w-full sm:w-auto"
                      onClick={() => {
                        setCurrentEditedCourseId(null as unknown as string);
                        navigate("/instructor/add-new-course");
                        setCourseCurriculumFormData(
                          courseCurriculumInitialFormData,
                        );
                        setCourseLandingFormData(courseLandingInitialFormData);
                      }}
                    >
                      Create New Courses
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-4 border-t border-gray-50">
                <Button
                  variant="outline"
                  className="w-full"
                  size="sm"
                  onClick={() => setActiveTab("courses")}
                >
                  View All Courses <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;
