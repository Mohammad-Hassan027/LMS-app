import Course from '../../models/Course.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getStudentViewAllCourses = asyncHandler(async (req, res) => {
  const coursesList = await Course.find({});

  if (coursesList.length === 0) {
    throw new ApiError(404, 'No courses found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, coursesList, 'Courses fetched successfully'));
});

export const getStudentViewCourseDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const courseDetails = await Course.findById(id);

  if (!courseDetails) {
    throw new ApiError(404, 'Course not found!');
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, courseDetails, 'Course details fetched successfully')
    );
});
