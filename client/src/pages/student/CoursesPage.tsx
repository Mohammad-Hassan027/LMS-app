import { Suspense } from "react";
import { ArrowUpDownIcon, SearchX, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryState } from "nuqs";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { sortOptions } from "@/config";
import { useStudentAllCoursesService } from "@/service/studentQueries";
import CoursesSidebar from "@/components/student-view/courses/CoursesSidebar";
import { useFilters } from "@/hooks/use-filters";
import { getOptimizedImageUrl } from "@/utils";

function CoursesContent() {
  const { filters, setFilters } = useFilters();
  const navigate = useNavigate();

  const [sort, setSort] = useQueryState("sort", {
    defaultValue: "price-lowtohigh",
  });

  const { data: studentViewCoursesList } = useStudentAllCoursesService(
    sort,
    filters,
  );

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6 shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-2">
            <SlidersHorizontal className="w-4 h-4" />
          </SidebarTrigger>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <h1 className="font-bold text-lg tracking-tight">All Courses</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline-block">
            {studentViewCoursesList?.length < 0
              ? "..."
              : studentViewCoursesList?.length || 0}{" "}
            Results
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto h-9 gap-2">
                <ArrowUpDownIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline-block">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-50">
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(value) => setSort(value)}
              >
                {sortOptions.map((sortItem) => (
                  <DropdownMenuRadioItem
                    value={sortItem.id}
                    key={sortItem.id}
                    className="cursor-pointer"
                  >
                    {sortItem.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((course, index) => (
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                key={course._id}
                onClick={() => navigate(`/course/details/${course._id}`)}
              >
                <CardContent className="flex flex-col sm:flex-row gap-4 p-4">
                  <picture className="w-56 h-40 shrink-0">
                    <img
                      width={300}
                      height={150}
                      src={getOptimizedImageUrl(course.image, 400)}
                      alt={`course-image`}
                      loading={index < 2 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {course.title}
                    </CardTitle>
                    <p className="mb-1 text-sm text-gray-600">
                      Created By{" "}
                      <span className="font-bold">{course.instructorName}</span>
                    </p>
                    <p className="text-gray-800">
                      No. of Lectures : {course.curriculum.length}
                    </p>
                    <p className="text-gray-800 font-semibold mt-1">
                      ${course.pricing}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
              <div className="bg-muted p-6 rounded-full">
                <SearchX className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold">No Courses Found</h2>
              <p className="text-muted-foreground max-w-sm">
                Try adjusting your filters or search for something else.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    category: null,
                    level: null,
                    primaryLanguage: null,
                  });
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      <SidebarProvider defaultOpen={true}>
        <CoursesSidebar />

        <SidebarInset className="flex flex-col overflow-hidden">
          <Suspense fallback={<Loader height="h-screen" />}>
            <CoursesContent />
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
