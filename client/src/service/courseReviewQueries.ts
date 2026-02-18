import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getCourseReviewService, submitCourseReviewService } from ".";

export const COURSE_REVIEW_KEYS = {
  all: ["courseReviews"] as const,
  details: (id: string) => ["courseReviewDetails", { reviewId: id }] as const,
};

export function useCourseReviewsService(courseId: string) {
  return useSuspenseQuery({
    queryKey: [...COURSE_REVIEW_KEYS.all, courseId],
    queryFn: () => {
      return getCourseReviewService(courseId);
    },
    // The parent component must ensure courseId exists.
  });
}

export function useCreateCourseReviewsService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: {
      courseId: string;
      userId: string;
      rating: number;
      reviewText: string;
    }) => {
      submitCourseReviewService(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_REVIEW_KEYS.all });
    },
  });
}
