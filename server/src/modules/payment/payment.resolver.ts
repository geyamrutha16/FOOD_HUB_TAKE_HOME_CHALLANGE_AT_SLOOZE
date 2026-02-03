import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { PaymentService } from "./payment.service";
import { PaymentMethodDto } from "./dtos/payment.dto";

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Mutation(() => PaymentMethodDto)
  @Roles("ADMIN")
  async addPaymentMethod(
    @Args("type") type: string,
    @Args("details") details: string,
  ) {
    const method = await this.paymentService.addPaymentMethod(type, details);
    return {
      id: method._id.toString(),
      type: method.type,
      details: method.details,
    };
  }

  @Query(() => [PaymentMethodDto])
  @Roles("ADMIN")
  async paymentMethods() {
    const methods = await this.paymentService.getPaymentMethods();
    return methods.map((m) => ({
      id: m._id.toString(),
      type: m.type,
      details: m.details,
    }));
  }
}
