import { Suspense } from "react";
import { ArrowUpDownIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  // parseAsArrayOf,
  // parseAsString,
  useQueryState,
  // useQueryStates,
} from "nuqs";

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

function CoursesContent() {
  const { filters } = useFilters();
  const navigate = useNavigate();

  const [sort, setSort] = useQueryState("sort", {
    defaultValue: "price-lowtohigh",
  });

  const { data: studentViewCoursesList } = useStudentAllCoursesService(
    sort,
    filters
  );

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between h-14 items-center border-b px-0 sm:px-2 lg:h-[60px] shrink-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <SidebarTrigger />
          <span className="font-semibold tracking-tight sm:tracking-normal">
            Course Catalog
          </span>
        </div>
        <div className="mr-4 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-1" variant={"outline"}>
                <ArrowUpDownIcon className="h-1 w-1 sm:h-4 sm:w-4" />
                <span className="hidden sm:flex">Sort By</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(value) => setSort(value)}
              >
                {sortOptions.map((sortItem) => (
                  <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                    {sortItem.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-sm font-semibold text-gray-900 tracking-tight sm:tracking-normal">
            {studentViewCoursesList?.length || 0} Results
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((course) => (
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                key={`course-id-${course._id}`}
                onClick={() => navigate(`/course/details/${course._id}`)}
              >
                <CardContent className="flex flex-col sm:flex-row gap-4 p-4">
                  <picture className="w-56 h-40 shrink-0">
                    <img
                      width={300}
                      height={150}
                      src={course.image}
                      alt={`course-image`}
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
            <h1 className="text-lg font-medium">No Courses Found.</h1>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen w-full">
      <SidebarProvider defaultOpen={true}>
        <CoursesSidebar />

        <SidebarInset className="flex flex-col">
          <Suspense fallback={<Loader height="h-screen" />}>
            <CoursesContent />
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
