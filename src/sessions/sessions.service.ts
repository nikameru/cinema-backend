import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SessionEntity } from "./entities/session.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { FilmsService } from "src/films/films.service";
import { RoomsService } from "src/rooms/rooms.service";
import { CACHE_MANAGER, CacheStore } from "@nestjs/cache-manager";
import { REDIS_KEY_DELIMITER, REDIS_SESSIONS_PREFIX } from "src/constants/constants";
import { OrderEntity } from "src/orders/entities/order.entity";

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(SessionEntity)
        private readonly sessionRepository: Repository<SessionEntity>,
        @Inject() private readonly filmsService: FilmsService,
        @Inject() private readonly roomsService: RoomsService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>
    ) {}

    async create(createSessionDto: CreateSessionDto) {
        const film = await this.filmsService.findOne(createSessionDto.filmId);
        if (!film) {
            throw new BadRequestException("Film not found");
        }
        const room = await this.roomsService.findOne(createSessionDto.roomId);
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

        const cachedData = await this.cacheManager.get<SessionEntity>(
            this.getCacheKey(dateString)
        );
        if (cachedData) {
            return cachedData;
        }

        const queryBuilder =
            this.sessionRepository.createQueryBuilder("session");
        const entities = await queryBuilder
            .where(`DATE_TRUNC('day', "date") = :dateString`, {
                dateString
            })
            .leftJoinAndSelect("session.film", "film")
            .leftJoinAndSelect("session.room", "room")
            .getMany();

        await this.cacheManager.set<SessionEntity[]>(
            this.getCacheKey(dateString),
            entities,
            30000
        );

        return entities;
    }

    findAll() {
        return this.sessionRepository.find({ relations: ["film"] });
    }

    async findOne(where: FindOptionsWhere<SessionEntity>) {
        const cachedData = await this.cacheManager.get<SessionEntity>(
            this.getCacheKey(where)
        );
        if(cachedData){
            return cachedData;
        }

        const entity = await this.sessionRepository.findOne({where, relations: ["film"] });
        await this.cacheManager.set<SessionEntity>(
            this.getCacheKey(where),
            entity,
            30000
        )
        return entity;
    }

    update(id: number, updateSessionDto: UpdateSessionDto) {
        return this.sessionRepository.update(id, updateSessionDto);
    }

    remove(id: number) {
        return this.sessionRepository.delete(id);
    }

    async getOccupiedSeats(id: number){
        const isValidSession = await this.orderRepository.existsBy({ id });
        if(!isValidSession){
            throw new BadRequestException("Session is not valid");
        }

        const occupiedSeats = await this.orderRepository.find( { select: { seatIds: true }, where: { sessionId: id } } )
        return occupiedSeats;
    }

    private getCacheKey(id: string | FindOptionsWhere<SessionEntity>): string {
        return `${REDIS_SESSIONS_PREFIX}${REDIS_KEY_DELIMITER}${id}`;
    }
}
