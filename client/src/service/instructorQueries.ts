import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCoursesOfInstructorService,
  getCourseDetailsForInstructorService,
  updateCourseService,
  deleteCourseService,
  addNewCourseService,
} from "./index";
import type { Course } from "../@types/types";

export const COURSE_KEYS = {
  all: ["instructorCourses"] as const,
  details: (id: string) =>
    ["instructorCourseDetails", { courseId: id }] as const,
};

export function useAddNewCourseService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: Omit<Course, "_id">) =>
      addNewCourseService(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.all });
    },
  });
}

export function useInstructorCoursesService(instructorId: string) {
  return useQuery({
    queryKey: [...COURSE_KEYS.all, instructorId],
    queryFn: () => getAllCoursesOfInstructorService(instructorId),
    enabled: !!instructorId,
  });
}

export function useCourseDetailsForInstructorService(courseId: string) {
  return useQuery({
    queryKey: COURSE_KEYS.details(courseId),
    queryFn: () => getCourseDetailsForInstructorService(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateCourseService(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      formData: Omit<
        Course,
        "_id" | "instructorId" | "instructorName" | "students"
      >
    ) => updateCourseService(formData, courseId),

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

export function useDeleteCourseService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourseService,

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
