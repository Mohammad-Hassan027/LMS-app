import { useQuery } from "@tanstack/react-query";
import { getAllCourses, getCourseDetails } from ".";

export const STUDENT_COURSE_KEYS = {
  all: ["studentCourses"] as const,
  details: (id: string) => ["studentCourseDetails", id] as const,
};

export function useStudentAllCourses() {
  return useQuery({
    queryKey: STUDENT_COURSE_KEYS.all,
    queryFn: () => getAllCourses(),
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
