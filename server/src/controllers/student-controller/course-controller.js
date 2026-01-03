import Course from '../../models/Course.js';
import StudentCourses from '../../models/StudentCourses.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getStudentViewAllCourses = asyncHandler(async (req, res) => {
  const {
    category = [],
    level = [],
    primaryLanguage = [],
    sort: sortBy = 'price-lowtohigh',
  } = req.query;

  let filters = {};

  if (category.length) {
    // Handle both single string "react" and array ["react", "node"]
    filters.category = { $in: category.toString().split(',') };
  }
  if (level.length) {
    filters.level = { $in: level.toString().split(',') };
  }
  if (primaryLanguage.length) {
    filters.primaryLanguage = { $in: primaryLanguage.toString().split(',') };
  }

  let sortParam = {};
  switch (sortBy) {
    case 'price-lowtohigh':
      sortParam.pricing = 1;
      break;

    case 'price-hightolow':
      sortParam.pricing = -1;
      break;

    case 'title-atoz':
      sortParam.title = 1;
      break;

    case 'title-ztoa':
      sortParam.title = -1;
      break;

    default:
      sortParam.pricing = 1;
      break;
  }
  const coursesList = await Course.find(filters).sort(sortParam);

  res
    .status(200)
    .json(new ApiResponse(200, coursesList, 'Courses fetched successfully'));
});

export const getStudentViewCourseDetails = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const courseDetails = await Course.findById(courseId);

  if (!courseDetails) {
    throw new ApiError(404, 'Course not found!');
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, courseDetails, 'Course details fetched successfully')
    );
});

export const checkIsStudentEnrolled = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;

  const studentCourses = await StudentCourses.findOne({
    userId: userId,
  });

  const ifStudentAlreadyBoughtCurrentCourse =
    studentCourses.courses.findIndex((item) => item.courseId === courseId) > -1;
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        ifStudentAlreadyBoughtCurrentCourse,
        'Successfully checked is student enrolled'
      )
    );
});
