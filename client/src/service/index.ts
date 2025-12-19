import type { ApiResponse, MediaData, Course } from "../types/types";
import axiosInstance, { BASE_URL } from "./apiInstance";
import type { AxiosProgressEvent } from "axios";

// export async function ProtectedService() {
//   try {
//     const { data: response } = await axiosInstance.get<ApiResponse<any>>(
//       `${BASE_URL}/protected`
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
      `${BASE_URL}/media/upload`,
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
    >(`${BASE_URL}/media/bulk-upload`, formData, {
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
    >(`${BASE_URL}/media/delete/${encodedId}?type=${resourceType}`);

    return response.data;
  } catch (error) {
    console.error("DeleteMediaService Error:", error);
    throw error;
  }
}

// ==========================================
// INSTRUCTOR COURSE SERVICES
// ==========================================

export async function addNewCourse(
  formData: Omit<Course, "_id">
): Promise<Course | undefined> {
  try {
    const { data: response } = await axiosInstance.post<ApiResponse<Course>>(
      `${BASE_URL}/instructor/course/add`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("addNewCourse Error:", error);
    throw error;
  }
}

export async function updateCourse(
  formData: Omit<
    Course,
    "_id" | "instructorId" | "instructorName" | "students"
  >,
  id: string
): Promise<Course | undefined> {
  try {
    const { data: response } = await axiosInstance.put<ApiResponse<Course>>(
      `${BASE_URL}/instructor/course/update/${id}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("updateCourse Error:", error);
    throw error;
  }
}

export async function getCourseDetailsForInstructor(
  id: string
): Promise<Course | undefined> {
  try {
    const { data: response } = await axiosInstance.get<ApiResponse<Course>>(
      `${BASE_URL}/instructor/course/get/details/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("getCourseDetailsForInstructor Error:", error);
    throw error;
  }
}

export async function getAllCoursesOfInstructor(
  id: string
): Promise<Course[] | undefined> {
  try {
    const { data: response } = await axiosInstance.get<ApiResponse<Course[]>>(
      `${BASE_URL}/instructor/course/get/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("getAllCoursesOfInstructor Error:", error);
    throw error;
  }
}

export async function deleteCourse(id: string): Promise<Course[] | undefined> {
  try {
    const { data: response } = await axiosInstance.delete<
      ApiResponse<Course[]>
    >(`${BASE_URL}/instructor/course/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("deleteCourse Error:", error);
    throw error;
  }
}

// ==========================================
// STUDENT COURSE SERVICES
// ==========================================

export async function getAllCourses(): Promise<Course[] | undefined> {
  try {
    const { data: response } = await axiosInstance.get<ApiResponse<Course[]>>(
      `${BASE_URL}/student/course/get`
    );
    return response.data;
  } catch (error) {
    console.error("getAllCourses Error:", error);
    throw error;
  }
}

export async function getCourseDetails(
  courseId: string
): Promise<Course | undefined> {
  try {
    const { data: response } = await axiosInstance.get<ApiResponse<Course>>(
      `${BASE_URL}/student/course/get/${courseId}`
    );
    return response.data;
  } catch (error) {
    console.error("getCourseDetails Error:", error);
    throw error;
  }
}
