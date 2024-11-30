import { FilmEntity } from "src/films/entities/film.entity";
import { RoomEntity } from "src/rooms/entities/room.entity";
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity({
    name: "sessions"
})
export class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => FilmEntity, (film) => film.id)
    @JoinColumn()
    film: number;

    @Column()
    date: Date;

    @OneToOne(() => RoomEntity, (room) => room.id)
    @JoinColumn()
    room: RoomEntity;
}
