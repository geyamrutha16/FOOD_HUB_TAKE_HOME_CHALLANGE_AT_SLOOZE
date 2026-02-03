import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { LoginResponseDto } from "./dtos/auth.dto";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponseDto)
  async login(
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    return this.authService.login(email, password);
  }
}
