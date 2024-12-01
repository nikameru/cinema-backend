import { SessionEntity } from "src/sessions/entities/session.entity";
import { UserEntity } from "src/users/entities/user.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity({
    name: "orders"
})
export class OrderEntity {
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

    @OneToOne(() => SessionEntity)
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
