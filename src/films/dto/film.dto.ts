import { IsNumber, IsString } from "class-validator";
import { FilmEntity } from "../entities/film.entity";

export class FilmDto extends FilmEntity {
    @IsNumber()
    id: number;

    @IsString()
    title: string;

    @IsString()
    releaseDate: Date;

    @IsString()
    genre: string;

    @IsString()
    rating: number;

    @IsString()
    cast: string;

    @IsString()
    duration: string;
}
