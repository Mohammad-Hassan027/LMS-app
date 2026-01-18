import type {
  ApiResponse,
  MediaData,
  Course,
  StudentCourses,
  LectureProgress,
  CourseProgress,
  CreateCourse,
  UpdateCourse,
} from "@/@types/types";
import type { FilterState } from "@/hooks/use-filters";
import axiosInstance from "@/service/apiInstance";
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
  cb: (percent: number) => void,
): Promise<MediaData> {
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
            (progressEvent.loaded * 100) / total,
          );
          cb(percentCompleted);
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("UploadMediaService Error:", error);
    throw error;
  }
}

export async function UploadBulkMediaService(
  formData: FormData,
  cb: (percent: number) => void,
): Promise<MediaData[]> {
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
          (progressEvent.loaded * 100) / total,
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
  type: string,
): Promise<MediaData> {
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
  formData: CreateCourse,
): Promise<Course> {
  try {
    const { data: response } = await axiosInstance.post<ApiResponse<Course>>(
      `/instructor/course/add`,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error("addNewCourse Error:", error);
    throw error;
  }
}

export async function updateCourseService(
  formData: UpdateCourse,
  id: string,
): Promise<Course> {
  try {
    const { data: response } = await axiosInstance.put<ApiResponse<Course>>(
      `/instructor/course/update/${id}`,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error("updateCourse Error:", error);
    throw error;
  }
}

export async function getCourseDetailsForInstructorService(
  id: string,
): Promise<Course> {
  try {
    const { data: response } = await axiosInstance.get<ApiResponse<Course>>(
      `/instructor/course/get/details/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("getCourseDetailsForInstructor Error:", error);
    throw error;
  }
}

export async function getAllCoursesOfInstructorService(
  id: string,
): Promise<Course[]> {
  try {
    const { data: response } = await axiosInstance.get<ApiResponse<Course[]>>(
      `/instructor/course/get/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("getAllCoursesOfInstructor Error:", error);
    throw error;
  }
}

export async function deleteCourseService(id: string): Promise<Course[]> {
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

export async function getAllStudentViewCoursesService(
  sort?: string,
  filters?: FilterState,
): Promise<Course[]> {
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
      `/student/course/get?${queryParams.toString()}`,
    );

    return response.data;
  } catch (error) {
    console.error("getAllStudentViewCoursesService Error:", error);
    throw error;
  }
}

export async function getStudentViewCourseDetailsService(
  courseId: string,
): Promise<Course> {
  try {
    const { data: response } = await axiosInstance.get<ApiResponse<Course>>(
      `/student/course/get/${courseId}`,
    );
    return response.data;
  } catch (error) {
    console.error("getStudentViewCourseDetailsService Error:", error);
    throw error;
  }
}

export async function checkIsStudentEnrolledService(
  courseId: string,
  userId: string,
) {
  try {
    const { data: response } = await axiosInstance.get<ApiResponse<boolean>>(
      `/student/course/check-is-enrolled/${userId}/${courseId}`,
    );

    return response.data;
  } catch (error) {
    console.error("checkIsStudentEnrolledService Error:", error);
    throw error;
  }
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
  coursePricing: string,
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
      },
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
      `/student/order/capture/${paymentId}`,
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

export async function getMyCoursesService(userId: string) {
  try {
    const { data: response } = await axiosInstance.get<
      ApiResponse<StudentCourses>
    >(`/student/my-courses/get/${userId}`);

    return response.data;
  } catch (error) {
    console.error("getMyCoursesService Error:", error);
    throw error;
  }
}

// ==========================================
// STUDENT COURSE PROGRESS SERVICES
// ==========================================

export async function getStudentCourseProgressService(
  courseId: string,
  userId: string,
): Promise<{
  isPurchased: boolean;
  progress?: LectureProgress[];
  courseDetails?: Course;
  completed?: boolean;
  completionDate?: Date;
}> {
  try {
    const { data: response } = await axiosInstance.get(
      `/student/course-progress/get/${courseId}/${userId}`,
    );

    return response.data;
  } catch (error) {
    console.error("getStudentCourseProgressService Error:", error);
    throw error;
  }
}

export async function markCurrentLectureAsViewedService(
  courseId: string,
  userId: string,
  lectureId: string,
): Promise<CourseProgress> {
  try {
    const { data: response } = await axiosInstance.post(
      `/student/course-progress/mark-lecture-viewed`,
      {
        lectureId,
        courseId,
        userId,
      },
    );

    return response.data;
  } catch (error) {
    console.error("markCurrentLectureAsViewedServive Error:", error);
    throw error;
  }
}

export async function resetCurrentCourseProgressService(
  courseId: string,
  userId: string,
): Promise<CourseProgress> {
  try {
    const { data: response } = await axiosInstance.post(
      `/student/course-progress/reset-progress`,
      { userId, courseId },
    );

    return response.data;
  } catch (error) {
    console.error("resetCurrentCourseProgressService Error:", error);
    throw error;
  }
}

// ==========================================
// Admin SERVICES
// ==========================================

export async function requestToBeInstructorService({
  userId,
  email,
  userName,
  reason,
}: {
  userId: string;
  email: string;
  userName: string;
  reason: string;
}) {
  try {
    const { data: response } = await axiosInstance.post("/admin/request", {
      userId,
      email,
      userName,
      reason,
    });

    return response.data;
  } catch (error) {
    console.error("requestToBeInstructorService Error:", error);
    throw error;
  }
}

export async function promoteToInstructorService({
  requestId,
  userId,
}: {
  requestId: string;
  userId: string;
}) {
  try {
    const { data: response } = await axiosInstance.post("/admin/approve", {
      requestId,
      userId,
    });

    return response.data;
  } catch (error) {
    console.error("promoteToInstructorService Error:", error);
    throw error;
  }
}

export async function rejectRequestService({
  requestId,
}: {
  requestId: string;
}) {
  try {
    const { data: response } = await axiosInstance.post("/admin/reject", {
      requestId,
    });

    return response.data;
  } catch (error) {
    console.error("rejectRequestService Error:", error);
    throw error;
  }
}

export async function getInstructorRequestsService() {
  try {
    const { data: response } = await axiosInstance.get("/admin/requests");

    return response.data;
  } catch (error) {
    console.error("getInstructorRequestsService Error:", error);
    throw error;
  }
}
