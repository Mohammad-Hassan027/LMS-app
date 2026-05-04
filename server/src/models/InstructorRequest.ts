import { Schema, model, type Model, type Document } from 'mongoose';
import type { IInstructorRequest } from '../@types/instructorRequest.types.js';

interface IInstructorRequestDocument extends IInstructorRequest, Document {}

const InstructorRequestSchema: Schema<IInstructorRequestDocument> = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    userName: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reason: { type: String },
  },
  { timestamps: true }
);

const InstructorRequest: Model<IInstructorRequestDocument> =
  model<IInstructorRequestDocument>(
    'InstructorRequest',
    InstructorRequestSchema
  );
export default InstructorRequest;
