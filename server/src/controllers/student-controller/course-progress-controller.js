import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import CourseProgress from '../../models/CourseProgress.js';
import StudentCourses from '../../models/StudentCourses.js';
import Course from '../../models/Course.js';
import { validateId } from '../../utils/validateId.js';
import { getAuth } from '@clerk/express';

export const getStudentCourseProgress = asyncHandler(async (req, res) => {
  const { userId: authUserId } = getAuth(req);
  const { courseId, userId } = req.params;

  validateId(courseId, 'Course ID');
  validateId(userId, 'User ID');

  if (authUserId !== userId) {
    throw new ApiError(403, 'You are not authorized to view these courses.');
  }

  const studentPurchasedCourses = await StudentCourses.findOne({
    userId: userId,
  });

  const isCurrentCoursePurchasedByCurrentUserOrNot =
    studentPurchasedCourses?.courses?.findIndex(
      (item) => item.courseId === courseId
    ) > -1;

  if (!isCurrentCoursePurchasedByCurrentUserOrNot) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isPurchased: false,
        },
        'You need to purchase this course to access it.'
      )
    );
  }

  const currentUserCourseProgress = await CourseProgress.findOne({
    userId,
    courseId,
  });

  if (
    !currentUserCourseProgress ||
    currentUserCourseProgress?.lecturesProgress?.length === 0
  ) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
        'No progress found, you can start watching the course'
      )
    );
  }

  const courseDetails = await Course.findById(courseId);

  res.status(200).json(
    new ApiResponse(200, {
      courseDetails,
      progress: currentUserCourseProgress.lecturesProgress,
      completed: currentUserCourseProgress.completed,
      completionDate: currentUserCourseProgress.completionDate,
      isPurchased: true,
    })
  );
});

export const markCurrentLectureAsViewed = asyncHandler(async (req, res) => {
  const { userId: authUserId } = getAuth(req);
  const { courseId, userId, lectureId } = req.body;

  validateId(courseId, 'Course ID');
  validateId(userId, 'User ID');
  validateId(lectureId, 'Lecture ID');

  if (authUserId !== userId) {
    throw new ApiError(403, 'You are not authorized to view these courses.');
  }

  let courseProgress = await CourseProgress.findOne({ courseId, userId });

  if (!courseProgress) {
    courseProgress = new CourseProgress({
      userId,
      courseId,
      lecturesProgress: [
        {
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        },
      ],
    });
    await courseProgress.save();
  } else {
    const lectureProgress = courseProgress.lecturesProgress.find(
      (item) => item.lectureId === lectureId
    );

    if (lectureProgress) {
      lectureProgress.viewed = true;
      lectureProgress.dateViewed = new Date();
    } else {
      courseProgress.lecturesProgress.push({
        lectureId,
        viewed: true,
        dateViewed: new Date(),
      });
    }
    await courseProgress.save();
  }

  const course = await Course.findById(courseId);

  if (!course) {
    res.status(404).json(new ApiError(404, 'Course not found'));
  }

  if (
    course.curriculum.length === courseProgress.lecturesProgress.length &&
    courseProgress.lecturesProgress.every((lec) => lec.viewed)
  ) {
    courseProgress.completed = true;
    courseProgress.completionDate = new Date();
    await courseProgress.save();
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        courseProgress,
        'Lecture marked as viewed successfully'
      )
    );
});

export const resetCurrentCourseProgress = asyncHandler(async (req, res) => {
  const { userId: authUserId } = getAuth(req);
  const { userId, courseId } = req.body;

  validateId(userId, 'User ID');
  validateId(courseId, 'Course ID');

  if (authUserId !== userId) {
    throw new ApiError(403, 'You are not authorized to view these courses.');
  }

  const progress = await CourseProgress.findOne({
    userId: { $eq: userId },
    courseId: { $eq: courseId },
  });

  if (!progress) {
    throw new ApiError(404, 'Course progress not found');
  }

  progress.lecturesProgress = [];
  progress.completed = false;
  progress.completionDate = null;

  await progress.save();

  res
    .status(200)
    .json(new ApiResponse(200, progress, 'Course progress has been reset'));
});
