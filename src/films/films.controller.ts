import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards
} from "@nestjs/common";
import { FilmsService } from "./films.service";
import { CreateFilmDto } from "./dto/create-film.dto";
import { UpdateFilmDto } from "./dto/update-film.dto";
import { JwtGuard } from "src/auth/guards/jwt.guard";
@Controller("films")
export class FilmsController {
    constructor(private readonly filmsService: FilmsService) {}

    @Post()
    @UseGuards(JwtGuard)
    create(@Body() createFilmDto: CreateFilmDto) {
        return this.filmsService.create(createFilmDto);
    }

    @Get()
    @UseGuards(JwtGuard)
    async findAll() {
        return await this.filmsService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.filmsService.findOne(+id);
    }

    @Patch(":id")
    @UseGuards(JwtGuard)
    update(@Param("id") id: string, @Body() updateFilmDto: UpdateFilmDto) {
        return this.filmsService.update(+id, updateFilmDto);
    }

    @Delete(":id")
    @UseGuards(JwtGuard)
    remove(@Param("id") id: string) {
        return this.filmsService.remove(+id);
    }
}
