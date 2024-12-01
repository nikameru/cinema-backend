import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateFilmDto } from "./dto/create-film.dto";
import { UpdateFilmDto } from "./dto/update-film.dto";
import { FilmEntity } from "./entities/film.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CACHE_MANAGER, CacheStore } from "@nestjs/cache-manager";
import {
    REDIS_FILMS_PREFIX,
    REDIS_KEY_DELIMITER
} from "src/constants/constants";

@Injectable()
export class FilmsService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
        @InjectRepository(FilmEntity)
        private readonly filmRepository: Repository<FilmEntity>
    ) {}
    async create(createFilmDto: CreateFilmDto) {
        const film = this.filmRepository.create(createFilmDto);
        return await this.filmRepository.save(film);
    }

    async findAll() {
        return await this.filmRepository.find();
    }

    async findOne(id: number) {
        const cachedData = await this.cacheManager.get<FilmEntity>(
            this.getCacheKey(id)
        );
        if (cachedData) {
            return cachedData;
        }

        // If not cached, fetch from database and cache it
        const film = await this.filmRepository.findOneBy({ id });
        if (!film) {
            throw new NotFoundException("Film does not exist");
        }

        await this.cacheManager.set<FilmEntity>(
            this.getCacheKey(id),
            film,
            3000
        );

        return film;
    }

    async update(id: number, updateFilmDto: UpdateFilmDto) {
        return await this.filmRepository.update(id, updateFilmDto);
    }

    async remove(id: number) {
        return await this.filmRepository.delete(id);
    }

    private getCacheKey(id: string | number) {
        return `${REDIS_FILMS_PREFIX}${REDIS_KEY_DELIMITER}${id}`;
    }
}
