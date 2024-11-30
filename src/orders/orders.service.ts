import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { CACHE_MANAGER, CacheStore } from "@nestjs/cache-manager";
import {
    REDIS_KEY_DELIMITER,
    REDIS_ORDERS_PREFIX
} from "src/constants/constants";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: CacheStore
    ) {}

    async createReservation(createOrderDto: CreateOrderDto) {
        const reservation = await this.cacheManager.get(
            this.getCacheKey(createOrderDto.userId)
        );
        if (reservation) {
            throw new ConflictException(
                "You can't make multiple reservations at once"
            );
        }

        await this.cacheManager.set(
            this.getCacheKey(createOrderDto.userId),
            createOrderDto,
            15 * 1000
        );
    }

    async createOrder(userId: number) {
        const reservation = await this.cacheManager.get<CreateOrderDto>(
            this.getCacheKey(userId)
        );
        await this.cacheManager.del(this.getCacheKey(userId));

        return this.orderRepository.save(reservation);
    }

    findAll() {
        return this.orderRepository.find();
    }

    findOne(where: FindOptionsWhere<OrderEntity>) {
        return this.orderRepository.findOneBy(where);
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
