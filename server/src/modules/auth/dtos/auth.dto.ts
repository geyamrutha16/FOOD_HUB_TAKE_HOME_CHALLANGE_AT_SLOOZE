import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class UserDto {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  country?: string;

  @Field()
  name: string;
}

@ObjectType()
export class LoginResponseDto {
  @Field()
  accessToken: string;

  @Field()
  user: UserDto;
}
