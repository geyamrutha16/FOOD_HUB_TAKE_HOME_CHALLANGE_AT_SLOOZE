import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Order, OrderStatus, OrderItem } from "./schemas/order.schema";
import { MenuItem } from "../restaurant/schemas/menuitem.schema";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>,
  ) {}

  async createOrder(
    userId: string,
    country: string,
    items: { menuItemId: string; quantity: number }[],
  ) {
    if (items.length === 0) {
      throw new BadRequestException("Order must have at least one item");
    }

    // Validate all items exist
    for (const item of items) {
      const menuItem = await this.menuItemModel
        .findById(item.menuItemId)
        .exec();
      if (!menuItem) {
        throw new BadRequestException(`MenuItem ${item.menuItemId} not found`);
      }
    }

    const order = new this.orderModel({
      userId: new Types.ObjectId(userId),
      country,
      status: OrderStatus.CREATED,
      items: items.map((item) => ({
        menuItemId: new Types.ObjectId(item.menuItemId),
        quantity: item.quantity,
      })),
    });

    return order.save();
  }

  async getOrderById(orderId: string, userId: string, userCountry: string) {
    const order = await this.orderModel
      .findById(orderId)
      .populate("items.menuItemId")
      .exec();

    if (
      !order ||
      order.userId.toString() !== userId ||
      order.country !== userCountry
    ) {
      throw new ForbiddenException("Order not found or access denied");
    }

    return {
      id: order._id.toString(),
      userId: order.userId.toString(),
      country: order.country,
      status: order.status,
      items: order.items.map((item: any) => ({
        menuItemId: item.menuItemId._id.toString(),
        name: item.menuItemId.name,
        imageUrl: item.menuItemId.imageUrl,
        quantity: item.quantity,
      })),
    };
  }

  async getUserOrders(userId: string) {
    const orders = await this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate("items.menuItemId")
      .exec();

    return orders.map((order) => ({
      id: order._id.toString(),
      userId: order.userId.toString(),
      country: order.country,
      status: order.status,
      items: order.items.map((item: any) => ({
        menuItemId: item.menuItemId._id.toString(),
        name: item.menuItemId.name,
        imageUrl: item.menuItemId.imageUrl,
        quantity: item.quantity,
      })),
    }));
  }

  async checkoutOrder(orderId: string, userId: string, userCountry: string) {
    const order = await this.orderModel.findOneAndUpdate(
      {
        _id: orderId,
        userId: new Types.ObjectId(userId),
        country: userCountry,
        status: OrderStatus.CREATED,
      },
      { status: OrderStatus.PAID },
      { new: true },
    );

    if (!order) {
      throw new ForbiddenException("Order not found or access denied");
    }

    return order;
  }

  async cancelOrder(orderId: string, userId: string, userCountry: string) {
    const order = await this.orderModel.findOneAndUpdate(
      {
        _id: orderId,
        userId: new Types.ObjectId(userId),
        country: userCountry,
      },
      { status: OrderStatus.CANCELLED },
      { new: true },
    );

    if (!order) {
      throw new ForbiddenException("Order not found or access denied");
    }

    return order;
  }
}
