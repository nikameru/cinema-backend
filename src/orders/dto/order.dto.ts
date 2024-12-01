import { IsArray, IsInt, IsNumber, Max, Min } from "class-validator";
import { OrderEntity } from "../entities/order.entity";
import { SEATS_PER_ROOM } from "src/constants/constants";

export class OrderDto extends OrderEntity {
    @IsNumber()
    id: number;

    @IsNumber()
    userId: number;

    @IsNumber()
    sessionId: number;

    @IsArray()
    @IsInt({ each: true })
    @Min(1, { each: true })
    @Max(SEATS_PER_ROOM, { each: true })
    seatIds: number[];
}
