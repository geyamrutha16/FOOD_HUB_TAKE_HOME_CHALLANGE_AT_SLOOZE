import { Field, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class OrderItemDto {
  @Field()
  menuItemId: string;

  @Field()
  name: string;

  @Field()
  imageUrl: string;

  @Field(() => Int)
  quantity: number;
}
