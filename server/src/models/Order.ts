import { Schema, model, type Model, type Document } from 'mongoose';
import type { IOrder } from '../@types/order.types.js';

interface IOrderDocument extends IOrder, Document {}

const OrderSchema: Schema<IOrderDocument> = new Schema({
  userId: String,
  userName: String,
  userEmail: String,
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  orderDate: Date,
  paymentId: String,
  payerId: String,
  instructorId: String,
  instructorName: String,
  courseImage: String,
  courseTitle: String,
  courseId: String,
  coursePricing: String,
});

const Order: Model<IOrderDocument> = model<IOrderDocument>(
  'Order',
  OrderSchema
);
export default Order;
