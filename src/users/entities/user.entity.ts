import { Entity } from "typeorm";

@Entity({
    name: "users"
})
export class User {
    id: number;
    username: string;
    email: string;
    password: string;
}
