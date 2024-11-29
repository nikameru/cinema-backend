import { OneToMany, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SeatEntity } from "src/seats/entities/seat.entity";

@Entity({ name: "rooms" })
export class RoomEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => SeatEntity, (seat) => seat.room, { cascade: true })
    seats: SeatEntity[];
}
