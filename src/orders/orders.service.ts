import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>
    ) {}

    create(createOrderDto: CreateOrderDto) {
        return this.orderRepository.save(createOrderDto);
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
}
