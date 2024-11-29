import { IsNumber } from "class-validator";
import { OrderEntity } from "../entities/order.entity";

export class OrderDto extends OrderEntity {
    @IsNumber()
    id: number;

    @IsNumber()
    userId: string;

    @IsNumber()
    filmId: string;
}
