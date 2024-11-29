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
        private readonly filmRepository: Repository<FilmEntity>) {}
    create(createFilmDto: CreateFilmDto) {
        const film = this.filmRepository.create(createFilmDto);
        return this.filmRepository.save(film);
    }

    findAll() {
        return this.filmRepository.find();
    }

    findOne(id: number) {
        return this.filmRepository.findOneBy({ id });
    }

    update(id: number, updateFilmDto: UpdateFilmDto) {
        return this.filmRepository.update(id, updateFilmDto);
    }

    remove(id: number) {
        return this.filmRepository.delete(id);
    }
}
