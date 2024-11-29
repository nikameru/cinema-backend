import { IsNumber } from "class-validator";

export class OrderDto {
    @IsNumber()
    id: number;

    @IsNumber()
    userId: string;

    @IsNumber()
    filmId: string;
}
