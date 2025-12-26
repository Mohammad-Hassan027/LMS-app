import type { FilterState } from "../components/student-view/courses/CoursesSidebar";
import type {
  ApiResponse,
  MediaData,
  Course,
  StudentCourses,
  // CourseProgress,
} from "../types/types";
import axiosInstance from "./apiInstance";
import type { AxiosProgressEvent } from "axios";

// export async function ProtectedService() {
//   try {
//     const { data: response } = await axiosInstance.get<ApiResponse<any>>(
//       `/protected`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("ProtectedService Error:", error);
//   }
// }

// ==========================================
// Media SERVICES
// ==========================================

export async function UploadMediaService(
  formData: FormData,
  cb: (percent: number) => void
): Promise<MediaData | undefined> {
  try {
    const { data: response } = await axiosInstance.post<ApiResponse<MediaData>>(
      `/media/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress(progressEvent: AxiosProgressEvent) {
          const total = progressEvent.total || 1;
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / total
          );
          cb(percentCompleted);
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("UploadMediaService Error:", error);
    throw error;
  }
}

export async function UploadBulkMediaService(
  formData: FormData,
  cb: (percent: number) => void
): Promise<MediaData[] | undefined> {
  try {
    const { data: response } = await axiosInstance.post<
      ApiResponse<MediaData[]>
    >(`/media/bulk-upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress(progressEvent: AxiosProgressEvent) {
        const total = progressEvent.total || 1;
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / total
        );
        cb(percentCompleted);
      },
    });
    return response.data;
  } catch (error) {
    console.error("UploadBulkMediaService Error:", error);
    throw error;
  }
}

export async function DeleteMediaService(
  id: string,
  type: string
): Promise<MediaData | undefined> {
  let resourceType = "image";

  if (type.includes("video")) {
    resourceType = "video";
  } else if (type === "raw" || type === "application/pdf") {
    resourceType = "raw";
  }
  const encodedId = encodeURIComponent(id);

  try {
    const { data: response } = await axiosInstance.delete<
      ApiResponse<MediaData>
    >(`/media/delete/${encodedId}?type=${resourceType}`);

    return response.data;
  } catch (error) {
    console.error("DeleteMediaService Error:", error);
    throw error;
  }
}

// ==========================================
// INSTRUCTOR COURSE SERVICES
// ==========================================

export async function addNewCourseService(
  formData: Omit<Course, "_id">
): Promise<Course | undefined> {
  try {
    const { data: response } = await axiosInstance.post<ApiResponse<Course>>(
      `/instructor/course/add`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("addNewCourse Error:", error);
    throw error;
  }
}

export async function updateCourseService(
  formData: Omit<
    Course,
    "_id" | "instructorId" | "instructorName" | "students"
  >,
  id: string
): Promise<Course | undefined> {
  try {
    const { data: response } = await axiosInstance.put<ApiResponse<Course>>(
      `/instructor/course/update/${id}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("updateCourse Error:", error);
    throw error;
  }
}

export async function getCourseDetailsForInstructorService(
  id: string
): Promise<Course | undefined> {
  try {
    const { data: response } = await axiosInstance.get<ApiResponse<Course>>(
      `/instructor/course/get/details/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("getCourseDetailsForInstructor Error:", error);
    throw error;
  }
}

export async function getAllCoursesOfInstructorService(
  id: string
): Promise<Course[] | undefined> {
  try {
    const { data: response } = await axiosInstance.get<ApiResponse<Course[]>>(
      `/instructor/course/get/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("getAllCoursesOfInstructor Error:", error);
    throw error;
  }
}

export async function deleteCourseService(
  id: string
): Promise<Course[] | undefined> {
  try {
    const { data: response } = await axiosInstance.delete<
      ApiResponse<Course[]>
    >(`/instructor/course/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("deleteCourse Error:", error);
    throw error;
  }
}

// ==========================================
// STUDENT VIEW COURSE SERVICES
// ==========================================

export async function getAllCoursesService(
  sort?: string,
  filters?: FilterState
): Promise<Course[] | undefined> {
  try {
    if (!filters) {
      filters = {
        category: null,
        level: null,
        primaryLanguage: null,
      };
    }

    if (!sort) {
      sort = "";
    }

    const queryParams = new URLSearchParams({
      sort,
    });

    Object?.keys(filters).forEach((key) => {
      const value = filters?.[key as keyof FilterState];
      if (value && value.length > 0) {
        queryParams.append(key, value.join(","));
      }
    });

    const { data: response } = await axiosInstance.get<ApiResponse<Course[]>>(
      `/student/course/get?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("getAllCourses Error:", error);
    throw error;
  }
}

export async function getCourseDetailsService(
  courseId: string
): Promise<Course | undefined> {
  try {
    const { data: response } = await axiosInstance.get<ApiResponse<Course>>(
      `/student/course/get/${courseId}`
    );
    return response.data;
  } catch (error) {
    console.error("getCourseDetails Error:", error);
    throw error;
  }
}

export async function checkIsStudentEnrolledService(
  courseId: string,
  studentId: string
) {
  const { data: response } = await axiosInstance.get<ApiResponse<boolean>>(
    `/student/course/check-is-enrolled/${studentId}/${courseId}`
  );

  return response.data;
}

// ==========================================
// STUDENT COURSE ORDER SERVICES
// ==========================================

export async function createOrderService(
  userId: string,
  userName: string,
  userEmail: string,
  orderStatus: string,
  paymentMethod: string,
  paymentStatus: string,
  orderDate: Date,
  instructorId: string,
  instructorName: string,
  courseImage: string,
  courseTitle: string,
  courseId: string,
  coursePricing: string
) {
  try {
    const { data: response } = await axiosInstance.post(
      `/student/order/create`,
      {
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
      }
    );

    return response.data;
  } catch (error) {
    console.error("createOrderService Error:", error);
    throw error;
  }
}

export async function capturePaymentAndFinalizeOrderService(paymentId: string) {
  try {
    const { data: response } = await axiosInstance.post(
      `/student/order/capture/${paymentId}`
    );
    return response.data;
  } catch (error) {
    console.error("capturePaymentAndFinalizeOrderService Error:", error);
    throw error;
  }
}

// ==========================================
// STUDENT COURSES SERVICES
// ==========================================

export async function getMyCoursesService(studentId: string) {
  try {
    const { data: response } = await axiosInstance.get<
      ApiResponse<StudentCourses[]>
    >(`/student/my-courses/get/${studentId}`);

    return response.data?.[0];
  } catch (error) {
    console.error("getMyCoursesService Error:", error);
    throw error;
  }
}

// ==========================================
// STUDENT COURSE PROGRESS SERVICES
// ==========================================

// export async function getStudentCourseProgressService(
//   courseId: string,
//   userId: string
// ) {
//   const { data: response } = await axiosInstance.get<
//     ApiResponse<CourseProgress>
//   >(`/student/course-progress/get/${courseId}/${userId}`);

//   return response.data;
// }

// export async function UpdateStudentCourseProgressService(
//   courseId: string,
//   userId: string,
//   progress: {}
// ) {
//   const { data: response } = await axiosInstance.post<
//     ApiResponse<CourseProgress>
//   >(`/student/course-progress/get/${courseId}/${userId}`, {
//     ...progress,
//   });

//   return response.data;
// }
