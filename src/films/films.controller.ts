import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Inject,
    Res,
    Req
} from "@nestjs/common";
import { FilmsService } from "./films.service";
import { CreateFilmDto } from "./dto/create-film.dto";
import { UpdateFilmDto } from "./dto/update-film.dto";
import { CACHE_MANAGER, CacheStore, CacheTTL } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';

@Controller("films")
export class FilmsController {
    constructor(
        private readonly filmsService: FilmsService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore) {}

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
        const cachedData = await this.cacheManager.get(id);  
        if (cachedData) {  
            console.log("caching"); 
            return cachedData;  
        }  
        console.log("fetching from database");  // If not cached, fetch from database and cache it
        const film = await this.filmsService.findOne(+id);  
        if (!film) 
            throw new NotFoundException('Film does not exist');  
        await this.cacheManager.set(id, film, 1000);
        return film;
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
