type LectureProgress = {
  lectureId?: string;
  viewed?: boolean;
  dateViewed?: Date | string;
};

interface ICourseProgress {
  userId: string;
  courseId: string;
  completed?: boolean;
  completionDate?: Date | string;
  lecturesProgress?: LectureProgress[];
}

export type { LectureProgress, ICourseProgress };
