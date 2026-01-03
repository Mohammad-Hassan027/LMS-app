import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  capturePaymentAndFinalizeOrderService,
  createOrderService,
  getAllStudentViewCoursesService,
  getStudentViewCourseDetailsService,
  getMyCoursesService,
  getStudentCourseProgressService,
  resetCurrentCourseProgressService,
  markCurrentLectureAsViewedService,
} from ".";
import type { FilterState } from "../components/student-view/courses/CoursesSidebar";

export const STUDENT_COURSE_KEYS = {
  all: (sort?: string, filters?: FilterState) =>
    ["studentCourses", sort, filters] as const,
  details: (id: string) => ["studentCourseDetails", id] as const,
  myCourse: (userId?: string) => ["my-courses", userId],
  progress: (courseId: string, userId: string) =>
    ["course-progress", courseId, userId] as const,
};

export function useStudentAllCoursesService(
  sort?: string,
  filters?: FilterState
) {
  return useQuery({
    queryKey: STUDENT_COURSE_KEYS.all(sort, filters),
    queryFn: () => getAllStudentViewCoursesService(sort, filters),
    staleTime: 1000 * 60 * 1,
  });
}

export function useStudentViewCourseDetailsService(courseId: string) {
  return useQuery({
    queryKey: STUDENT_COURSE_KEYS.details(courseId),
    queryFn: () => getStudentViewCourseDetailsService(courseId),
    enabled: !!courseId && courseId !== "",
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateOrderService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    }: {
      userId: string;
      userName: string;
      userEmail: string;
      orderStatus: string;
      paymentMethod: string;
      paymentStatus: string;
      orderDate: Date;
      instructorId: string;
      instructorName: string;
      courseImage: string;
      courseTitle: string;
      courseId: string;
      coursePricing: string;
    }) =>
      createOrderService(
        userId,
        userName,
        userEmail,
        orderStatus,
        paymentMethod,
        paymentStatus,
        orderDate,
        instructorId,
        instructorName,
        courseImage,
        courseTitle,
        courseId,
        coursePricing
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STUDENT_COURSE_KEYS.myCourse(),
      });
    },
  });
}

export function useCapturePaymentAndFinalizeOrderService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId }: { paymentId: string }) =>
      capturePaymentAndFinalizeOrderService(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STUDENT_COURSE_KEYS.myCourse(),
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
  userId: string
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
  userId: string
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
  userId: string
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
