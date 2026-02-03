import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../user/schemas/user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || "super-secret-key-change-in-production",
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.sub).exec();
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      country: user.country,
    };
  }
}
