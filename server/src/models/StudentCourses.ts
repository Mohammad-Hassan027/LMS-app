import { Schema, model, type Model, type Document } from 'mongoose';
import type {
  IStudentCourses,
  StudentCourseEntry,
} from '../@types/studentCourses.types.js';

interface IStudentCoursesDocument extends IStudentCourses, Document {}
interface IStudentCourseEntryDocument extends StudentCourseEntry, Document {}

const StudentCourseEntrySchema: Schema<IStudentCourseEntryDocument> =
  new Schema({
    courseId: String,
    title: String,
    instructorId: String,
    instructorName: String,
    dateOfPurchase: Date,
    courseImage: String,
  });

const StudentCoursesSchema: Schema<IStudentCoursesDocument> = new Schema({
  userId: String,
  courses: [StudentCourseEntrySchema],
});

const StudentCourses: Model<IStudentCoursesDocument> =
  model<IStudentCoursesDocument>('StudentCourses', StudentCoursesSchema);
export default StudentCourses;
