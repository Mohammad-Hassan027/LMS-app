interface IOrder {
  userId?: string;
  userName?: string;
  userEmail?: string;
  orderStatus?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  orderDate?: Date | string;
  paymentId?: string;
  payerId?: string;
  instructorId?: string;
  instructorName?: string;
  courseImage?: string;
  courseTitle?: string;
  courseId?: string;
  coursePricing?: string;
}

export type { IOrder };
