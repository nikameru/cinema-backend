import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { SessionsModule } from "src/sessions/sessions.module";
import { TicketsService } from "./tickets/tickets.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity]),
        UsersModule,
        SessionsModule,
        JwtModule
    ],
    controllers: [OrdersController],
    providers: [OrdersService, TicketsService]
})
export class OrdersModule {}
