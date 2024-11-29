import { FilmEntity } from "src/films/entities/film.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "orders"
})
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => UserEntity)
    @Column({
        name: "user_id"
    })
    userId: string;

    @OneToOne(() => FilmEntity)
    @Column({
        name: "film_id"
    })
    filmId: string;
}
