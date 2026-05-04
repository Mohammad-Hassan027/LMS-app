import { getAuth, clerkClient } from '@clerk/express';
import Review from '../../models/Review.js';
import Course from '../../models/Course.js';
import StudentCourses from '../../models/StudentCourses.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { validateId } from '../../utils/validateId.js';

export const createReview = asyncHandler(async (req, res) => {
  const { courseId, reviewText, rating } = req.body;
  const { userId } = getAuth(req);

  if (!userId) {
    throw new ApiError(401, 'Not authenticated');
  }

  validateId(courseId, 'Course ID');

  // Validation: Check if the student is actually enrolled in this course
  const studentCourses = await StudentCourses.findOne({ userId });
  const isEnrolled = (studentCourses?.courses ?? []).some(
    (course: any) => course.courseId === courseId
  );

  if (!isEnrolled) {
    throw new ApiError(
      403,
      'You must purchase this course before reviewing it.'
    );
  }

  // Prevention: Check if the user has already reviewed this course
  const existingReview = await Review.findOne({
    courseId: { $eq: courseId },
    studentId: userId,
  });
  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this course.');
  }

  const user = await clerkClient.users.getUser(userId);
  const studentName =
    user.fullName || `${user.firstName} ${user.lastName}`.trim() || 'Student';

  const review = await Review.create({
    courseId,
    studentId: userId,
    studentName,
    rating: Number(rating),
    reviewText,
  });

  // Recalculate and update the Course's average rating
  const allReviews = await Review.find({ courseId: { $eq: courseId } });
  const totalReviews = allReviews.length;

  const averageRating =
    totalReviews > 0
      ? allReviews.reduce((sum: any, r: any) => sum + r.rating, 0) /
        totalReviews
      : 0;

  // Update the parent course document
  await Course.findByIdAndUpdate(courseId, {
    totalReviews,
    averageRating: Number(averageRating.toFixed(1)),
  });

  res
    .status(201)
    .json(new ApiResponse(201, review, 'Review added successfully'));
});

export const getCourseReviews = asyncHandler(async (req, res) => {
  const courseId = validateId(req.params.courseId, 'Course ID');

  const reviews = await Review.find({ courseId }).sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, reviews, 'Reviews fetched successfully'));
});
