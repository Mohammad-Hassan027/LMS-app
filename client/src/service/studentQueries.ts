import { useQuery } from "@tanstack/react-query";
import { getAllCourses, getCourseDetails } from ".";
import type { FilterState } from "../components/student-view/courses/CoursesSidebar";

export const STUDENT_COURSE_KEYS = {
  all: (sort?: string, filters?: FilterState) =>
    ["studentCourses", sort, filters] as const,
  details: (id: string) => ["studentCourseDetails", id] as const,
};

export function useStudentAllCourses(sort?: string, filters?: FilterState) {
  return useQuery({
    queryKey: STUDENT_COURSE_KEYS.all(sort, filters),
    queryFn: () => getAllCourses(sort, filters),
    staleTime: 1000 * 60 * 1,
  });
}

export function useStudentCourseDetails(courseId: string) {
  return useQuery({
    queryKey: STUDENT_COURSE_KEYS.details(courseId),
    queryFn: () => getCourseDetails(courseId),
    enabled: !!courseId && courseId !== "",
    staleTime: 1000 * 60 * 5,
  });
}
