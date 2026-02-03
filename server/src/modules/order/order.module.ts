import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./schemas/order.schema";
import { OrderService } from "./order.service";
import { OrderResolver } from "./order.resolver";
import {
  MenuItem,
  MenuItemSchema,
} from "../restaurant/schemas/menuitem.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
  ],
  providers: [OrderService, OrderResolver],
})
export class OrderModule {}
