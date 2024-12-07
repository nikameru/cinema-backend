import { IsEmail, IsNumber, IsString } from "class-validator";
import { UserEntity } from "../entities/user.entity";

export class UserDto extends UserEntity {
    @IsNumber()
    id: number;

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
