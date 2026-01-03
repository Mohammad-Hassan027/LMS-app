import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import StudentCourses from '../../models/StudentCourses.js';

export const getStudentCourses = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const StudentCourse = await StudentCourses.find({ userId: userId });

  // if (StudentCourse.length) {
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
