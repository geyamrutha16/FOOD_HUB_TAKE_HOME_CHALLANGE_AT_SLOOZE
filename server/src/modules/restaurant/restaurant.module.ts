import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Restaurant, RestaurantSchema } from "./schemas/restaurant.schema";
import { MenuItem, MenuItemSchema } from "./schemas/menuitem.schema";
import { RestaurantService } from "./restaurant.service";
import { RestaurantResolver } from "./restaurant.resolver";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
  ],
  providers: [RestaurantService, RestaurantResolver],
  exports: [RestaurantService],
})
export class RestaurantModule {}
