import { OneToMany, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SeatEntity } from "src/seats/entities/seat.entity";
import { SessionEntity } from "src/sessions/entities/session.entity";

@Entity({ name: "rooms" })
export class RoomEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => SeatEntity, (seat) => seat.room, { cascade: true })
    seats: SeatEntity[];

    @OneToMany(() => SessionEntity, (session) => session.room)
    sessions: SessionEntity[];
}
