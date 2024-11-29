import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./users/entities/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                PORT: Joi.number().port().default(3000),
                DB_PASSWORD: Joi.string().required()
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true
            },
            isGlobal: true
        }),
        UsersModule,
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: "localhost",
                port: 5432,
                username: "postgres",
                password: configService.getOrThrow<string>("DB_PASSWORD"),
                database: "cinemadb",
                entities: [UserEntity],
                synchronize: true
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
