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

export interface LectureProgress {
  lectureId: string;
  viewed: boolean;
  dateViewed: Date;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  completed: boolean;
  completionDate: Date;
  lecturesProgress: [LectureProgress];
}

export interface Order {
  userId: string;
  userName: string;
  userEmail: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  orderDate: Date;
  paymentId: string;
  payerId: string;
  instructorId: string;
  instructorName: string;
  courseImage: string;
  courseTitle: string;
  courseId: string;
  coursePricing: string;
}
