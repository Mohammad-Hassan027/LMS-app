import mongoose from 'mongoose';

const LectureSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  public_id: String,
  isFreePreview: Boolean,
});

const CourseSchema = new mongoose.Schema(
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

export default mongoose.model('Course', CourseSchema);
