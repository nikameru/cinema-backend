import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SessionEntity } from "./entities/session.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { FilmEntity } from "../films/entities/film.entity";
import { RoomEntity } from "src/rooms/entities/room.entity";

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(SessionEntity)
        private readonly sessionRepository: Repository<SessionEntity>,
        @InjectRepository(FilmEntity)
        private readonly filmRepository: Repository<FilmEntity>,
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>
    ) {}

    async create(createSessionDto: CreateSessionDto) {
        const film = await this.filmRepository.findOneBy({
            id: createSessionDto.filmId
        });
        if (!film) {
            throw new BadRequestException("Film not found");
        }
        const room = await this.roomRepository.findOneBy({
            id: createSessionDto.roomId
        });
        if (!room) {
            throw new BadRequestException("Room not found");
        }

        const session = this.sessionRepository.create({
            film,
            room,
            ...createSessionDto
        });

        return await this.sessionRepository.save(session);
    }

    async findCurrent(daysOffset: number) {
        const targetDate = new Date().setDate(
            new Date().getDate() + daysOffset
        );
        const dateString = new Date(targetDate).toISOString().split("T")[0];

        const queryBuilder =
            this.sessionRepository.createQueryBuilder("session");
        const entities = await queryBuilder
            .where(`DATE_TRUNC('day', "date") = :dateString`, {
                dateString
            })
            .leftJoinAndSelect("session.film", "film")
            .leftJoinAndSelect("session.room", "room")
            .getMany();

        return entities;
    }

    findAll() {
        return this.sessionRepository.find({ relations: ["film"] });
    }

    findOne(where: FindOptionsWhere<SessionEntity>) {
        return this.sessionRepository.findOne({ where, relations: ["film"] });
    }

    update(id: number, updateSessionDto: UpdateSessionDto) {
        return this.sessionRepository.update(id, updateSessionDto);
    }

    remove(id: number) {
        return this.sessionRepository.delete(id);
    }
}
