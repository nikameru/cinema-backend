import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "orders"
})
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => FilmEntity)
    @Column({
        name: "film_id"
    })
    filmId: string;
}
