import { IsNumber, IsString, IsUrl } from "class-validator";
import { FilmEntity } from "../entities/film.entity";

export class FilmDto extends FilmEntity {
    @IsNumber()
    id: number;

    @IsString()
    title: string;

    @IsUrl()
    coverLink: string;

    @IsString()
    releaseDate: Date;

    @IsString()
    genre: string;

    @IsNumber()
    rating: number;

    @IsString()
    cast: string;

    @IsString()
    duration: string;

    @IsUrl()
    trailerYoutubeLink: string;
}
