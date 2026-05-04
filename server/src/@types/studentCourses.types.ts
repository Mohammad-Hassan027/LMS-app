type StudentCourseEntry = {
  courseId?: string;
  title?: string;
  instructorId?: string;
  instructorName?: string;
  dateOfPurchase?: Date | string;
  courseImage?: string;
};

interface IStudentCourses {
  userId: string;
  courses?: StudentCourseEntry[];
}

export type { StudentCourseEntry, IStudentCourses };
