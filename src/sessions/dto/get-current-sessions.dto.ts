import { IsNumber, Max, Min } from "class-validator";

export class GetCurrentSessionsDto {
    @IsNumber()
    @Min(-50)
    @Max(50)
    daysOffset?: number = 0;
}
