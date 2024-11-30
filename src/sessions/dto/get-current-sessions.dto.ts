import { Type } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class GetCurrentSessionsDto {
    @IsNumber()
    @Min(-50)
    @Max(50)
    @IsOptional()
    @Type(() => Number)
    daysOffset?: number = 0;
}
