import { SeatEntity } from "src/seats/entities/seat.entity";
import { SessionEntity } from "src/sessions/entities/session.entity";
import { UserEntity } from "src/users/entities/user.entity";
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
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

    @ManyToMany(() => SeatEntity, { eager: true })
    @JoinTable()
    seats: SeatEntity[];

    @Column({
        default: false
    })
    isPaid: boolean;

    @Column({
        nullable: true
    })
    reservationExpiresAt: Date;
}
