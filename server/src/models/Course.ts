import { Schema, model, type Model, type Document } from 'mongoose';
import type { ICourse, Lecture } from '../@types/course.types.js';

interface ICourseDocument extends ICourse, Document {}
interface ILectureDocument extends Lecture, Document {}

const LectureSchema: Schema<ILectureDocument> = new Schema({
  title: String,
  videoUrl: String,
  public_id: String,
  isFreePreview: Boolean,
});

const CourseSchema: Schema<ICourseDocument> = new Schema(
  {
    instructorId: {
      type: String,
      required: true,
    },
    instructorName: String,
    title: { type: String, required: true },
    category: String,
    level: String,
    primaryLanguage: String,
    subtitle: String,
    description: String,
    image: String,
    welcomeMessage: String,
    pricing: { type: String, required: true },
    objectives: String,
    students: [
      {
        studentId: String,
        studentName: String,
        studentEmail: String,
        paidAmount: String,
      },
    ],
    curriculum: [LectureSchema],
    isPublished: Boolean,
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// export default model('Course', CourseSchema);
const Course: Model<ICourseDocument> = model<ICourseDocument>(
  'Course',
  CourseSchema
);
export default Course;
