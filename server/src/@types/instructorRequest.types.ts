type InstructorRequestStatus = 'pending' | 'approved' | 'rejected';

interface IInstructorRequest {
  userId: string;
  email: string;
  userName?: string;
  status?: InstructorRequestStatus;
  reason?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type { InstructorRequestStatus, IInstructorRequest };
