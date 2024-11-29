import { RoomEntity } from "src/rooms/entities/room.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity({ name: "seats" })
export class SeatEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => RoomEntity, (room) => room.seats, { onDelete: 'CASCADE' })
    room: RoomEntity;  
}
