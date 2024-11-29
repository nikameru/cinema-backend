import { OmitType } from "@nestjs/mapped-types";
import { FilmDto } from "./film.dto";

export class CreateFilmDto extends OmitType(FilmDto, ["id" as const]) {}
