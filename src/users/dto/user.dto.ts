import { IsNumber, IsString } from "class-validator";
import { UserEntity } from "../entities/user.entity";

export class UserDto extends UserEntity {
    @IsNumber()
    id: number;

    @IsString()
    username: string;

    @IsString()
    email: string;

    @IsString()
    password: string;
}
