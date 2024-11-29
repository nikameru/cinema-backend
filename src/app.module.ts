import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./users/entities/user.entity";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: "localhost",
                port: 5432,
                username: "postgres",
                password: configService.getOrThrow<string>("DB_PASSWORD"),
                database: "cinema",
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
