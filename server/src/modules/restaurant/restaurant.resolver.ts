import { Resolver, Query, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt.guard";
import { CountryGuard } from "../../common/guards/country.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RestaurantService } from "./restaurant.service";
import { RestaurantDto } from "./dtos/restaurant.dto";

@Resolver()
@UseGuards(JwtAuthGuard, CountryGuard)
export class RestaurantResolver {
  constructor(private restaurantService: RestaurantService) {}

  @Query(() => [RestaurantDto])
  async restaurants(@CurrentUser() user: any) {
    console.log("[RestaurantResolver] fetching restaurants for user:", {
      id: user?.id,
      email: user?.email,
      country: user?.country,
    });
    const restaurants = await this.restaurantService.getRestaurants(user);
    console.log(
      "[RestaurantResolver] found restaurants count:",
      restaurants.length,
    );
    return restaurants;
  }

  @Query(() => RestaurantDto)
  async restaurant(@Args("id") id: string) {
    const restaurant = await this.restaurantService.getRestaurantById(id);
    return restaurant;
  }
}
