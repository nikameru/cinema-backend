import { Injectable } from "@nestjs/common";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SessionEntity } from "./entities/session.entity";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(SessionEntity)
        private readonly sessionRepository: Repository<SessionEntity>
    ) {}

    create(createSessionDto: CreateSessionDto) {
        return this.sessionRepository.save(createSessionDto);
    }

    async findCurrent(daysOffset?: number) {
        const targetDate = new Date().setDate(
            new Date().getDate() + daysOffset
        );
        const dateString = new Date(targetDate).toISOString().split("T")[0];

        const queryBuilder =
            this.sessionRepository.createQueryBuilder("session");
        queryBuilder.where(`DATE_TRUNC('day', "date") = :dateString`, {
            dateString
        });
        const { entities } = await queryBuilder.getRawAndEntities();

        return entities;
    }

    findAll() {
        return this.sessionRepository.find();
    }

    findOne(where: FindOptionsWhere<SessionEntity>) {
        return this.sessionRepository.findOneBy(where);
    }

    update(id: number, updateSessionDto: UpdateSessionDto) {
        return this.sessionRepository.update(id, updateSessionDto);
    }

    remove(id: number) {
        return this.sessionRepository.delete(id);
    }
}
