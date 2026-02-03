import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Country } from "../../user/schemas/user.schema";

export enum OrderStatus {
  CREATED = "CREATED",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

@Schema({ _id: false, timestamps: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: "MenuItem", required: true })
  menuItemId: Types.ObjectId;

  @Prop({ required: true, type: Number, min: 1 })
  quantity: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: Country, required: true })
  country: Country;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ userId: 1, country: 1 });
