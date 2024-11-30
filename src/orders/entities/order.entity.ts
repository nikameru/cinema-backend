import { FilmEntity } from "src/films/entities/film.entity";
import { SeatEntity } from "src/seats/entities/seat.entity";
import { UserEntity } from "src/users/entities/user.entity";
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity({
    name: "orders"
})
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: "user_id"
    })
    userId: string;

    @OneToOne(() => FilmEntity, (film) => film.id)
    @JoinColumn({
        name: "film_id"
    })
    filmId: string;

    @Column()
    date: Date;

    @OneToMany(() => SeatEntity, (seat) => seat.id)
    seats: SeatEntity[];
}
