import { Injectable } from "@nestjs/common";
import { CreateFilmDto } from "./dto/create-film.dto";
import { UpdateFilmDto } from "./dto/update-film.dto";
import { FilmEntity } from "./entities/film.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class FilmsService {
    constructor(
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
        return await this.filmRepository.findOne({ where: { id } });
    }

    async update(id: number, updateFilmDto: UpdateFilmDto) {
        return await this.filmRepository.update(id, updateFilmDto);
    }

    async remove(id: number) {
        return await this.filmRepository.delete(id);
    }
}
