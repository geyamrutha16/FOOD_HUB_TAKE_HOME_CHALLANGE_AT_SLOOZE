import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class PaymentMethodDto {
  @Field(() => ID)
  id: string;

  @Field()
  type: string;

  @Field()
  details: string;
}
