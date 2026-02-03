import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthModule } from "./modules/auth/auth.module";
import { RestaurantModule } from "./modules/restaurant/restaurant.module";
import { OrderModule } from "./modules/order/order.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        
        console.log(`MONGODB_URI: ${uri}`);

        if (!uri) {
          throw new Error("MONGODB_URI environment variable is not defined");
        }

        console.log(`Attempting to connect to MongoDB...`);
        
        return {
          uri,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log("✅ MongoDB Connected Successfully");
            });
            connection.on('error', (err) => {
              console.error("❌ MongoDB Connection Error:", err.message);
            });
            connection.on('disconnected', () => {
              console.log("🔌 MongoDB Disconnected");
            });
            
            return connection;
          },
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        };
      },
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      context: ({ req }) => ({ req }),
    }),

    AuthModule,
    UserModule,
    RestaurantModule,
    OrderModule,
    PaymentModule,
  ],
})
export class AppModule {}