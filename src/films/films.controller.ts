import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from "@nestjs/common";
import { FilmsService } from "./films.service";
import { CreateFilmDto } from "./dto/create-film.dto";
import { UpdateFilmDto } from "./dto/update-film.dto";
@Controller("films")
export class FilmsController {
    constructor(private readonly filmsService: FilmsService) {}

    @Post()
    create(@Body() createFilmDto: CreateFilmDto) {
        return this.filmsService.create(createFilmDto);
    }

    @Get()
    async findAll() {
        const films = await this.filmsService.findAll();
        console.log(films);
        return films;
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.filmsService.findOne(+id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateFilmDto: UpdateFilmDto) {
        return this.filmsService.update(+id, updateFilmDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.filmsService.remove(+id);
    }
}
