type Lecture = {
  title: string;
  videoUrl: string;
  public_id: string;
  isFreePreview: boolean;
};

interface ICourse {
  instructorId: string;
  instructorName?: string;
  title: string;
  category?: string;
  level?: string;
  primaryLanguage?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  welcomeMessage?: string;
  pricing: string;
  objectives?: string;
  students: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    paidAmount: string;
  }[];
  curriculum: Lecture[];
  isPublished?: boolean;
  averageRating?: number;
  totalReviews?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type { ICourse, Lecture };
