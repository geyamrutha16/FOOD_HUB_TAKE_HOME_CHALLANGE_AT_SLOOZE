import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaymentMethod } from "./schemas/payment.schema";

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(PaymentMethod.name)
    private paymentMethodModel: Model<PaymentMethod>,
  ) {}

  async addPaymentMethod(type: string, details: string) {
    const paymentMethod = new this.paymentMethodModel({ type, details });
    return paymentMethod.save();
  }

  async getPaymentMethods() {
    return this.paymentMethodModel.find().exec();
  }

  async getPaymentMethodById(id: string) {
    return this.paymentMethodModel.findById(id).exec();
  }
}
