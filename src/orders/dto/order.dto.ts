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

    @IsNumber()
    roomId: number;

    @IsArray({ each: true })
    @IsInt()
    @Min(1)
    @Max(SEATS_PER_ROOM)
    seatIds: number[];
}
