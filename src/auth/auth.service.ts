import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "src/users/dto/user.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async signIn(username: string, password: string) {
        const user = await this.usersService.findOne({ username }, true);
        if (!user) {
            throw new UnauthorizedException();
        }

        const isAuthenticated = await bcrypt.compare(password, user.password);
        if (!isAuthenticated) {
            throw new UnauthorizedException();
        }

        const tokenPayload = { username: user.username, sub: user.id };
        return {
            accessToken: await this.jwtService.signAsync(tokenPayload)
        };
    }

    async signUp(user: CreateUserDto) {
        user.password = await bcrypt.hash(user.password, 10);
        return await this.usersService.create(user);
    }
}
