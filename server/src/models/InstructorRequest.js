import mongoose from 'mongoose';

const InstructorRequestSchema = new mongoose.Schema(
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

export default mongoose.model('InstructorRequest', InstructorRequestSchema);
