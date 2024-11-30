import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtGuard } from "./guards/jwt.guard";

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.getOrThrow<string>("JWT_SECRET"),
                signOptions: {
                    expiresIn: "1w"
                }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [
        AuthService
        // {
        //     provide: APP_GUARD,
        //     useClass: JwtGuard
        // }
    ],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
