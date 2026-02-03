import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class MenuItemDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  price: number;
}

@ObjectType()
export class RestaurantDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  country: string;

  @Field(() => [MenuItemDto])
  menuItems: MenuItemDto[];
}
