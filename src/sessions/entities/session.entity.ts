import { FilmEntity } from "src/films/entities/film.entity";
import { RoomEntity } from "src/rooms/entities/room.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity({
    name: "sessions"
})
export class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })
    filmId: number;

    @ManyToOne(() => FilmEntity, (film) => film.sessions)
    @JoinColumn()
    film: FilmEntity;

    @Column()
    date: Date;

    @Column({
        nullable: true
    })
    roomId: number;

    @ManyToOne(() => RoomEntity, (room) => room.sessions)
    @JoinColumn()
    room: RoomEntity;
}
