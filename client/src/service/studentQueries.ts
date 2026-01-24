import {
  useMutation,
  useQuery,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  capturePaymentAndFinalizeOrderService,
  createOrderService,
  getAllStudentViewCoursesService,
  getStudentViewCourseDetailsService,
  getMyCoursesService,
  getStudentCourseProgressService,
  resetCurrentCourseProgressService,
  markCurrentLectureAsViewedService,
} from "@/service";
import type { FilterState } from "@/hooks/use-filters";

export const STUDENT_COURSE_KEYS = {
  all: (sort?: string, filters?: FilterState) =>
    ["studentCourses", sort, filters] as const,
  details: (id: string) => ["studentCourseDetails", id] as const,
  myCourse: (userId?: string) => ["my-courses", userId] as const,
  progress: (courseId: string, userId: string) =>
    ["course-progress", courseId, userId] as const,
};

export function useStudentAllCoursesService(
  sort?: string,
  filters?: FilterState,
) {
  return useSuspenseQuery({
    queryKey: STUDENT_COURSE_KEYS.all(sort, filters),
    queryFn: () => getAllStudentViewCoursesService(sort, filters),
    staleTime: 1000 * 60 * 1,
  });
}

export function useStudentViewCourseDetailsService(courseId: string) {
  return useSuspenseQuery({
    queryKey: STUDENT_COURSE_KEYS.details(courseId),
    queryFn: () => getStudentViewCourseDetailsService(courseId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateOrderService() {
  return useMutation({
    mutationFn: (data: {
      userId: string;
      userName: string;
      userEmail: string;
      orderStatus: string;
      paymentMethod: string;
      paymentStatus: string;
      orderDate: Date;
      instructorId?: string;
      instructorName?: string;
      courseImage?: string;
      courseTitle?: string;
      courseId?: string;
      coursePricing?: string;
      cartItems?: {
        id: string;
        title: string;
        image: string;
        pricing: string;
        instructorId: string;
        instructorName: string;
      }[];
    }) => createOrderService(data),
  });
}

export function useCapturePaymentAndFinalizeOrderService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId }: { paymentId: string }) =>
      capturePaymentAndFinalizeOrderService(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["studentCourseDetails"],
      });
      queryClient.invalidateQueries({
        queryKey: ["studentCourses"],
      });
    },
  });
}

export function useGetMyCoursesService(userId: string) {
  return useQuery({
    queryKey: STUDENT_COURSE_KEYS.myCourse(userId),
    queryFn: () => getMyCoursesService(userId),
    enabled: !!userId && userId !== "",
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetStudentCourseProgressService(
  courseId: string,
  userId: string,
) {
  return useQuery({
    queryKey: STUDENT_COURSE_KEYS.progress(courseId, userId),
    queryFn: () => getStudentCourseProgressService(courseId, userId),
    enabled: !!userId && userId !== "",
    staleTime: 1000 * 60 * 1,
  });
}

export function useMarkCurrentLectureAsViewedService(
  courseId: string,
  userId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lectureId: string) =>
      markCurrentLectureAsViewedService(courseId, userId, lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STUDENT_COURSE_KEYS.progress(courseId, userId),
      });
    },
  });
}

export function useResetCurrentCourseProgressService(
  courseId: string,
  userId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resetCurrentCourseProgressService(courseId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STUDENT_COURSE_KEYS.progress(courseId, userId),
      });
    },
  });
}
