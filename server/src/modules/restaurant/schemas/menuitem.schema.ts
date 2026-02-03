import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class MenuItem extends Document {
  @Prop({ type: Types.ObjectId, ref: "Restaurant", required: true })
  restaurantId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  // ✅ ADD THIS
  @Prop({ required: true })
  imageUrl: string;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
