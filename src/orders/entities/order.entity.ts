import { FilmEntity } from "src/films/entities/film.entity";
import { UserEntity } from "src/users/entities/user.entity";
import {
    Column,
    Entity,
    JoinColumn,
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
    @JoinColumn()
    user: UserEntity;

    @OneToOne(() => FilmEntity, (film) => film.id)
    @JoinColumn()
    film: FilmEntity;

    @Column()
    date: Date;

    @Column()
    seats: string;
}
