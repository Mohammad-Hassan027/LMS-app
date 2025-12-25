export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Course {
  _id: string;
  instructorId: string;
  instructorName: string;
  title: string;
  description: string;
  category: string;
  level: string;
  primaryLanguage: string;
  subtitle: string;
  image: string;
  welcomeMessage: string;
  pricing: string;
  objectives: string;
  students: Student[];
  curriculum: Lecture[];
  isPublished: boolean;
}

export interface Student {
  studentId: string;
  studentName: string;
  studentEmail: string;
  paidAmount: string;
}

export interface Lecture {
  title: string;
  videoUrl: string;
  public_id: string;
  isFreePreview: boolean;
}

export interface MediaData {
  url: string;
  public_id: string;
}

export interface StudentCourses {
  _id: string;
  userId: string;
  courses: [
    {
      courseId: string;
      title: string;
      instructorId: string;
      instructorName: string;
      dateOfPurchase: Date;
      courseImage: string;
    }
  ];
}
