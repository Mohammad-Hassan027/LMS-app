import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCoursesOfInstructor,
  getCourseDetailsForInstructor,
  updateCourse,
  deleteCourse,
  addNewCourse,
} from "./index";
import type { Course } from "../types/types";

export const COURSE_KEYS = {
  all: ["instructorCourses"] as const,
  details: (id: string) =>
    ["instructorCourseDetails", { courseId: id }] as const,
};

export function useAddNewCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: Omit<Course, "_id">) => addNewCourse(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.all });
    },
  });
}

export function useInstructorCourses(instructorId: string) {
  return useQuery({
    queryKey: [...COURSE_KEYS.all, instructorId],
    queryFn: () => getAllCoursesOfInstructor(instructorId),
    enabled: !!instructorId,
  });
}

export function useCourseDetailsForInstructor(courseId: string) {
  return useQuery({
    queryKey: COURSE_KEYS.details(courseId),
    queryFn: () => getCourseDetailsForInstructor(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      formData: Omit<
        Course,
        "_id" | "instructorId" | "instructorName" | "students"
      >
    ) => updateCourse(formData, courseId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSE_KEYS.details(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: COURSE_KEYS.all,
      });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,

    // 'variables' here IS the 'id' you passed to mutate(id)
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.all });

      // 2. Clear the cache for the deleted course's details so it doesn't linger
      queryClient.removeQueries({
        queryKey: COURSE_KEYS.details(variables),
      });
    },
  });
}
