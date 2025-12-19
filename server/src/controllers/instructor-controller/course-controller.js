import Course from '../../models/Course.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';


export const getAllCourses = asyncHandler(async (req, res) => {
  const coursesList = await Course.find({});

  if (!coursesList) {
    throw new ApiError(404, 'No courses found');
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, coursesList, 'All courses fetched successfully')
    );
});

export const getCourseDetailsById = asyncHandler(async (req, res) => {
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

export const getAllCoursesByInstructorId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const coursesByInstructorId = await Course.find({ instructorId: id });

  if (!coursesByInstructorId || coursesByInstructorId.length === 0) {
    throw new ApiError(404, 'No courses available for this instructor');
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, coursesByInstructorId, 'Instructor courses fetched')
    );
});

export const addNewCourse = asyncHandler(async (req, res) => {
  const courseData = req.body;

  const newlyCreatedCourse = new Course(courseData);
  const saveCourse = await newlyCreatedCourse.save();

  if (!saveCourse) {
    throw new ApiError(500, 'Failed to save course');
  }

  res
    .status(201)
    .json(new ApiResponse(201, saveCourse, 'Course saved successfully'));
});

export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedCourseData = req.body;

  const updatedCourse = await Course.findByIdAndUpdate(id, updatedCourseData, {
    new: true,
  });

  if (!updatedCourse) {
    throw new ApiError(404, 'Course not found!');
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedCourse, 'Course updated successfully'));
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const courseDetails = await Course.findById(id);

  if (!courseDetails) {
    throw new ApiError(404, 'Course not found!');
  }

  await Course.deleteOne({ _id: id });

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Course deleted successfully!'));
});