import { Schema, model, type Model, type Document } from 'mongoose';
import type { IReview } from '../@types/review.types.js';

interface IReviewDocument extends IReview, Document {}

const ReviewSchema: Schema<IReviewDocument> = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Review: Model<IReviewDocument> = model<IReviewDocument>(
  'Review',
  ReviewSchema
);
export default Review;
