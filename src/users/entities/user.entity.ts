import { OrderEntity } from "src/orders/entities/order.entity";
import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity({
    name: "users"
})
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column({
        select: false
    })
    password: string;

    @OneToMany(() => OrderEntity, (order) => order.user)
    orders: OrderEntity[];
}
