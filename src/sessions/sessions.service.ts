import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable
} from "@nestjs/common";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SessionEntity } from "./entities/session.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { FilmsService } from "src/films/films.service";
import { RoomsService } from "src/rooms/rooms.service";
import { CACHE_MANAGER, CacheStore } from "@nestjs/cache-manager";
import {
    REDIS_KEY_DELIMITER,
    REDIS_SESSIONS_PREFIX
} from "src/constants/constants";
import { OrdersService } from "src/orders/orders.service";

@Injectable()
export class SessionsService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
        @InjectRepository(SessionEntity)
        private readonly sessionRepository: Repository<SessionEntity>,
        private readonly filmsService: FilmsService,
        private readonly roomsService: RoomsService,
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService
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

        const cachedData = await this.cacheManager.get<SessionEntity[]>(
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
        return await this.sessionRepository.findOne({
            where,
            relations: ["film"]
        });
    }

    update(id: number, updateSessionDto: UpdateSessionDto) {
        return this.sessionRepository.update(id, updateSessionDto);
    }

    remove(id: number) {
        return this.sessionRepository.delete(id);
    }

    async getOccupiedSeats(id: number) {
        const isValidSession = await this.sessionRepository.existsBy({ id });
        if (!isValidSession) {
            throw new BadRequestException("Session doesn't exist");
        }

        const occupiedSeats = await this.ordersService.findMany({
            select: { seatIds: true },
            where: { sessionId: id }
        });
        return occupiedSeats.reduce<number[]>((occupiedArray, entity) => {
            occupiedArray.push(...entity.seatIds);
            return occupiedArray;
        }, []);
    }

    private getCacheKey(id: string): string {
        return `${REDIS_SESSIONS_PREFIX}${REDIS_KEY_DELIMITER}${id}`;
    }
}
