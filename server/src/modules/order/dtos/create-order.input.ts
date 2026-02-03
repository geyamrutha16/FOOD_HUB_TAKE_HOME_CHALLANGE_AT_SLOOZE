import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateOrderItemInput {
  @Field()
  menuItemId: string;

  @Field(() => Int)
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}
