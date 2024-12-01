import {
    BadRequestException,
    ConflictException,
    forwardRef,
    Inject,
    Injectable
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import {
    FindManyOptions,
    FindOptionsWhere,
    MoreThanOrEqual,
    Repository
} from "typeorm";
import { CACHE_MANAGER, CacheStore } from "@nestjs/cache-manager";
import {
    REDIS_KEY_DELIMITER,
    REDIS_ORDERS_PREFIX
} from "src/constants/constants";
import { UsersService } from "src/users/users.service";
import { SessionsService } from "src/sessions/sessions.service";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => SessionsService))
        private readonly sessionsService: SessionsService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore
    ) {}

    async createReservation(createOrderDto: CreateOrderDto) {
        const existingReservation = await this.orderRepository.existsBy({
            userId: createOrderDto.userId,
            isPaid: false,
            reservationExpiresAt: MoreThanOrEqual(new Date())
        });
        if (existingReservation) {
            throw new ConflictException(
                "You can't make multiple reservations at once"
            );
        }

        const user = await this.usersService.findOne({
            id: createOrderDto.userId
        });
        if (!user) {
            throw new BadRequestException("User not found");
        }
        const session = await this.sessionsService.findOne({
            id: createOrderDto.sessionId
        });
        if (!session) {
            throw new BadRequestException("Session not found");
        }

        const reservation = this.orderRepository.create({
            user,
            session,
            ...createOrderDto
        });

        reservation.date = new Date();
        reservation.isPaid = false;
        reservation.reservationExpiresAt = new Date(
            new Date().setMinutes(new Date().getMinutes() + 15)
        );

        await this.orderRepository.save(reservation);
    }

    async createOrder(userId: number) {
        const reservation = await this.orderRepository.findOneBy({
            userId,
            isPaid: false,
            reservationExpiresAt: MoreThanOrEqual(new Date())
        });
        if (!reservation) {
            throw new ConflictException(
                "Wrong order flow! No reservation has been made"
            );
        }

        reservation.date = new Date();
        reservation.isPaid = true;
        reservation.reservationExpiresAt = null;

        return await this.orderRepository.save(reservation);
    }

    findAll() {
        return this.orderRepository.find();
    }

    findOne(where: FindOptionsWhere<OrderEntity>) {
        return this.orderRepository.findOne({
            where,
            relations: ["user", "session", "session.film"]
        });
    }

    findMany(options: FindManyOptions<OrderEntity>) {
        return this.orderRepository.find(options);
    }

    update(id: number, updateOrderDto: UpdateOrderDto) {
        return this.orderRepository.update(id, updateOrderDto);
    }

    remove(id: number) {
        return this.orderRepository.delete(id);
    }

    private getCacheKey(id: string | number) {
        return `${REDIS_ORDERS_PREFIX}${REDIS_KEY_DELIMITER}${id}`;
    }
}
