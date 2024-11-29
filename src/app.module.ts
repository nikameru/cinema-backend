import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./users/entities/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { OrdersModule } from "./orders/orders.module";
import { FilmsModule } from "./films/films.module";
import * as Joi from "joi";
import { FilmEntity } from "./films/entities/film.entity";
import { AuthModule } from "./auth/auth.module";
import { SeatsModule } from "./seats/seats.module";
import { RoomsModule } from "./rooms/rooms.module";
import { RoomEntity } from "./rooms/entities/room.entity";
import { SeatEntity } from "./seats/entities/seat.entity";

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                PORT: Joi.number().port().default(3000),
                POSTGRES_HOST: Joi.string().hostname(),
                POSTGRES_PORT: Joi.number().port().default(5432),
                POSTGRES_PASSWORD: Joi.string(),
                POSTGRES_USER: Joi.string(),
                POSTGRES_DB: Joi.string()
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true
            },
            isGlobal: true
        }),
        UsersModule,
        OrdersModule,
        FilmsModule,
        AuthModule,
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.getOrThrow<string>("POSTGRES_HOST"),
                port: configService.getOrThrow<number>("POSTGRES_PORT"),
                username: configService.getOrThrow<string>("POSTGRES_USER"),
                password: configService.getOrThrow<string>("POSTGRES_PASSWORD"),
                database: configService.getOrThrow<string>("POSTGRES_DB"),
                entities: [UserEntity, FilmEntity, RoomEntity, SeatEntity],
                synchronize: true
            }),
            inject: [ConfigService]
        }),
        SeatsModule,
        RoomsModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
