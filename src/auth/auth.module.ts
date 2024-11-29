import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>("JWT_SECRET"),
                signOptions: {
                    expiresIn: "1w"
                }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
