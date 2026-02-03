import { Injectable, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Restaurant } from "./schemas/restaurant.schema";
import { MenuItem } from "./schemas/menuitem.schema";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>,
  ) {}

  async getRestaurants(user: { role: string; country: string | null }) {
    const filter = user.role === "ADMIN" ? {} : { country: user.country };

    const restaurants = await this.restaurantModel.find(filter).exec();

    return Promise.all(
      restaurants.map(async (r) => {
        const items = await this.menuItemModel
          .find({ restaurantId: r._id })
          .exec();

        return {
          id: r._id.toString(),
          name: r.name,
          country: r.country,
          menuItems: items.map((item) => ({
            id: item._id.toString(),
            name: item.name,
            price: item.price,
          })),
        };
      }),
    );
  }

  // Update to match the resolver call (only accepts id)
  async getRestaurantById(id: string) {
    const restaurant = await this.restaurantModel.findById(id).exec();
    
    if (!restaurant) {
      throw new ForbiddenException("Restaurant not found");
    }

    const items = await this.menuItemModel
      .find({ restaurantId: restaurant._id })
      .exec();

    return {
      id: restaurant._id.toString(),
      name: restaurant.name,
      country: restaurant.country,
      menuItems: items.map((item) => ({
        id: item._id.toString(),
        name: item.name,
        price: item.price,
      })),
    };
  }
}
// No need for additional export - the class is already exported