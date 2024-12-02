import { SessionEntity } from "src/sessions/entities/session.entity";
import { UserEntity } from "src/users/entities/user.entity";
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity({
    name: "orders"
})
export class OrderEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })
    userId: number;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    @JoinColumn()
    user: UserEntity;

    @Column({
        nullable: true
    })
    sessionId: number;

    @ManyToOne(() => SessionEntity, (session) => session.orders)
    @JoinColumn()
    session: SessionEntity;

    @Column()
    date: Date;

    @Column("int", {
        nullable: true,
        array: true
    })
    seatIds: number[];

    @Column({
        default: false
    })
    isPaid: boolean;

    @Column({
        nullable: true
    })
    reservationExpiresAt: Date;
}
