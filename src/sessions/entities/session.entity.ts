import { FilmEntity } from "src/films/entities/film.entity";
import { RoomEntity } from "src/rooms/entities/room.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "sessions"
})
export class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => FilmEntity)
    @Column()
    filmId: number;

    @Column()
    date: Date;

    @OneToOne(() => RoomEntity)
    @Column()
    roomId: number;
}
