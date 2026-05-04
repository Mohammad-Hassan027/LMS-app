import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import StudentCourses from '../../models/StudentCourses.js';
import { validateId } from './../../utils/validateId.js';
import { getAuth } from '@clerk/express';

export const getStudentCourses = asyncHandler(async (req, res) => {
  const { userId: authUserId } = getAuth(req);
  const { userId: paramUserId } = req.params;

  validateId(paramUserId, 'Student ID');

  if (authUserId !== paramUserId) {
    throw new ApiError(403, 'You are not authorized to view these courses.');
  }

  const StudentCourse = await StudentCourses.findOne({ userId: paramUserId });

  // if (!StudentCourse) {
  //   throw new ApiError(404, 'No Course Found.');
  // }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        StudentCourse,
        'Student Courses fetched successfully'
      )
    );
});
