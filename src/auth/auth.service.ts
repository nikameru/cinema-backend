import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne({ username });
        if (!(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException();
        }
        const payload = { username: user.username, sub: user.id };
        return {
            accessToken: await this.jwtService.signAsync(payload)
        };
    }
}
