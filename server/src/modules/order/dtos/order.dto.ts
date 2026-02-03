import { ObjectType, Field, ID, InputType } from "@nestjs/graphql";
import { OrderItemDto } from "./order-item.dto";

@ObjectType()
export class OrderDto {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  country: string;

  @Field()
  status: string;

  @Field(() => [OrderItemDto])
  items: OrderItemDto[];
}
