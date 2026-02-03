import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderDto } from "./dtos/order.dto";
import {
  CreateOrderInput,
  CreateOrderItemInput,
} from "./dtos/create-order.input";
import { JwtAuthGuard } from "../../common/guards/jwt.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Resolver(() => OrderDto)
@UseGuards(JwtAuthGuard)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  // 🟢 CREATE ORDER (any logged-in user)
  @Mutation(() => OrderDto)
  async createOrder(
    @CurrentUser() user: any,
    @Args("items", { type: () => [CreateOrderItemInput] })
    items: CreateOrderItemInput[],
  ) {
    return this.orderService.createOrder(user.id, user.country, items);
  }

  // 🟢 GET MY ORDERS (LIST)
  @Query(() => [OrderDto])
  async orders(@CurrentUser() user: any) {
    return this.orderService.getUserOrders(user.id);
  }

  // 🟢 GET MY ORDERS
  @Query(() => OrderDto)
  async order(@Args("id") id: string, @CurrentUser() user: any) {
    return this.orderService.getOrderById(id, user.id, user.country);
  }

  // 🔴 CHECKOUT (ADMIN / MANAGER only)
  @Mutation(() => OrderDto)
  @UseGuards(RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async checkoutOrder(
    @Args("orderId") orderId: string,
    @CurrentUser() user: any,
  ) {
    return this.orderService.checkoutOrder(orderId, user.id, user.country);
  }

  // 🔴 CANCEL (ADMIN / MANAGER only)
  @Mutation(() => OrderDto)
  @UseGuards(RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async cancelOrder(
    @Args("orderId") orderId: string,
    @CurrentUser() user: any,
  ) {
    return this.orderService.cancelOrder(orderId, user.id, user.country);
  }
}
