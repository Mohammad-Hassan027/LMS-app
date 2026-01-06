import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  getAllCoursesOfInstructorService,
  getCourseDetailsForInstructorService,
  updateCourseService,
  deleteCourseService,
  addNewCourseService,
} from "@/service";
import type { CreateCourse, UpdateCourse } from "@/@types/types";

export const COURSE_KEYS = {
  all: ["instructorCourses"] as const,
  details: (id: string) =>
    ["instructorCourseDetails", { courseId: id }] as const,
};

export function useAddNewCourseService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: CreateCourse) => addNewCourseService(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.all });
    },
  });
}

export function useInstructorCoursesService(instructorId: string) {
  return useSuspenseQuery({
    queryKey: [...COURSE_KEYS.all, instructorId],
    queryFn: () => getAllCoursesOfInstructorService(instructorId),
    // Removed 'enabled'. The parent component must ensure instructorId exists.
  });
}

export function useCourseDetailsForInstructorService(courseId: string) {
  return useSuspenseQuery({
    queryKey: COURSE_KEYS.details(courseId),
    queryFn: () => getCourseDetailsForInstructorService(courseId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateCourseService(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: UpdateCourse) =>
      updateCourseService(formData, courseId),

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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.all });
      queryClient.removeQueries({
        queryKey: COURSE_KEYS.details(variables),
      });
    },
  });
}
