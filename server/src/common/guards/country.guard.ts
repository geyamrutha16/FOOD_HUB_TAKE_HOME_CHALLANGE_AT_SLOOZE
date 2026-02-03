import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class CountryGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    const user = req.user;

    if (!user || !user.country) {
      throw new ForbiddenException("User country not found");
    }

    // Store user country in context for resolvers to check against resources
    req.userCountry = user.country;
    return true;
  }
}
