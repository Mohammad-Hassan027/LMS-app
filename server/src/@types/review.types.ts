import type { Types } from 'mongoose';

interface IReview {
  courseId: Types.ObjectId | string;
  studentId: string;
  studentName: string;
  rating: number;
  reviewText: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type { IReview };
