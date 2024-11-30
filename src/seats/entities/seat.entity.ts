import { RoomEntity } from "src/rooms/entities/room.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity({ name: "seats" })
export class SeatEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => RoomEntity, (room) => room.seats, { onDelete: "CASCADE" })
    @JoinColumn({
        name: "room_id"
    })
    roomId: number;
}
