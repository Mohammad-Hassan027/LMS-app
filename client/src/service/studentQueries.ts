import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  capturePaymentAndFinalizeOrderService,
  createOrderService,
  getAllCoursesService,
  getCourseDetailsService,
  getMyCoursesService,
} from ".";
import type { FilterState } from "../components/student-view/courses/CoursesSidebar";

export const STUDENT_COURSE_KEYS = {
  all: (sort?: string, filters?: FilterState) =>
    ["studentCourses", sort, filters] as const,
  details: (id: string) => ["studentCourseDetails", id] as const,
};

export function useStudentAllCoursesService(sort?: string, filters?: FilterState) {
  return useQuery({
    queryKey: STUDENT_COURSE_KEYS.all(sort, filters),
    queryFn: () => getAllCoursesService(sort, filters),
    staleTime: 1000 * 60 * 1,
  });
}

export function useStudentCourseDetailsService(courseId: string) {
  return useQuery({
    queryKey: STUDENT_COURSE_KEYS.details(courseId),
    queryFn: () => getCourseDetailsService(courseId),
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
        queryKey: [],
      });
      queryClient.invalidateQueries({
        queryKey: [],
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
        queryKey: [],
      });
      queryClient.invalidateQueries({
        queryKey: [],
      });
    },
  });
}

export function useGetMyCoursesService(studentId: string) {
  return useQuery({
    queryKey: [studentId],
    queryFn: () => getMyCoursesService(studentId),
    enabled: !!studentId && studentId !== "",
    staleTime: 1000 * 60 * 5,
  });
}
