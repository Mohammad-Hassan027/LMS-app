import { Schema, model, type Model, type Document } from 'mongoose';
import type {
  ICourseProgress,
  LectureProgress,
} from '../@types/courseProgress.types.js';

interface ICourseProgressDocument extends ICourseProgress, Document {}
interface ILectureProgressDocument extends LectureProgress, Document {}

const LectureProgressSchema: Schema<ILectureProgressDocument> = new Schema({
  lectureId: String,
  viewed: Boolean,
  dateViewed: Date,
});

const CourseProgressSchema: Schema<ICourseProgressDocument> = new Schema({
  userId: String,
  courseId: String,
  completed: Boolean,
  completionDate: Date,
  lecturesProgress: [LectureProgressSchema],
});

// export default model('Progress', CourseProgressSchema);

const CourseProgress: Model<ICourseProgressDocument> =
  model<ICourseProgressDocument>('CourseProgress', CourseProgressSchema);
export default CourseProgress;
