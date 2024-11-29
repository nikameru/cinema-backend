import { Entity } from "typeorm";

@Entity({
    name: "users"
})
export class UserEntity {
    id: number;
    username: string;
    email: string;
    password: string;
}
