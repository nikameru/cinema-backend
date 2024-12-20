import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./users/entities/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { OrdersModule } from "./orders/orders.module";
import { FilmsModule } from "./films/films.module";
import * as Joi from "joi";
import { FilmEntity } from "./films/entities/film.entity";
import { AuthModule } from "./auth/auth.module";
import { RoomsModule } from "./rooms/rooms.module";
import { RoomEntity } from "./rooms/entities/room.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-yet";
import { OrderEntity } from "./orders/entities/order.entity";
import { SessionsModule } from "./sessions/sessions.module";
import { SessionEntity } from "./sessions/entities/session.entity";

import("adminjs").then((adminjs) => {
    import("@adminjs/typeorm").then((AdminJSTypeorm) => {
        adminjs.default.registerAdapter({
            Resource: AdminJSTypeorm.Resource,
            Database: AdminJSTypeorm.Database
        });
    });
});

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                PORT: Joi.number().port().default(3000),
                POSTGRES_HOST: Joi.string().hostname(),
                POSTGRES_PORT: Joi.number().port().default(5432),
                POSTGRES_PASSWORD: Joi.string(),
                POSTGRES_USER: Joi.string(),
                POSTGRES_DB: Joi.string(),
                REDIS_HOST: Joi.string().hostname(),
                REDIS_PORT: Joi.number().port().default(6379)
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true
            },
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                type: "postgres",
                host: configService.getOrThrow<string>("POSTGRES_HOST"),
                port: +configService.getOrThrow<string>("POSTGRES_PORT"),
                username: configService.getOrThrow<string>("POSTGRES_USER"),
                password: configService.getOrThrow<string>("POSTGRES_PASSWORD"),
                database: configService.getOrThrow<string>("POSTGRES_DB"),
                entities: [
                    UserEntity,
                    FilmEntity,
                    RoomEntity,
                    OrderEntity,
                    SessionEntity
                ],
                synchronize: true
            }),
            inject: [ConfigService]
        }),
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async (configService: ConfigService) => ({
                store: await redisStore({
                    socket: {
                        host: configService.getOrThrow<string>("REDIS_HOST"),
                        port: configService.getOrThrow<number>("REDIS_PORT")
                    }
                })
            }),
            inject: [ConfigService]
        }),
        import("@adminjs/nestjs").then(({ AdminModule }) =>
            AdminModule.createAdminAsync({
                useFactory: () => ({
                    adminJsOptions: {
                        rootPath: "/admin",
                        resources: [
                            RoomEntity,
                            FilmEntity,
                            SessionEntity,
                            OrderEntity,
                            UserEntity
                        ]
                    },
                    auth: {
                        // Test implementation
                        authenticate: async (
                            email: string,
                            password: string
                        ) => {
                            if (
                                email === "admin@admin.com" &&
                                password === "admin"
                            ) {
                                return Promise.resolve({
                                    email: "admin@admin.com",
                                    password: "admin"
                                });
                            }

                            return null;
                        },
                        cookieName: "adminjs",
                        cookiePassword: "secret"
                    },
                    sessionOptions: {
                        resave: true,
                        saveUninitialized: true,
                        secret: "secret"
                    }
                })
            })
        ),
        UsersModule,
        OrdersModule,
        FilmsModule,
        AuthModule,
        RoomsModule,
        SessionsModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
