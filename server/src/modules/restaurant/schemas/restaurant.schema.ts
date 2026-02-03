import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Country } from "../../user/schemas/user.schema";

@Schema({ timestamps: true })
export class Restaurant extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: Country, required: true })
  country: Country;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
